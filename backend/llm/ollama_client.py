# import requests

# /**
#  * PERSON 3: AI MODELS & MODEL ROUTER ENGINEER
#  * 
#  * TODOs for ollama_client.py:
#  * 1. Write helper functions to call the local Ollama instance (http://localhost:11434).
#  * 2. Ensure support for streaming responses if the UI requires it.
#  * 3. Ensure this handles multi-turn conversations if needed.
#  */

# OLLAMA_URL = "http://localhost:11434/api/generate"

# def generate_completion(model_name: str, prompt: str) -> str:
#     """
#     Calls the local Ollama API to generate a response.
#     """
#     payload = {
#         "model": model_name,
#         "prompt": prompt,
#         "stream": False
#     }
    
#     try:
#         response = requests.post(OLLAMA_URL, json=payload)
#         response.raise_for_status()
#         return response.json().get("response", "")
#     except requests.exceptions.RequestException as e:
#         print(f"Error calling local model {model_name}: {e}")
#         return "Error: Local AI is offline or unreachable."
# backend/llm/ollama_client.py

import httpx
import time
import logging

logger = logging.getLogger("ollama_client")

OLLAMA_BASE_URL = "http://ollama:11434"
DEFAULT_TIMEOUT = 120.0  # seconds; local inference can be slow on first load


class OllamaClient:
    def __init__(self, base_url: str = OLLAMA_BASE_URL):
        self.base_url = base_url

    def is_available(self) -> bool:
        """Health check — confirms Ollama server is up locally."""
        try:
            resp = httpx.get(f"{self.base_url}/api/tags", timeout=5.0)
            return resp.status_code == 200
        except httpx.RequestError:
            return False

    def list_local_models(self) -> list[str]:
        resp = httpx.get(f"{self.base_url}/api/tags", timeout=5.0)
        resp.raise_for_status()
        data = resp.json()
        return [m["name"] for m in data.get("models", [])]

    def generate(
        self,
        model_name: str,
        prompt: str,
        system: str | None = None,
        images: list[str] | None = None,
        stream: bool = False,
        options: dict | None = None,
    ) -> dict:
        """
        Calls Ollama's /api/generate endpoint.
        Returns dict with response text, model used, and latency.
        """
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": stream,
        }
        if system:
            payload["system"] = system
        if options:
            payload["options"] = options  # e.g. {"temperature": 0.2}
        if options:
            payload["options"] = options

        start = time.perf_counter()
        try:
            resp = httpx.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=DEFAULT_TIMEOUT,
            )
            resp.raise_for_status()
        except httpx.RequestError as e:
            logger.error(f"Ollama request failed: {e}")
            raise RuntimeError(f"Local model call failed: {e}")

        except httpx.HTTPStatusError as e:
            logger.error(f"Ollama returned error status: {e}")
            if e.response.status_code == 404:
                raise RuntimeError(
                   f"Model '{model_name}' not found locally. Run: ollama pull {model_name}"
                )
            raise RuntimeError(f"Local model call failed (status {e.response.status_code}): {e}")

        latency_ms = round((time.perf_counter() - start) * 1000, 1)
        data = resp.json()

        return {
            "model_used": model_name,
            "response": data.get("response", ""),
            "latency_ms": latency_ms,
            "done": data.get("done", True),
        }

    def chat(
        self,
        model_name: str,
        messages: list[dict],  # [{"role": "user", "content": "..."}]
        options: dict | None = None,
    ) -> dict:
        """Calls /api/chat — better for multi-turn agent context."""
        payload = {
            "model": model_name,
            "messages": messages,
            "stream": False,
        }
        if options:
            payload["options"] = options

        start = time.perf_counter()
        resp = httpx.post(f"{self.base_url}/api/chat", json=payload, timeout=DEFAULT_TIMEOUT)
        resp.raise_for_status()
        latency_ms = round((time.perf_counter() - start) * 1000, 1)
        data = resp.json()

        return {
            "model_used": model_name,
            "response": data.get("message", {}).get("content", ""),
            "latency_ms": latency_ms,
        }
