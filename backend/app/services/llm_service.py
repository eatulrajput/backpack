import os
import requests

# Pick OLLAMA_URL from environment or default to localhost
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")

def ask_llm(question, context):
    prompt = f"""Use the following college information to answer the user's question:

Context: {context}

Question: {question}
"""

    payload = {
        "model": "phi",
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }

    try:
        res = requests.post(OLLAMA_URL, json=payload)
        res.raise_for_status()
        data = res.json()
        return data["message"]["content"]
    except requests.RequestException as e:
        return f"Request error: {str(e)}"
    except (KeyError, ValueError):
        return "Unexpected response format from LLM."
