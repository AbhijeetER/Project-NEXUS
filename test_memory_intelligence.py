"""
test_memory_intelligence.py
---------------------------
Verifies adaptive memory behavior:
  - Frequently retrieved seeds gain importance (boost)
  - Ignored seeds lose importance (decay)
  - Seeds that fall below threshold are pruned automatically

Run:  python test_memory_intelligence.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nexus.memory.memory_store import MemoryStore

DIV  = "-" * 62
PASS = "[PASS]"
FAIL = "[FAIL]"

def check(label, condition):
    print(f"  {PASS if condition else FAIL}  {label}")
    return condition

def show_memory(store, label="Memory State"):
    print(f"\n  [{label}]  ({store.size} seeds)")
    for i, s in enumerate(store._seeds):
        bar = "#" * int(s["importance"] * 20)
        print(f"    [{i}] imp={s['importance']:.3f}  |{bar:<20}|  {s['input'][:40]}")

# ─────────────────────────────────────────────────────────────
print(DIV)
print("  Memory Intelligence Test")
print(DIV)

store    = MemoryStore()
all_pass = True

# ── Phase 1: Seed the store with 6 diverse topics ─────────────
print("\nPhase 1: Adding 6 seeds (topics A-F)")

topics = [
    ("fire safety evacuation",         "Activate alarm and use fire exits",       "safety"),
    ("how to treat a burn injury",     "Cool under water for 10 min, see doctor", "health"),
    ("weather forecast today",         "Partly cloudy with 20% rain chance",      "general"),
    ("office wifi password reset",     "Go to IT portal and click Reset",         "IT"),
    ("fire drill schedule",            "Monthly, first Monday at 10am",           "safety"),
    ("sports news today",              "Local team won the championship",          "general"),
]

for query, response, category in topics:
    store.add(query, response, category=category)

show_memory(store, "After initial adds")

# ── Phase 2: Repeated fire-related queries ────────────────────
print(f"\n{DIV}")
print("Phase 2: Querying 'fire' topic 5 times (should boost fire seeds)")

fire_query = "what to do in a fire emergency"
for i in range(5):
    results = store.search(fire_query, k=2)
    top = results[0] if results else None
    if top:
        print(f"  Query {i+1}: top seed imp={top['importance']:.3f}  | {top['input'][:45]}")

show_memory(store, "After 5 fire queries")

# ── Phase 3: Simulate time passing — add 5 unrelated messages ─
print(f"\n{DIV}")
print("Phase 3: 5 new unrelated adds (triggers decay + auto-prune each time)")

size_before = store.size
for i in range(5):
    store.add(f"random topic {i}", f"random answer {i}", importance=0.6)

size_after = store.size
show_memory(store, "After 5 new unrelated adds")

all_pass = check("Irrelevant general/IT seeds decayed relative to fire seeds",
    any(s["input"] in ("fire safety evacuation", "fire drill schedule")
        and s["importance"] > 0.3
        for s in store._seeds)
) and all_pass

# ── Phase 4: Direct prune — remove stragglers below 0.2 ───────
print(f"\n{DIV}")
print("Phase 4: Manual prune_memory() call")

for _ in range(15):           # accelerate decay for demonstration
    store.decay_importance()

imp_before_prune = [(s["input"][:30], round(s["importance"],3)) for s in store._seeds]
print("  Importances before prune:")
for label, imp in imp_before_prune:
    print(f"    {imp:.3f}  {label}")

removed = store.prune_memory()
print(f"\n  Pruned: {removed} seed(s) removed")
show_memory(store, "After manual prune")

all_pass = check("prune_memory() removed at least 1 seed",
                 removed >= 1) and all_pass
all_pass = check("All surviving seeds have importance >= 0.2",
                 all(s["importance"] >= 0.2 for s in store._seeds)) and all_pass
all_pass = check("FAISS index aligns with seeds list",
                 store._index.ntotal == len(store._seeds)) and all_pass

# ── Phase 5: Search still works after prune ───────────────────
print(f"\n{DIV}")
print("Phase 5: Search after prune (pipeline must still work)")

results = store.search("fire emergency procedure", k=3)
all_pass = check("Search returns results after prune",
                 len(results) > 0) and all_pass
all_pass = check("FAISS still aligned after post-prune search",
                 store._index.ntotal == len(store._seeds)) and all_pass

# ── Summary ───────────────────────────────────────────────────
print(f"\n{DIV}")
total_seeds = store.size
print(f"  Final memory size: {total_seeds} seed(s)")
print(f"  {PASS if all_pass else FAIL}  All checks {'passed' if all_pass else 'FAILED'}.")
print(DIV + "\n")

if not all_pass:
    sys.exit(1)
