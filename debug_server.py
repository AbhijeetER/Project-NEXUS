"""
debug_server.py  —  start uvicorn and print all output for 30 s then quit.
Run from project root:  python debug_server.py
"""
import subprocess, sys, os, time

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
env = os.environ.copy()
env["PYTHONPATH"] = PROJECT_ROOT + os.pathsep + env.get("PYTHONPATH", "")

server = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "nexus_api.main:app",
     "--host", "127.0.0.1", "--port", "8000"],
    cwd=PROJECT_ROOT,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)

deadline = time.time() + 40
while time.time() < deadline:
    line = server.stdout.readline()
    if line:
        print(line, end="")
    if server.poll() is not None:
        # process already died — drain remaining output
        for line in server.stdout:
            print(line, end="")
        break

server.terminate()
server.wait(timeout=5)
