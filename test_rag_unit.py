"""
test_rag_unit.py
----------------
Verifies the RAG memory + retrieval + prompt loop using structured
Knowledge Seeds (the refactored MemoryStore).

Run from project root:
    python test_rag_unit.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt

PASS = "\033[92m✔  PASS\033[0m"
FAIL = "\033[91m✖  FAIL\033[0m"
SEP  = "─" * 60


def check(description: str, condition: bool) -> bool:
    print(f"  {PASS if condition else FAIL}  {description}")
    return condition


def simulate_ask(store: MemoryStore, query: str, top_k: int = 3,
                 mock_response: str = "[model response]",
                 category: str = "general") -> dict:
    """Mirror of the /ask endpoint — no LLM call."""
    context_list = store.search(query, k=top_k)
    prompt       = build_prompt(query=query, seeds=context_list)
    response     = mock_response
    store.add(query=query, response=response, category=category)
    return {"response": response, "context_list": context_list, "prompt": prompt}


# ─────────────────────────────────────────────────────────────────────────────
print(SEP)
print(" RAG Unit Test — Knowledge Seed memory + retrieval + prompt loop")
print(SEP)

all_passed = True
store = MemoryStore()

# ── Test 1: fresh store ───────────────────────────────────────────────────────
print("\n[1]  Empty store sanity")
all_passed = check("store.size == 0 on init",       store.size == 0) and all_passed
all_passed = check("search on empty store returns []", store.search("anything") == []) and all_passed

# ── Test 2: Query 1 ───────────────────────────────────────────────────────────
print("\n[2]  Query 1 → 'fire detected in building'")
Q1  = "fire detected in building"
R1  = "Evacuate immediately and call emergency services."
r1  = simulate_ask(store, Q1, mock_response=R1, category="emergency")

all_passed = check("No context on first query (empty memory)",
                   r1["context_list"] == []) and all_passed
all_passed = check("Prompt contains the query",
                   Q1 in r1["prompt"]) and all_passed
all_passed = check("Prompt contains NEXUS system header",
                   "You are NEXUS" in r1["prompt"]) and all_passed
all_passed = check("Memory grew to 1 seed",
                   store.size == 1) and all_passed

# ── Test 3: Seed structure ────────────────────────────────────────────────────
print("\n[3]  Knowledge Seed structure")
seed = store._seeds[0]
all_passed = check("seed has 'input' key",      "input"      in seed) and all_passed
all_passed = check("seed has 'output' key",     "output"     in seed) and all_passed
all_passed = check("seed has 'embedding' key",  "embedding"  in seed) and all_passed
all_passed = check("seed has 'category' key",   "category"   in seed) and all_passed
all_passed = check("seed has 'importance' key", "importance" in seed) and all_passed
all_passed = check("seed['input'] == Q1",       seed["input"] == Q1) and all_passed
all_passed = check("seed['output'] == R1",      seed["output"] == R1) and all_passed
all_passed = check("seed['category'] == 'emergency'", seed["category"] == "emergency") and all_passed
all_passed = check("seed['importance'] == 0.5", seed["importance"] == 0.5) and all_passed
all_passed = check("embedding is a list of 384 floats",
                   isinstance(seed["embedding"], list) and len(seed["embedding"]) == 384) and all_passed

# ── Test 4: Query 2 retrieves context ─────────────────────────────────────────
print("\n[4]  Query 2 → 'what should I do?' (should recall Query 1 context)")
Q2 = "what should I do?"
R2 = "Follow evacuation procedures and alert the fire brigade."
r2 = simulate_ask(store, Q2, mock_response=R2)

all_passed = check("Context list is non-empty (memory recalled)",
                   len(r2["context_list"]) > 0) and all_passed
fire_in_context = any("fire" in s["input"].lower() or "evacuate" in s["output"].lower()
                      for s in r2["context_list"])
all_passed = check("Fire/evacuation seed retrieved from memory",
                   fire_in_context) and all_passed
all_passed = check("Prompt contains 'Q:' block from seed",
                   "Q:" in r2["prompt"]) and all_passed
all_passed = check("Prompt contains 'A:' block from seed",
                   "A:" in r2["prompt"]) and all_passed
all_passed = check("Memory now has 2 seeds",
                   store.size == 2) and all_passed

print(f"\n  Retrieved context for Query 2:")
for i, s in enumerate(r2["context_list"], 1):
    print(f"    [{i}] [{s['category']}] Q: {s['input']}")
    print(f"          A: {s['output']}")

# ── Test 5: build_prompt formatting ───────────────────────────────────────────
print(f"\n[5]  build_prompt formatting")
seeds = [{
    "input": "Line one query.", "output": "Line one answer.",
    "embedding": [], "category": "general", "importance": 0.5
}]
p = build_prompt("test query", seeds)
all_passed = check("'Q:' present in prompt",          "Q:" in p) and all_passed
all_passed = check("'A:' present in prompt",          "A:" in p) and all_passed
all_passed = check("'User Query:' section",           "User Query:" in p) and all_passed
all_passed = check("'Context:' section",              "Context:" in p) and all_passed
all_passed = check("'[Category:' label present",      "[Category:" in p) and all_passed
all_passed = check("'| Importance:' label present",   "| Importance:" in p) and all_passed

empty_p = build_prompt("test", [])
all_passed = check("Empty seeds shows fallback text",
                   "(no prior context)" in empty_p) and all_passed

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n{SEP}")
if all_passed:
    print(f"\n{PASS}  All checks passed — Knowledge Seed RAG loop is working.\n")
else:
    print(f"\n{FAIL}  One or more checks failed — see output above.\n")
    sys.exit(1)
