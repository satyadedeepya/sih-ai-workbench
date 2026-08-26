import requests

/**
 * PERSON 3: AI MODELS & MODEL ROUTER ENGINEER
 * 
 * TODOs for ollama_client.py:
 * 1. Write helper functions to call the local Ollama instance (http://localhost:11434).
 * 2. Ensure support for streaming responses if the UI requires it.
 * 3. Ensure this handles multi-turn conversations if needed.
 */

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_completion(model_name: str, prompt: str) -> str:
    """
    Calls the local Ollama API to generate a response.
    """
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.exceptions.RequestException as e:
        print(f"Error calling local model {model_name}: {e}")
        return "Error: Local AI is offline or unreachable."
