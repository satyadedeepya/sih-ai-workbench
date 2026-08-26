/**
 * PERSON 3: AI MODELS & MODEL ROUTER ENGINEER
 * 
 * TODOs for router.py:
 * 1. Implement task classification: Given a prompt, decide if it's a "Coding" task or a "Document/Vision" task.
 * 2. This could be a lightweight heuristic (regex/keywords) or a fast LLM call (e.g. Llama-3 8B).
 * 3. Return the ID/Name of the appropriate local model to use.
 */

def classify_and_route(prompt: str) -> str:
    """
    Analyzes the user's prompt and selects the best local model.
    """
    prompt_lower = prompt.lower()
    
    # Simple heuristic routing for prototype (can be replaced with LLM classification)
    if "code" in prompt_lower or "python" in prompt_lower or "script" in prompt_lower:
        print("[Router] Detected CODING task. Routing to qwen2.5-coder:7b...")
        return "qwen2.5-coder:7b"
    elif "analyze" in prompt_lower or "report" in prompt_lower or "document" in prompt_lower:
        print("[Router] Detected DOCUMENT task. Routing to llama-3.1:8b...")
        return "llama-3.1:8b"
    else:
        print("[Router] Defaulting to general reasoning model...")
        return "llama-3.1:8b"
