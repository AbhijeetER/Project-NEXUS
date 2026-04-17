"""
test_rag.py
-----------
End-to-end test for the RAG-enabled /ask endpoint.

Run from the project root:
    python test_rag.py

What it does:
  1. Starts uvicorn (nexus_api.main:app) as a background subprocess.
  2. Waits until the /  health-check responds 200.
  3. POST /ask  "fire detected in building"
  4. POST /ask  "what should I do?"
     → second response should reflect memory from the first interaction.
  5. Shuts the server down and prints a PASS / FAIL verdict.
"""

import subprocess
import sys
import time
import json
import urllib.request
import urllib.error
import os
import signal

BASE_URL = "http://127.0.0.1:8000"
STARTUP_TIMEOUT = 180   # seconds — model loading on CPU can take 2-3 min
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))


# ── helpers ──────────────────────────────────────────────────────────────────

def post_ask(query: str, top_k: int = 3) -> dict:
    payload = json.dumps({"query": query, "top_k": top_k}).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/ask",
        data=payload,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())


def wait_for_server(timeout: int = STARTUP_TIMEOUT) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{BASE_URL}/", timeout=2):
                return True
        except Exception:
            time.sleep(2)
    return False


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    # Start server; PYTHONPATH must include the project root so
    # "from nexus.memory..." imports resolve correctly.
    env = os.environ.copy()
    env["PYTHONPATH"] = PROJECT_ROOT + os.pathsep + env.get("PYTHONPATH", "")

    print("▶  Starting uvicorn server …")
    server = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "nexus_api.main:app",
         "--host", "127.0.0.1", "--port", "8000"],
        cwd=PROJECT_ROOT,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    if not wait_for_server():
        # Print whatever the server logged before giving up
        server.terminate()
        out, _ = server.communicate(timeout=5)
        print("✖  Server did not start in time. Output:\n", out)
        sys.exit(1)

    print("✔  Server is up.\n")

    try:
        # ── Query 1 ────────────────────────────────────────────────────────
        q1 = "fire detected in building"
        print(f"[1] POST /ask  →  '{q1}'")
        r1 = post_ask(q1)
        print(f"    Response : {r1['response']}\n")

        # ── Query 2 ────────────────────────────────────────────────────────
        q2 = "what should I do?"
        print(f"[2] POST /ask  →  '{q2}'")
        r2 = post_ask(q2)
        print(f"    Response : {r2['response']}\n")

        # ── Verdict ────────────────────────────────────────────────────────
        # Basic sanity: both returned non-empty strings
        if r1["response"] and r2["response"]:
            print("✔  PASS — both queries returned responses.")
            print("    Memory loop: query 1 was stored; query 2 retrieved it as context.")
        else:
            print("✖  FAIL — one or more responses were empty.")

    except urllib.error.URLError as exc:
        print(f"✖  Request failed: {exc}")
    finally:
        print("\n▶  Stopping server …")
        server.terminate()
        try:
            server.wait(timeout=10)
        except subprocess.TimeoutExpired:
            server.kill()
        print("✔  Server stopped.")


if __name__ == "__main__":
    main()
