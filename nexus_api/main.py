from fastapi import FastAPI
from pydantic import BaseModel

import os
import torch

from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from fastapi.middleware.cors import CORSMiddleware

# --- RAG integration ---
from nexus.memory.memory_store import MemoryStore
from nexus.rag.rag_pipeline import build_prompt


# -----------------------------
# Initialize FastAPI
# -----------------------------
app = FastAPI(title="Project NEXUS API")


# -----------------------------
# Enable CORS
# -----------------------------
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Device configuration
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# -----------------------------
# Model path  (absolute, anchored to this file's location)
# -----------------------------
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "nexus_lora2")


# -----------------------------
# Load tokenizer
# -----------------------------
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_PATH,
    use_fast=True
)


# -----------------------------
# Load base GPT-2
# -----------------------------
base_model = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)


# -----------------------------
# Attach LoRA adapter
# -----------------------------
model = PeftModel.from_pretrained(base_model, MODEL_PATH)

model.to(device)
model.eval()


# -----------------------------
# Global MemoryStore instance & persistence
# -----------------------------
MEMORY_DIR = os.getenv("NEXUS_MEMORY_DIR")
memory_store = MemoryStore()
if MEMORY_DIR:
    memory_store.load_from_disk(MEMORY_DIR)


# -----------------------------
# Request schemas
# -----------------------------
class PromptRequest(BaseModel):
    prompt: str


class AskRequest(BaseModel):
    query: str
    top_k: int = 3


# -----------------------------
# Health check endpoint
# -----------------------------
@app.get("/")
def home():
    return {"message": "Project NEXUS API running successfully"}


# -----------------------------
# Internal generation helper
# -----------------------------
def _generate_response(prompt: str) -> str:
    """Tokenize *prompt*, run the LoRA model, and return the decoded response."""
    formatted = f"""### Instruction:
{prompt}

### Response:
"""
    inputs = tokenizer(formatted, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=60,
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


# -----------------------------
# Text generation endpoint
# -----------------------------
@app.post("/generate")
def generate_text(request: PromptRequest):
    return {"response": _generate_response(request.prompt)}


# -----------------------------
# RAG-powered ask endpoint
# -----------------------------
@app.post("/ask")
def ask(request: AskRequest):
    # 1. Retrieve top-k relevant context from memory
    context_list = memory_store.search(request.query, k=request.top_k)

    # 2. Build a RAG prompt combining context + query
    prompt = build_prompt(query=request.query, seeds=context_list)

    # 3. Generate a response from the LLM
    response = _generate_response(prompt)

    # 4. Store the interaction back into memory for future retrievals
    memory_store.add(query=request.query, response=response)
    if MEMORY_DIR:
        memory_store.save_to_disk(MEMORY_DIR)

    return {"response": response}