# backend/llm/test_api_endpoints.py
# Tests the actual HTTP API, not the Python functions directly.
# Run dev_server.py first in a separate terminal.

import httpx

BASE_URL = "http://127.0.0.1:8001"

def test_status():
    resp = httpx.get(f"{BASE_URL}/models")
    print("=== GET /models ===")
    print(f"Status: {resp.status_code}")
    print(resp.json())
    assert resp.status_code == 200
    assert resp.json()["ollama_available"] is True

def test_coding_route():
    resp = httpx.post(
        f"{BASE_URL}/models/route",
        json={"prompt": "Write a Python function to reverse a string."},
        timeout=60.0,
    )
    print("\n=== POST /models/route (coding) ===")
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"task_type: {data['task_type']}, model_used: {data['model_used']}")
    assert data["task_type"] == "coding"

def test_document_route():
    resp = httpx.post(
        f"{BASE_URL}/models/route",
        json={
            "prompt": "Summarize the major findings in this report.",
            "file_info": {"filename": "report.pdf", "extension": ".pdf", "is_scanned": False},
        },
        timeout=60.0,
    )
    print("\n=== POST /models/route (document) ===")
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"task_type: {data['task_type']}, model_used: {data['model_used']}")
    assert data["task_type"] == "document"

def test_invalid_request():
    """Confirm bad input doesn't crash the server."""
    resp = httpx.post(f"{BASE_URL}/models/route", json={})  # missing required 'prompt'
    print("\n=== POST /models/route (invalid — missing prompt) ===")
    print(f"Status: {resp.status_code}")
    print(resp.json())
    assert resp.status_code == 422  # FastAPI validation error, not a 500 crash

if __name__ == "__main__":
    test_status()
    test_coding_route()
    test_document_route()
    test_invalid_request()
    print("\n✅ All API endpoint tests passed")