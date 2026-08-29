# /**
#  * PERSON 3: AI MODELS & MODEL ROUTER ENGINEER
#  * 
#  * TODOs for router.py:
#  * 1. Implement task classification: Given a prompt, decide if it's a "Coding" task or a "Document/Vision" task.
#  * 2. This could be a lightweight heuristic (regex/keywords) or a fast LLM call (e.g. Llama-3 8B).
#  * 3. Return the ID/Name of the appropriate local model to use.
#  */

# def classify_and_route(prompt: str) -> str:
#     """
#     Analyzes the user's prompt and selects the best local model.
#     """
#     prompt_lower = prompt.lower()
    
#     # Simple heuristic routing for prototype (can be replaced with LLM classification)
#     if "code" in prompt_lower or "python" in prompt_lower or "script" in prompt_lower:
#         print("[Router] Detected CODING task. Routing to qwen2.5-coder:7b...")
#         return "qwen2.5-coder:7b"
#     elif "analyze" in prompt_lower or "report" in prompt_lower or "document" in prompt_lower:
#         print("[Router] Detected DOCUMENT task. Routing to llama-3.1:8b...")
#         return "llama-3.1:8b"
#     else:
#         print("[Router] Defaulting to general reasoning model...")
#         return "llama-3.1:8b"
# backend/llm/router.py

# import logging
# from .ollama_client import OllamaClient
# from .models_config import get_model_for_task, list_available_models
# from .classifier import classify_task
import logging

try:
    from .ollama_client import OllamaClient
    from .models_config import get_model_for_task, list_available_models
    from .classifier import classify_task
except ImportError:
    from ollama_client import OllamaClient
    from models_config import get_model_for_task, list_available_models
    from classifier import classify_task

logger = logging.getLogger("router")

client = OllamaClient()


def route_and_generate(
    prompt: str,
    file_info: dict | None = None,
    task_type_override: str | None = None,
    system: str | None = None,
    images: list[str] | None = None,
) -> dict:
    task_type = task_type_override or classify_task(prompt, file_info)
    model_config = get_model_for_task(task_type)
    model_name = model_config["model_name"]

    logger.info(f"Routing task_type='{task_type}' -> model='{model_name}'")

    try:
        result = client.generate(
            model_name=model_name,
            prompt=prompt,
            system=system,
            images=images,
        )
    except RuntimeError as e:
        logger.error(f"Generation failed for model={model_name}: {e}")
        return {
            "task_type": task_type,
            "model_used": model_name,
            "response": None,
            "error": str(e),
            "latency_ms": None,
        }

    return {
        "task_type": task_type,
        "model_used": model_name,
        "response": result["response"],
        "latency_ms": result["latency_ms"],
        "error": None,
    }


def get_router_status() -> dict:
    """For the /models endpoint — lets the frontend show available models."""
    return {
        "ollama_available": client.is_available(),
        "models": list_available_models(),
    }