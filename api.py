from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt

app = FastAPI()

# Load once (IMPORTANT)
MODEL_PATH = "nexus_lora2"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
base_model = AutoModelForCausalLM.from_pretrained("gpt2")
model = PeftModel.from_pretrained(base_model, MODEL_PATH)
model.to(device)
model.eval()

memory = MemoryStore()

class Query(BaseModel):
    text: str

def generate(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=80)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

@app.post("/chat")
def chat(query: Query):
    context = memory.search(query.text, k=3)
    prompt = build_prompt(query.text, context)
    response = generate(prompt)
    memory.add(query.text, response)
    return {"response": response}