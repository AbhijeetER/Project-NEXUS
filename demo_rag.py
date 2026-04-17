"""
demo_rag.py
-----------
Verbose demo — shows the Knowledge Seed RAG pipeline step by step.
Run from project root:  python demo_rag.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt

store = MemoryStore()

def ask(query: str, mock_response: str, category: str = "general"):
    print(f"\n{'='*60}")
    print(f"  QUERY : {query}")
    print(f"{'='*60}")

    context = store.search(query, k=3)

    print(f"\n  [Memory retrieved — {len(context)} seed(s)]")
    if context:
        for i, seed in enumerate(context, 1):
            print(f"    {i}. [{seed['category']}] Q: {seed['input']}")
            print(f"          A: {seed['output']}")
    else:
        print("    (none — memory is empty)")

    prompt = build_prompt(query=query, seeds=context)
    print(f"\n  [Prompt sent to LLM]\n")
    print("  " + "\n  ".join(prompt.splitlines()))

    response = mock_response
    print(f"\n  [Response]\n  {response}")

    store.add(query=query, response=response, category=category)

    seed = store._seeds[-1]
    print(f"\n  [Stored Knowledge Seed]")
    print(f"    input      : {seed['input']}")
    print(f"    output     : {seed['output']}")
    print(f"    category   : {seed['category']}")
    print(f"    importance : {seed['importance']}")
    print(f"    embedding  : [{seed['embedding'][0]:.4f}, {seed['embedding'][1]:.4f}, ... "
          f"({len(seed['embedding'])} dims)]")
    print(f"\n  [MemoryStore size: {store.size}]")

# ── Two turns ─────────────────────────────────────────────
ask(
    query="fire detected in building",
    mock_response="Evacuate immediately, activate the fire alarm, and call emergency services.",
    category="emergency"
)

ask(
    query="what should I do?",
    mock_response="Based on the fire situation, evacuate calmly and meet at the assembly point.",
    category="general"
)

print(f"\n{'='*60}")
print("  Demo complete. Knowledge Seed RAG loop verified.")
print(f"{'='*60}\n")
