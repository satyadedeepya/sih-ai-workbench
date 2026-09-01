"""
PERSON 6: Sandbox HTTP Server Integration Tests

Tests the HTTP endpoints of the sandbox runner:
- GET /health
- GET /info
- POST /execute (with various payloads)

Run with: python3 test_runner_http.py
"""

import json
import threading
import time
import urllib.request
import urllib.error
from http.server import HTTPServer
import sys

from runner import SandboxRequestHandler, HOST, PORT


def run_http_tests():
    """Run HTTP server tests."""
    print("=" * 60)
    print("SANDBOX HTTP INTEGRATION TESTS")
    print("=" * 60)
    print()

    # Start server in background thread
    server_address = ("127.0.0.1", 5001)  # Use different port for tests
    httpd = HTTPServer(server_address, SandboxRequestHandler)
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()

    time.sleep(0.5)  # Wait for server to start

    base_url = "http://127.0.0.1:5001"
    passed = 0
    failed = 0

    def make_request(method: str, path: str, data: dict = None) -> tuple:
        url = f"{base_url}{path}"
        req = urllib.request.Request(url, method=method)
        if data is not None:
            req.add_header("Content-Type", "application/json")
            json_data = json.dumps(data).encode("utf-8")
            req.data = json_data

        try:
            with urllib.request.urlopen(req) as response:
                status = response.status
                body = json.loads(response.read().decode("utf-8"))
                return status, body
        except urllib.error.HTTPError as e:
            status = e.code
            body = json.loads(e.read().decode("utf-8"))
            return status, body

    # Test 1: Health check
    try:
        status, body = make_request("GET", "/health")
        assert status == 200, f"Expected 200, got {status}"
        assert body["status"] == "healthy"
        print("[PASS] GET /health endpoint")
        passed += 1
    except Exception as e:
        print(f"[FAIL] GET /health: {e}")
        failed += 1

    # Test 2: Info endpoint
    try:
        status, body = make_request("GET", "/info")
        assert status == 200, f"Expected 200, got {status}"
        assert "security_policies" in body
        print("[PASS] GET /info endpoint")
        passed += 1
    except Exception as e:
        print(f"[FAIL] GET /info: {e}")
        failed += 1

    # Test 3: Valid code execution
    try:
        status, body = make_request("POST", "/execute", {"code": "print('HTTP Test')" })
        assert status == 200, f"Expected 200, got {status}: {body}"
        assert body["success"] is True
        assert "HTTP Test" in body["stdout"]
        print("[PASS] POST /execute with valid code")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (valid): {e}")
        failed += 1

    # Test 4: Blocked code
    try:
        status, body = make_request("POST", "/execute", {"code": "import os\nos.system('ls')"})
        assert status == 403, f"Expected 403 Forbidden, got {status}: {body}"
        assert "validation_errors" in body
        print("[PASS] POST /execute with blocked code (os import)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (blocked): {e}")
        failed += 1

    # Test 5: Malformed JSON
    try:
        url = f"{base_url}/execute"
        req = urllib.request.Request(url, method="POST", data=b"{malformed json")
        req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req) as response:
                status = response.status
        except urllib.error.HTTPError as e:
            status = e.code
            body = json.loads(e.read().decode("utf-8"))
            assert status == 400
            assert "Invalid JSON" in body["error"]
        print("[PASS] POST /execute with malformed JSON")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (malformed): {e}")
        failed += 1

    # Test 6: Missing code field
    try:
        status, body = make_request("POST", "/execute", {"not_code": "print(1)"})
        assert status == 400
        assert "Missing 'code' field" in body["error"]
        print("[PASS] POST /execute with missing 'code' field")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (missing field): {e}")
        failed += 1

    # Test 7: Runtime error
    try:
        status, body = make_request("POST", "/execute", {"code": "1 / 0"})
        assert status == 400
        assert body["success"] is False
        assert "ZeroDivisionError" in body["stderr"]
        print("[PASS] POST /execute with runtime error")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (runtime error): {e}")
        failed += 1

    # Test 8: Custom timeout
    try:
        status, body = make_request("POST", "/execute", {
            "code": "import time\ntime.sleep(5)",
            "timeout": 2
        })
        assert status == 400
        assert body["success"] is False
        assert "timeout" in body.get("error", "").lower()
        print("[PASS] POST /execute with custom timeout")
        passed += 1
    except Exception as e:
        print(f"[FAIL] POST /execute (timeout): {e}")
        failed += 1

    # Stop server
    httpd.shutdown()

    # Summary
    print()
    print("=" * 60)
    print(f"HTTP Test Results: {passed}/{passed + failed} passed")
    print("=" * 60)
    return failed == 0


if __name__ == "__main__":
    success = run_http_tests()
    sys.exit(0 if success else 1)
