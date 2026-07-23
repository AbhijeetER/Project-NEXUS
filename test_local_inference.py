import os
import sys
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

# Ensure project root is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = "nexus_lora2"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Loading local model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, use_fast=True)
base_model = AutoModelForCausalLM.from_pretrained("gpt2")
model = PeftModel.from_pretrained(base_model, MODEL_PATH)
model.to(device)
model.eval()

# Test queries
queries = [
    "fire detected in building",
    "what should I do?",
    "how to treat a burn injury",
    "sports news today"
]

def format_prompt(query):
    return f"### Instruction:\n{query}\n\n### Response:\n"

print("\n--- Running Local Inference Test ---")
for q in queries:
    prompt = format_prompt(q)
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=60,
            do_sample=True,
            temperature=0.85,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.3,
            pad_token_id=tokenizer.eos_token_id
        )
    
    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = decoded.split("### Response:")[-1].strip() if "### Response:" in decoded else decoded
    
    print(f"\nQUERY   : {q}")
    print(f"RESPONSE: {response}")
    print("-" * 50)
