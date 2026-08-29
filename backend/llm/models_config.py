# backend/llm/models_config.py

MODEL_REGISTRY = {
    "general": {
        "model_name": "llama3.2:3b",
        "capabilities": ["document", "reasoning", "summarization", "general"],
        "context_window": 8192,
    },
    "coding": {
        "model_name": "qwen2.5-coder:1.5b",
        "capabilities": ["coding", "debugging", "code_review"],
        "context_window": 8192,
    },
    "vision": {
        "model_name": "moondream",  # or llava:7b-v1.6-mistral-q4_0 if it fits
        "capabilities": ["vision", "ocr_assist", "image_understanding"],
        "context_window": 4096,
    },
}

def get_model_for_task(task_type: str) -> dict:
    """Map a task_type string to its model config. Falls back to 'general'."""
    return MODEL_REGISTRY.get(task_type, MODEL_REGISTRY["general"])

def list_available_models() -> list[dict]:
    return [
        {"key": k, "model_name": v["model_name"], "capabilities": v["capabilities"]}
        for k, v in MODEL_REGISTRY.items()
    ]