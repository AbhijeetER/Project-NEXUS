"""
nexus/rag/rag_pipeline.py
--------------------------
Retrieval-Augmented Generation (RAG) pipeline utilities.

Exposes `build_prompt`, which formats a user query together with a list of
retrieved KnowledgeSeed dicts (from MemoryStore) into a structured LLM prompt.
"""

from __future__ import annotations

from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from nexus.memory.memory_store import KnowledgeSeed


_PROMPT_TEMPLATE = """\
You are NEXUS, an evolving AI system.

Context:
{context}

User Query:
{query}

Answer intelligently using the most relevant patterns from context."""


def _format_seed(seed: "KnowledgeSeed") -> str:
    """Render a single Knowledge Seed as a labelled Q/A block."""
    return (
        f"[Category: {seed['category']} | Importance: {seed['importance']}]\n"
        f"Q: {seed['input']}\n"
        f"A: {seed['output']}"
    )


def build_prompt(query: str, seeds: "List[KnowledgeSeed]") -> str:
    """
    Combine retrieved Knowledge Seeds and a user query into a prompt string.

    Parameters
    ----------
    query:
        The raw user question / input.
    seeds:
        Ordered list of KnowledgeSeed dicts from ``MemoryStore.search()``.
        Each seed is rendered as a labelled [Category | Importance] Q/A block.

    Returns
    -------
    str
        A fully formatted prompt ready to be forwarded to the LLM.

    Example output
    --------------
    You are NEXUS, an evolving AI system.

    Context:
    [Category: emergency | Importance: 0.5]
    Q: fire detected in building
    A: Evacuate immediately and call emergency services.

    User Query:
    what should I do?

    Answer intelligently using the most relevant patterns from context.
    """
    if seeds:
        context = "\n\n".join(_format_seed(s) for s in seeds)
    else:
        context = "(no prior context)"

    return _PROMPT_TEMPLATE.format(context=context, query=query)
