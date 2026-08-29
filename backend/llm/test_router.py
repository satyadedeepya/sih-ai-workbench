# backend/llm/test_router.py
from router import route_and_generate, get_router_status

print("=== Router status ===")
print(get_router_status())

print("\n=== Test 1: Coding prompt (should route to qwen2.5-coder) ===")
result = route_and_generate(
    prompt="Write a Python function to implement SJF scheduling."
)
print(f"Task type: {result['task_type']}")
print(f"Model used: {result['model_used']}")
print(f"Latency: {result['latency_ms']}ms")
print(f"Response:\n{result['response'][:300]}...")

print("\n=== Test 2: Document prompt (should route to llama3.1) ===")
result = route_and_generate(
    prompt="Summarize the major findings in this inspection report and prepare an approval note.",
    file_info={"filename": "inspection_report.pdf", "extension": ".pdf", "is_scanned": False}
)
print(f"Task type: {result['task_type']}")
print(f"Model used: {result['model_used']}")
print(f"Latency: {result['latency_ms']}ms")
print(f"Response:\n{result['response'][:300]}...")