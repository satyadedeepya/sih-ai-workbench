# backend/llm/test_ollama_setup.py
from ollama_client import OllamaClient
from models_config import list_available_models

client = OllamaClient()

print("Ollama running:", client.is_available())
print("Locally pulled models:", client.list_local_models())
print("Registered task→model mapping:", list_available_models())

result = client.generate(
    model_name="llama3.1:8b",
    prompt="Say hello in one sentence.",
)
print(result)