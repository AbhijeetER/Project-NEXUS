import sys; sys.path.insert(0, '.')
from nexus.memory.memory_store import MemoryStore

store = MemoryStore()

# Add 5 seeds: 3 with importance below threshold, 2 above
store.add('q1', 'a1', importance=0.05)   # will be pruned
store.add('q2', 'a2', importance=0.10)   # will be pruned
store.add('q3', 'a3', importance=0.50)   # survives
store.add('q4', 'a4', importance=0.80)   # survives
# 5th add triggers auto-prune (PRUNE_AFTER_SIZE=5)
store.add('q5', 'a5', importance=0.15)   # itself will be pruned after decay

print(f'Seeds after 5 adds (auto-prune ran): {store.size}')
print(f'FAISS count matches seeds list:      {store._index.ntotal == len(store._seeds)}')

for i, s in enumerate(store._seeds):
    print(f'  [{i}] importance={round(s["importance"],3)}  input={s["input"]}')

# Manual prune after decaying manually
for _ in range(30):
    store.decay_importance()
removed = store.prune_memory()
print(f'\nAfter 30 manual decays + prune: {removed} seed(s) removed')
print(f'Remaining: {store.size}')
print(f'FAISS still aligned: {store._index.ntotal == len(store._seeds)}')

# Search still works after prune
results = store.search('q3', k=2)
print(f'Search returns {len(results)} result(s) — pipeline intact')
