# generate_ordersheet.py
import sys
import json
from llama_cpp import Llama
import os

model_path = os.path.join(os.path.dirname(__file__), "models", "mistral-7b-instruct-v0.2.Q4_K_M.gguf")
llm = Llama(
    model_path=model_path,
    n_ctx=2048,
    n_threads=8,
    # n_gpu_layers=25,
    verbose=False
)

def generate_ordersheet(transcript, case_info):
    prompt = f"""
You are a professional judicial clerk of a Pakistani court.

Your task is to prepare ONLY the following parts from the case info and transcript:
- PROCEEDINGS: Brief factual summary
- ORDERS: Numbered orders passed by the court
- NEXT DATE OF HEARING: If mentioned, otherwise write "To be fixed"

IMPORTANT:
- Do NOT include any headers, case number, court, parties, or formatting
- Do NOT overwrite existing template HTML

CASE INFORMATION:
{case_info}

HEARING TRANSCRIPT:
{transcript}

Return ONLY the summary, orders, and next hearing date in plain text, suitable for inserting inside the "Order with signature" table cell.
"""

    response = llm(prompt, max_tokens=500, temperature=0.7, top_p=0.9)
    return response["choices"][0]["text"].strip()

if __name__ == "__main__":
    input_json = json.loads(sys.stdin.read())
    transcript = input_json.get("transcript", "")
    case_info = input_json.get("case_info", {})
    output = generate_ordersheet(transcript, case_info)
    print(output)
