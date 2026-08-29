"""
PERSON 6: Sandbox Test Suite

Comprehensive tests for the secure code execution sandbox.
Tests security validation, code execution, error handling, and edge cases.

Run with: python3 test_sandbox.py
"""

import json
import sys
from typing import Dict, List

from security_policies import validate_code, get_policy_info
from execute_code import execute_code


class TestRunner:
    """Simple test runner for sandbox validation."""

    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests: List[Dict] = []

    def test(self, name: str, func):
        """Run a single test."""
        try:
            func()
            self.passed += 1
            self.tests.append({"name": name, "status": "PASS"})
            print(f"[PASS] {name}")
        except AssertionError as e:
            self.failed += 1
            self.tests.append({"name": name, "status": "FAIL", "error": str(e)})
            print(f"[FAIL] {name}: {e}")
        except Exception as e:
            self.failed += 1
            self.tests.append({"name": name, "status": "ERROR", "error": str(e)})
            print(f"[ERROR] {name}: Unexpected error: {e}")

    def summary(self):
        """Print test summary."""
        total = self.passed + self.failed
        print("\n" + "=" * 60)
        print(f"Test Results: {self.passed}/{total} passed")
        print("=" * 60)
        if self.failed > 0:
            print("\nFailed tests:")
            for test in self.tests:
                if test["status"] != "PASS":
                    print(f"  - {test['name']}: {test.get('error', 'Unknown error')}")
        return self.failed == 0


def run_tests():
    """Run all sandbox tests."""
    runner = TestRunner()

    print("=" * 60)
    print("SANDBOX SECURITY TEST SUITE")
    print("=" * 60)
    print()

    # ===== SECURITY VALIDATION TESTS =====
    print("Security Validation Tests:")
    print("-" * 60)

    runner.test("Allow simple print statement", lambda: test_allow_print())
    runner.test("Allow basic arithmetic", lambda: test_allow_arithmetic())
    runner.test("Allow pandas import", lambda: test_allow_pandas())
    runner.test("Allow numpy import", lambda: test_allow_numpy())
    runner.test("Allow matplotlib import", lambda: test_allow_matplotlib())
    runner.test("Allow json import", lambda: test_allow_json())
    runner.test("Allow math import", lambda: test_allow_math())

    runner.test("Block os import", lambda: test_block_os())
    runner.test("Block subprocess import", lambda: test_block_subprocess())
    runner.test("Block socket import", lambda: test_block_socket())
    runner.test("Block sys import", lambda: test_block_sys())
    runner.test("Block ctypes import", lambda: test_block_ctypes())
    runner.test("Block shutil import", lambda: test_block_shutil())
    runner.test("Block eval builtin", lambda: test_block_eval())
    runner.test("Block exec builtin", lambda: test_block_exec())
    runner.test("Block __import__ builtin", lambda: test_block_import_builtin())
    runner.test("Block open builtin", lambda: test_block_open())

    runner.test("Reject empty code", lambda: test_reject_empty())
    runner.test("Reject syntax error", lambda: test_reject_syntax_error())

    print()

    # ===== CODE EXECUTION TESTS =====
    print("Code Execution Tests:")
    print("-" * 60)

    runner.test("Execute simple print", lambda: test_execute_print())
    runner.test("Execute arithmetic", lambda: test_execute_arithmetic())
    runner.test("Execute with allowed import", lambda: test_execute_with_import())
    runner.test("Handle runtime error", lambda: test_handle_runtime_error())
    runner.test("Handle timeout", lambda: test_handle_timeout())
    runner.test("Capture stdout", lambda: test_capture_stdout())
    runner.test("Capture stderr", lambda: test_capture_stderr())

    print()

    # Print summary
    success = runner.summary()
    return 0 if success else 1


# ===== VALIDATION TESTS =====

def test_allow_print():
    code = "print('Hello, world!')"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow print: {errors}"

def test_allow_arithmetic():
    code = "result = 2 + 2\nprint(result)"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow arithmetic: {errors}"

def test_allow_pandas():
    code = "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2, 3]})\nprint(df)"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow pandas: {errors}"

def test_allow_numpy():
    code = "import numpy as np\narr = np.array([1, 2, 3])\nprint(arr)"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow numpy: {errors}"

def test_allow_matplotlib():
    code = "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nprint('plot created')"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow matplotlib: {errors}"

def test_allow_json():
    code = "import json\ndata = json.dumps({'a': 1})\nprint(data)"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow json: {errors}"

def test_allow_math():
    code = "import math\nresult = math.sqrt(16)\nprint(result)"
    is_valid, errors = validate_code(code)
    assert is_valid, f"Should allow math: {errors}"

def test_block_os():
    code = "import os\nos.system('ls')"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block os import"
    assert any("os" in err.lower() for err in errors), f"Error should mention 'os': {errors}"

def test_block_subprocess():
    code = "import subprocess\nsubprocess.run(['ls'])"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block subprocess import"
    assert any("subprocess" in err.lower() for err in errors), f"Error should mention 'subprocess': {errors}"

def test_block_socket():
    code = "import socket\ns = socket.socket()"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block socket import"
    assert any("socket" in err.lower() for err in errors), f"Error should mention 'socket': {errors}"

def test_block_sys():
    code = "import sys\nsys.exit(0)"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block sys import"
    assert any("sys" in err.lower() for err in errors), f"Error should mention 'sys': {errors}"

def test_block_ctypes():
    code = "import ctypes"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block ctypes import"
    assert any("ctypes" in err.lower() for err in errors), f"Error should mention 'ctypes': {errors}"

def test_block_shutil():
    code = "import shutil\nshutil.rmtree('/tmp')"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block shutil import"
    assert any("shutil" in err.lower() for err in errors), f"Error should mention 'shutil': {errors}"

def test_block_eval():
    code = "result = eval('2 + 2')\nprint(result)"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block eval"
    assert any("eval" in err.lower() for err in errors), f"Error should mention 'eval': {errors}"

def test_block_exec():
    code = "exec('print(\"hello\")')"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block exec"
    assert any("exec" in err.lower() for err in errors), f"Error should mention 'exec': {errors}"

def test_block_import_builtin():
    code = "mod = __import__('os')\nmod.system('ls')"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block __import__"
    assert any("__import__" in err.lower() for err in errors), f"Error should mention '__import__': {errors}"

def test_block_open():
    code = "with open('/etc/passwd', 'r') as f:\n    data = f.read()"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should block open"
    assert any("open" in err.lower() for err in errors), f"Error should mention 'open': {errors}"

def test_reject_empty():
    code = ""
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should reject empty code"

def test_reject_syntax_error():
    code = "print('unclosed string"
    is_valid, errors = validate_code(code)
    assert not is_valid, "Should reject syntax errors"
    assert any("syntax" in err.lower() for err in errors), f"Error should mention 'syntax': {errors}"


# ===== EXECUTION TESTS =====

def test_execute_print():
    code = "print('Hello from sandbox')"
    result = execute_code(code, timeout=5)
    assert result["success"], f"Execution failed: {result}"
    assert "Hello from sandbox" in result["stdout"], f"Output missing: {result['stdout']}"
    assert result["exit_code"] == 0

def test_execute_arithmetic():
    code = "result = 10 + 20\nprint(result)"
    result = execute_code(code, timeout=5)
    assert result["success"], f"Execution failed: {result}"
    assert "30" in result["stdout"], f"Output incorrect: {result['stdout']}"

def test_execute_with_import():
    code = "import json\ndata = json.dumps({'test': 123})\nprint(data)"
    result = execute_code(code, timeout=5)
    assert result["success"], f"Execution failed: {result}"
    assert '"test"' in result["stdout"] or "'test'" in result["stdout"], f"Output incorrect: {result['stdout']}"

def test_handle_runtime_error():
    code = "x = 1 / 0"
    result = execute_code(code, timeout=5)
    assert not result["success"], "Should fail on runtime error"
    assert "ZeroDivisionError" in result["stderr"], f"stderr should contain error: {result['stderr']}"

def test_handle_timeout():
    code = "import time\nwhile True:\n    time.sleep(1)"
    result = execute_code(code, timeout=2)
    assert not result["success"], "Should fail on timeout"
    assert "timeout" in result.get("error", "").lower(), f"Error should mention timeout: {result}"

def test_capture_stdout():
    code = "print('line 1')\nprint('line 2')\nprint('line 3')"
    result = execute_code(code, timeout=5)
    assert result["success"], f"Execution failed: {result}"
    assert "line 1" in result["stdout"]
    assert "line 2" in result["stdout"]
    assert "line 3" in result["stdout"]

def test_capture_stderr():
    code = "import sys\nprint('error message', file=sys.stderr)"
    result = execute_code(code, timeout=5)
    # Note: sys is blocked by validation, so this test would fail validation
    # Instead, test with a natural stderr output
    code = "x = 1 / 0"
    result = execute_code(code, timeout=5)
    assert not result["success"]
    assert len(result["stderr"]) > 0, "stderr should contain error message"


if __name__ == "__main__":
    sys.exit(run_tests())
