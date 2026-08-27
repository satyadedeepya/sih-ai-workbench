# backend/llm/run_all_checks.py
"""
Master verification script for Person 3's module (Tasks 1-5).
Run this any time before a demo to confirm everything still works.
"""

import sys
import httpx

try:
    from .ollama_client import OllamaClient
    from .router import route_and_generate, get_router_status
    from .classifier import classify_task
except ImportError:
    from ollama_client import OllamaClient
    from router import route_and_generate, get_router_status
    from classifier import classify_task

API_BASE_URL = "http://127.0.0.1:8001"  # dev_server must be running for Task 5 checks

results = []

def check(name, condition, detail=""):
    status = "✅" if condition else "❌"
    results.append((status, name, detail))
    print(f"{status} {name}" + (f" — {detail}" if detail and not condition else ""))


# ============================================================
# TASK 1 — Local model serving
# ============================================================
print("\n--- TASK 1: Local Model Serving ---")
client = OllamaClient()

available = client.is_available()
check("Ollama server reachable", available)

if available:
    models = client.list_local_models()
    check("llama3.2:3b pulled", any("llama3.2:3b" in m for m in models), str(models))
    check("qwen2.5-coder:1.5b pulled", any("qwen2.5-coder:1.5b" in m for m in models), str(models))
    check("moondream pulled", any("moondream" in m for m in models), str(models))


# ============================================================
# TASK 2 — Classifier + Router
# ============================================================
print("\n--- TASK 2: Classifier + Router ---")

status = get_router_status()
check("Router status returns models", len(status["models"]) >= 2, str(status))

coding_result = route_and_generate(prompt="Write a Python function to reverse a string.")
check(
    "Coding prompt routes to coding model",
    coding_result["task_type"] == "coding" and coding_result["error"] is None,
    str(coding_result.get("error"))
)

doc_result = route_and_generate(
    prompt="Summarize the major findings in this report.",
    file_info={"filename": "report.pdf", "extension": ".pdf", "is_scanned": False},
)
check(
    "Document prompt routes to general model",
    doc_result["task_type"] == "document" and doc_result["error"] is None,
    str(doc_result.get("error"))
)


# ============================================================
# TASK 3 — Classifier accuracy (quick subset, not full 17)
# ============================================================
print("\n--- TASK 3: Classifier Accuracy (spot check) ---")

spot_checks = [
    ("Fix the bug in this function, it's throwing an index error.", None, "coding"),
    ("Prepare an approval note based on the SOP.", None, "document"),
    ("Hello, what can you help me with?", None, "general"),
]
for prompt, file_info, expected in spot_checks:
    actual = classify_task(prompt, file_info)
    check(f"Classify: '{prompt[:40]}...'", actual == expected, f"expected={expected}, got={actual}")


# ============================================================
# TASK 4 — Vision + error handling
# ============================================================
print("\n--- TASK 4: Vision + Error Handling ---")

# Error handling: request a model that doesn't exist
bad_result = route_and_generate(
    prompt="test",
    task_type_override="nonexistent_task_type"  # will fall back to 'general' per get_model_for_task
)
check("Router doesn't crash on bad task_type_override", bad_result is not None)

# Vision routing (text-only check — doesn't require an actual image for a quick check)
vision_task = classify_task(
    "Analyze this",
    {"filename": "scan.png", "extension": ".png", "is_scanned": False}
)
check("Image file routes to vision task_type", vision_task == "vision")


# ============================================================
# TASK 5 — API layer over HTTP
# ============================================================
print("\n--- TASK 5: API Layer (HTTP) ---")
print("(requires dev_server.py running on port 8001)")

try:
    resp = httpx.get(f"{API_BASE_URL}/models", timeout=5.0)
    check("GET /models returns 200", resp.status_code == 200)
except httpx.RequestError:
    check("GET /models returns 200", False, "dev_server.py not running — start it first")

try:
    resp = httpx.post(
        f"{API_BASE_URL}/models/route",
        json={"prompt": "Write a Python function to add two numbers."},
        timeout=60.0,
    )
    check("POST /models/route returns 200", resp.status_code == 200)
except httpx.RequestError:
    check("POST /models/route returns 200", False, "dev_server.py not running")


# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 50)
passed = sum(1 for s, _, _ in results if s == "✅")
total = len(results)
print(f"RESULT: {passed}/{total} checks passed")

if passed < total:
    print("\nFailed checks:")
    for status, name, detail in results:
        if status == "❌":
            print(f"  ❌ {name}: {detail}")
    sys.exit(1)
else:
    print("🎉 All systems working — ready for demo.")