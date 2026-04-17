import sys; sys.path.insert(0, '.')
from nexus.memory.memory_store import MemoryStore

store = MemoryStore()

# Two semantically similar seeds but very different importance
store.add('fire safety procedures', 'Evacuate via stairways', category='safety', importance=0.1)
store.add('fire emergency steps',   'Call 911 and activate alarm', category='safety', importance=0.9)

results = store.search('what to do in a fire', k=2)

print('Re-ranked order (high importance seed should be first):')
for i, s in enumerate(results, 1):
    print(f'  {i}. importance={round(s["importance"],3)}  |  {s["input"]}')
