# ============================================================
# Project NEXUS — Production Dockerfile
# Base: Python 3.10 slim (smaller footprint, same ABI)
# Entrypoint: uvicorn → nexus_api/main.py (FastAPI)
# ============================================================

# ---- Stage 1: dependency builder ----
FROM python:3.10-slim AS builder

# System packages needed to compile C/Fortran extensions
# (faiss-cpu, sentencepiece, numpy, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        g++ \
        gfortran \
        libopenblas-dev \
        liblapack-dev \
        git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy only the requirements first — leverages Docker layer caching.
# pip install will only re-run when requirements.txt changes.
COPY requirements.txt .

# Install all Python deps into an isolated prefix so we can copy
# them cleanly into the final stage without carrying build tools.
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir --prefix=/install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu


# ---- Stage 2: runtime image ----
FROM python:3.10-slim AS runtime

LABEL maintainer="Project NEXUS"
LABEL description="Project NEXUS API — FastAPI + HuggingFace LoRA + FAISS RAG"

# Runtime system libraries required by faiss, sentencepiece, torch
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgomp1 \
        libopenblas0 \
    && rm -rf /var/lib/apt/lists/*

# Pull the pre-built Python packages from the builder stage
COPY --from=builder /install /usr/local

# ── Non-root user for container security ──────────────────────────────────────
RUN useradd --create-home --shell /bin/bash nexus
USER nexus
WORKDIR /home/nexus/app

# Copy the full application source code
# (node_modules, .venv, __pycache__ are excluded via .dockerignore)
COPY --chown=nexus:nexus . .

# ── Environment variables ─────────────────────────────────────────────────────
# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # HuggingFace caches (writable by the nexus user inside the container)
    HF_HOME=/home/nexus/.cache/huggingface \
    TRANSFORMERS_CACHE=/home/nexus/.cache/huggingface/transformers \
    # Sentence-Transformers model cache
    SENTENCE_TRANSFORMERS_HOME=/home/nexus/.cache/sentence_transformers \
    # Torch: disable unnecessary telemetry
    TOKENIZERS_PARALLELISM=false

# Create writable cache directories
RUN mkdir -p \
    /home/nexus/.cache/huggingface \
    /home/nexus/.cache/sentence_transformers

# ── Port ──────────────────────────────────────────────────────────────────────
EXPOSE 8000

# ── Health check ──────────────────────────────────────────────────────────────
# Docker / Kubernetes can use this to decide when the container is ready.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# ── Entrypoint ────────────────────────────────────────────────────────────────
# --workers 1 : keep a single worker so the shared in-memory MemoryStore
#               stays consistent (scale horizontally via replicas instead).
# --timeout-keep-alive : long-lived connections for streaming responses.
CMD ["uvicorn", "nexus_api.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "1", \
     "--timeout-keep-alive", "30", \
     "--log-level", "info"]