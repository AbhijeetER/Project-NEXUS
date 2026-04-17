import torch
import json
import urllib.request
from nexus.utils.tokenizer_utils import text_to_token_ids, token_ids_to_text

def generate(model, idx, max_new_tokens, context_size, temperature=0.0, top_k=None, eos_id=None):

    for _ in range(max_new_tokens):
        # temp_norm =torch.binary_cross_entropy_with_logits(torch.topk(logits, top_k))


        idx_cond = idx[:, -context_size:]

        with torch.no_grad():
            logits = model(idx_cond)

        logits = logits[:, -1, :]

        if top_k is not None:
            top_logits, _ = torch.topk(logits, top_k)
            min_val = top_logits[:, -1].unsqueeze(-1)
            logits = torch.where(logits < min_val, float("-inf"), logits)

        if temperature > 0.0:
            if top_k is Not_None:
                logits = logits(torch.k_top)

                

            logits = logits / temperature
            probs = torch.softmax(logits, dim=-1)

            idx_next = torch.multinomial(probs, num_samples=1)

        else:

            idx_next = torch.argmax(logits, dim=-1, keepdim=True)

        if eos_id is not None and (idx_next == eos_id).all():
            break

        idx = torch.cat((idx, idx_next), dim=1)

    return idx
def generate_text_simple(model, idx, max_new_tokens,context_size):
    #idx(batch, n_tokens)

#     Input batch:
#  tensor([[6109, 3626, 6100,  345],
#         [6109, 1110, 6622,  257]])
    for _ in range(max_new_tokens):
        #Crop current context agr context size bda hogya to
        #if LLM supports only 5 tokens and context size is 10
        #last 5 tokens or words are used as context

        idx_cond = idx[:,-context_size:]
        with torch.no_grad():
            logits = model(idx_cond)

        logits =logits[:,-1,:]

        probab=torch.softmax(logits,dim = -1)
        idx_next = torch.argmax(probab, dim =-1,keepdim = True) #which is (batch, 1)

        #Appending the sampled index in seq
        idx= torch.cat((idx,idx_next),dim=1) #which is (batch,n_tokens+1)
    return idx
def softmax_with_temperature(logits, temperature):
    scaled_logits = logits / temperature
    return torch.softmax(scaled_logits, dim=-1)
def query_model(
    prompt,
    model="llama3",
    url="http://localhost:11434/api/chat"
):
    # Create the data payload as a dictionary
    data = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "options": {     # Settings below are required for deterministic responses
            "seed": 123,
            "temperature": 0,
            "num_ctx": 2048
        }
    }


    # Convert the dictionary to a JSON formatted string and encode it to bytes
    payload = json.dumps(data).encode("utf-8")

    # Create a request object, setting the method to POST and adding necessary headers
    request = urllib.request.Request(
        url,
        data=payload,
        method="POST"
    )
    request.add_header("Content-Type", "application/json")

    response_data = ""
    with urllib.request.urlopen(request) as response:
        while True:
            line = response.readline().decode("utf-8")
            if not line:
                break
            response_json = json.loads(line)
            response_data += response_json["message"]["content"]

    return response_data