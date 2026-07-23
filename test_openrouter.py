import os
import sys
import json
import urllib.request

# Model name for a very lightweight/weak model on OpenRouter (Free tier)
OPENROUTER_MODEL = "openrouter/free"

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("ERROR: Please set the OPENROUTER_API_KEY environment variable before running this script.")
    print("Example: $env:OPENROUTER_API_KEY='your_key' (PowerShell) or export OPENROUTER_API_KEY='your_key' (Bash)")
    sys.exit(1)

def query_openrouter(prompt: str, model_name: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    system_instruction = "\n\n[Instruction: Keep your response concise and under 10 lines.]"
    data = {
        "model": model_name,
        "messages": [
            {"role": "user", "content": prompt + system_instruction}
        ],
        "max_tokens": 150
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            
            choices = res_data.get("choices")
            if not choices:
                return f"Request Failed: No choices returned. Response: {json.dumps(res_data)}"
                
            message = choices[0].get("message", {})
            content = message.get("content")
            if content is None:
                return f"Request Failed: Content was null. Response: {json.dumps(res_data)}"
                
            return content.strip()
    except Exception as e:
        return f"Request Failed: {str(e)}"

# Test queries
queries = [
    "fire detected in building",
    "what should I do?",
    "how to treat a burn injury",
    "sports news today"
]

print(f"Testing OpenRouter with weak model: {OPENROUTER_MODEL}\n")

for q in queries:
    print(f"QUERY   : {q}")
    response = query_openrouter(q, OPENROUTER_MODEL)
    print(f"RESPONSE: {response}")
    print("-" * 60)
