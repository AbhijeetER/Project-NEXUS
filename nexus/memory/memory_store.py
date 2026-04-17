"""
nexus/memory/memory_store.py
----------------------------
In-memory semantic store backed by FAISS and sentence-transformers.
Each stored unit is a structured Knowledge Seed — a dict capturing the
original query, model response, embedding vector, category, and importance.

Embedding model : all-MiniLM-L6-v2  (output dim = 384)
FAISS index     : IndexFlatL2        (exact L2 nearest-neighbour search)
"""

from __future__ import annotations

from typing import TypedDict

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

_EMBED_MODEL = "all-MiniLM-L6-v2"
_EMBED_DIM = 384


class KnowledgeSeed(TypedDict):
    """Structured unit of memory stored for semantic retrieval."""
    input:      str            # original user query
    output:     str            # model response
    embedding:  list[float]    # raw vector (for inspection / persistence later)
    category:   str            # semantic label, default "general"
    importance: float          # relevance weight, default 0.5


class MemoryStore:
    """
    Non-persistent, in-memory semantic store using Knowledge Seeds.

    Usage
    -----
    store = MemoryStore()
    store.add("What is RAG?", "RAG stands for Retrieval-Augmented Generation.")
    results = store.search("retrieval augmented generation", k=2)
    # results → list of KnowledgeSeed dicts
    """

    def __init__(self) -> None:
        self._model  = SentenceTransformer(_EMBED_MODEL)
        self._index  = faiss.IndexFlatL2(_EMBED_DIM)
        self._seeds: list[KnowledgeSeed] = []

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def add(
        self,
        query:      str,
        response:   str,
        category:   str   = "general",
        importance: float = 0.5,
    ) -> None:
        """
        Encode the combined query + response and store a Knowledge Seed.

        Parameters
        ----------
        query:
            The user's input string.
        response:
            The model's output string.
        category:
            Optional semantic label (e.g. "emergency", "general").
        importance:
            Relevance weight in [0, 1]; default 0.5.
        """
        combined   = f"{query} {response}"
        embedding  = self._encode(combined)          # (1, 384) float32

        seed: KnowledgeSeed = {
            "input":      query,
            "output":     response,
            "embedding":  embedding[0].tolist(),     # store as plain list
            "category":   category,
            "importance": importance,
        }

        # Age all existing seeds before storing the new one
        self.decay_importance()

        self._index.add(embedding)                   # FAISS index stays aligned
        self._seeds.append(seed)

        # Prune low-importance seeds once the store is large enough
        if self._index.ntotal >= self._PRUNE_AFTER_SIZE:
            self.prune_memory()

    _IMPORTANCE_BOOST   = 0.05   # reward applied to each retrieved seed
    _IMPORTANCE_CAP     = 1.0    # maximum importance value
    _IMPORTANCE_DECAY   = 0.01   # penalty applied to all seeds on each new add()
    _IMPORTANCE_FLOOR   = 0.0    # minimum importance value
    _PRUNE_THRESHOLD    = 0.2    # seeds below this importance are removed
    _PRUNE_AFTER_SIZE   = 5      # only prune once store has this many seeds

    def search(self, query: str, k: int = 5) -> list[KnowledgeSeed]:
        """
        Return the top-*k* Knowledge Seeds re-ranked by a combined score.

        Retrieval pipeline
        ------------------
        1. FAISS returns top-k candidates by L2 distance.
        2. L2 distance is converted to a similarity score:
               similarity = 1 / (1 + distance)      # in (0, 1]
        3. Combined score for re-ranking:
               score = similarity + seed importance  # max theoretical: 2.0
        4. Candidates are re-sorted descending by combined score.
        5. Importance of returned seeds is boosted by ``_IMPORTANCE_BOOST``.

        Parameters
        ----------
        query:
            Search string to embed and compare against stored seeds.
        k:
            Number of nearest neighbours. Clamped to store size automatically.

        Returns
        -------
        list[KnowledgeSeed]
            Seeds ordered by combined (similarity + importance) score,
            with importance already updated in place.
            Returns an empty list if the store is empty.
        """
        if self._index.ntotal == 0:
            return []

        k = min(k, self._index.ntotal)
        query_vec = self._encode(query)                       # (1, 384)
        distances, indices = self._index.search(query_vec, k) # (1, k) each

        # Build (seed, combined_score) pairs
        candidates: list[tuple[KnowledgeSeed, float]] = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue
            seed       = self._seeds[idx]
            similarity = 1.0 / (1.0 + float(dist))   # L2 → similarity in (0,1]
            score      = similarity + seed["importance"]
            candidates.append((seed, score))

        # Re-rank: highest combined score first
        candidates.sort(key=lambda x: x[1], reverse=True)
        results = [seed for seed, _ in candidates]

        # Reward retrieved seeds — boost importance, cap at 1.0
        for seed in results:
            seed["importance"] = min(
                seed["importance"] + self._IMPORTANCE_BOOST,
                self._IMPORTANCE_CAP,
            )

        return results

    # ------------------------------------------------------------------
    # Importance management
    # ------------------------------------------------------------------

    def decay_importance(self) -> None:
        """
        Decrease the importance of every stored seed by ``_IMPORTANCE_DECAY``.

        Called automatically inside ``add()`` so each new interaction acts
        as a time-step that ages existing knowledge.  Seeds that are never
        retrieved will gradually approach 0; frequently retrieved seeds
        stay high due to the boost applied in ``search()``.

        Floor is ``_IMPORTANCE_FLOOR`` (0.0) — importance never goes negative.
        """
        for seed in self._seeds:
            seed["importance"] = max(
                seed["importance"] - self._IMPORTANCE_DECAY,
                self._IMPORTANCE_FLOOR,
            )

    def prune_memory(self) -> int:
        """
        Remove seeds whose importance has fallen below ``_PRUNE_THRESHOLD``.

        After filtering, the FAISS index is fully rebuilt from the stored
        embedding vectors of the surviving seeds, keeping index positions
        perfectly aligned with ``self._seeds``.

        Returns
        -------
        int
            Number of seeds removed.
        """
        surviving = [
            seed for seed in self._seeds
            if seed["importance"] >= self._PRUNE_THRESHOLD
        ]
        removed = len(self._seeds) - len(surviving)

        if removed == 0:
            return 0

        # Rebuild FAISS index from surviving seeds' stored embeddings
        self._index.reset()                          # clears all vectors
        self._seeds = surviving

        if surviving:
            vectors = np.array(
                [s["embedding"] for s in surviving], dtype=np.float32
            )                                        # (n, 384)
            self._index.add(vectors)                 # re-add in one batch

        return removed

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def size(self) -> int:
        """Number of Knowledge Seeds currently in the store."""
        return self._index.ntotal

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    def _encode(self, text: str) -> np.ndarray:
        """Encode *text* to a (1, 384) float32 numpy array."""
        vec = self._model.encode([text], convert_to_numpy=True)
        return vec.astype(np.float32)
