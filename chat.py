"""
chat.py  --  Interactive RAG chat with NEXUS
--------------------------------------------
Loads the model once, then lets you type queries in a loop.
Each turn prints a transparent breakdown of every pipeline step.

Run from project root:
    python chat.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("\n  Loading NEXUS... (this takes ~30s on first run)\n")

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt

# ── Load model ────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "nexus_lora2")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, use_fast=True)
base_model = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)
model = PeftModel.from_pretrained(base_model, MODEL_PATH)
model.to(device)
model.eval()

# ── Load memory ───────────────────────────────────────────
memory = MemoryStore()


def generate(prompt: str) -> str:
    formatted = f"### Instruction:\n{prompt}\n\n### Response:\n"
    inputs = tokenizer(formatted, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=80,
            do_sample=True,
            temperature=0.85,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.3,
            no_repeat_ngram_size=3,
            pad_token_id=tokenizer.eos_token_id
        )
    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
    if "### Response:" in decoded:
        decoded = decoded.split("### Response:")[-1].strip()
    return decoded


# ── Chat loop ─────────────────────────────────────────────
print("  NEXUS is ready. Type your query below (Ctrl+C to quit).\n")
print("-" * 60)

while True:
    try:
        query = input("\nYou: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n\n  Exiting. Goodbye!\n")
        break

    if not query:
        continue

    print("\n" + "-" * 60)

    # ── STEP 1: Retrieve ──────────────────────────────────
    context = memory.search(query, k=3)
    print(f"  [STEP 1 - RETRIEVE]  {len(context)} seed(s) from memory")
    if context:
        for i, seed in enumerate(context, 1):
            print(f"    {i}. category   : {seed['category']}")
            print(f"       importance  : {seed['importance']}")
            print(f"       input  (Q)  : {seed['input']}")
            print(f"       output (A)  : {seed['output']}")
    else:
        print("    (memory is empty -- no context retrieved)")

    # ── STEP 2: Build prompt ───────────────────────────────
    prompt = build_prompt(query=query, seeds=context)
    print(f"\n  [STEP 2 - PROMPT SENT TO LLM]")
    for line in prompt.splitlines():
        print(f"    {line}")

    # ── STEP 3: Generate ───────────────────────────────────
    print(f"\n  [STEP 3 - GENERATE]")
    response = generate(prompt)
    print(f"  NEXUS: {response}")

    # ── STEP 4: Store ──────────────────────────────────────
    memory.add(query=query, response=response)
    stored = memory._seeds[-1]
    print(f"\n  [STEP 4 - STORED TO MEMORY]")
    print(f"    category   : {stored['category']}")
    print(f"    importance : {stored['importance']}")
    print(f"    input      : {stored['input']}")
    print(f"    output     : {stored['output']}")
    print(f"    embedding  : [{stored['embedding'][0]:.4f}, {stored['embedding'][1]:.4f}, ...]  (384 dims)")
    print(f"    total seeds in memory : {memory.size}")

    print("-" * 60)
