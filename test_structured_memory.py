"""
test_structured_memory.py
--------------------------
Verifies the full transition from raw text → structured Knowledge Seeds.
Shows exact prompt structure, category labels, and cross-query retrieval.

Run from project root:  python test_structured_memory.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt

PASS = "PASS"
FAIL = "FAIL"
DIV  = "=" * 62

def check(label, condition):
    status = PASS if condition else FAIL
    print(f"  [{status}]  {label}")
    return condition

def simulate_ask(store, query, mock_response, category="general"):
    """Exact /ask endpoint logic — no LLM call."""
    seeds   = store.search(query)                        # default k=5
    prompt  = build_prompt(query=query, seeds=seeds)
    store.add(query=query, response=mock_response, category=category)
    return seeds, prompt, mock_response

# ─────────────────────────────────────────────────────────────
print(DIV)
print("  Structured Knowledge Seed — Integration Test")
print(DIV)

store    = MemoryStore()
all_pass = True

# ── Turn 1 ────────────────────────────────────────────────────
Q1 = "How do I stay safe during a fire?"
A1 = "Activate the alarm, evacuate via stairways, call 911, and meet at the assembly point."

print(f"\nTurn 1  QUERY : {Q1}")
seeds1, prompt1, _ = simulate_ask(store, Q1, A1, category="safety")

print(f"\n  --- PROMPT SENT TO LLM ---")
print(prompt1)

all_pass = check("No prior context on Turn 1 (empty memory)",
                 "(no prior context)" in prompt1) and all_pass
all_pass = check("Prompt contains NEXUS header",
                 "You are NEXUS" in prompt1) and all_pass
all_pass = check("Store has 1 seed after Turn 1",
                 store.size == 1) and all_pass
all_pass = check("Seed category is 'safety'",
                 store._seeds[0]["category"] == "safety") and all_pass

# ── Turn 2 ────────────────────────────────────────────────────
Q2 = "What should I do if I smell smoke in the office?"
A2 = "Leave the area immediately, alert others, use the fire exit, and do not use elevators."

print(f"\n{DIV}")
print(f"Turn 2  QUERY : {Q2}")
seeds2, prompt2, _ = simulate_ask(store, Q2, A2, category="safety")

print(f"\n  --- PROMPT SENT TO LLM ---")
print(prompt2)

print(f"\n  --- RETRIEVED SEEDS ---")
for i, s in enumerate(seeds2, 1):
    print(f"  [{i}] Category  : {s['category']}")
    print(f"       Importance : {s['importance']}")
    print(f"       Input      : {s['input']}")
    print(f"       Output     : {s['output']}")

all_pass = check("Turn 2 retrieved prior seed (memory active)",
                 len(seeds2) > 0) and all_pass
all_pass = check("Retrieved seed has [Category:] label in prompt",
                 "[Category:" in prompt2) and all_pass
all_pass = check("Retrieved seed has | Importance: label in prompt",
                 "| Importance:" in prompt2) and all_pass
all_pass = check("Q/A block present in prompt",
                 "Q:" in prompt2 and "A:" in prompt2) and all_pass
all_pass = check("Fire context carried over into Turn 2 prompt",
                 "fire" in prompt2.lower() or "safe" in prompt2.lower()) and all_pass
all_pass = check("Prompt footer is structured patterns instruction",
                 "most relevant patterns from context" in prompt2) and all_pass
all_pass = check("Store has 2 seeds after Turn 2",
                 store.size == 2) and all_pass

# ── Summary ───────────────────────────────────────────────────
print(f"\n{DIV}")
if all_pass:
    print("  PASS  All checks passed. Structured memory pipeline verified.\n")
else:
    print("  FAIL  One or more checks failed.\n")
    sys.exit(1)
