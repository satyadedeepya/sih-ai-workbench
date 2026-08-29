"""
PERSON 6: Code Execution Engine

Executes validated Python code in an isolated subprocess with:
- Timeout enforcement
- Output size limits
- Error handling
- Temporary working directory

SECURITY NOTE:
This module runs code in a subprocess under the same sandboxuser.
Additional isolation is provided by container-level controls (non-root user,
resource limits, network isolation, filesystem restrictions).
"""

import subprocess
import tempfile
import time
import os
import sys
from pathlib import Path
from typing import Dict


# Configuration
DEFAULT_TIMEOUT_SECONDS = 10
MAX_OUTPUT_BYTES = 50 * 1024  # 50 KB


def execute_code(code: str, timeout: int = DEFAULT_TIMEOUT_SECONDS) -> Dict:
    """
    Execute Python code in an isolated subprocess.

    Args:
        code: Python code string to execute
        timeout: Maximum execution time in seconds

    Returns:
        Dictionary with execution results:
        {
            "success": bool,
            "stdout": str,
            "stderr": str,
            "exit_code": int,
            "duration_ms": float,
            "error": str (if failed),
        }
    """
    start_time = time.perf_counter()

    # Create a temporary directory for execution
    with tempfile.TemporaryDirectory(prefix="sandbox_exec_") as tmpdir:
        script_path = Path(tmpdir) / "user_code.py"

        try:
            # Write code to temporary file
            script_path.write_text(code, encoding="utf-8")
        except Exception as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": "",
                "exit_code": -1,
                "duration_ms": 0,
                "error": f"Failed to write code to temp file: {str(e)}",
            }

        try:
            # Execute the code in a subprocess
            # Use sys.executable for cross-platform compatibility (important for both Linux containers and Windows dev)
            result = subprocess.run(
                [sys.executable, str(script_path)],
                cwd=tmpdir,
                capture_output=True,
                timeout=timeout,
                text=True,
                env={
                    # Minimal environment - only what's needed for Python
                    "PATH": os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin"),
                    "HOME": os.environ.get("HOME", "/home/sandboxuser"),
                    "USER": "sandboxuser",
                    "PYTHONUNBUFFERED": "1",
                },
            )

            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

            # Truncate output if too large
            stdout = result.stdout
            stderr = result.stderr

            if len(stdout) > MAX_OUTPUT_BYTES:
                stdout = stdout[:MAX_OUTPUT_BYTES] + f"\n... (truncated, exceeded {MAX_OUTPUT_BYTES} bytes)"

            if len(stderr) > MAX_OUTPUT_BYTES:
                stderr = stderr[:MAX_OUTPUT_BYTES] + f"\n... (truncated, exceeded {MAX_OUTPUT_BYTES} bytes)"

            return {
                "success": result.returncode == 0,
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": result.returncode,
                "duration_ms": duration_ms,
                "error": None if result.returncode == 0 else "Non-zero exit code",
            }

        except subprocess.TimeoutExpired:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "stdout": "",
                "stderr": "",
                "exit_code": -1,
                "duration_ms": duration_ms,
                "error": f"Execution timeout after {timeout} seconds",
            }

        except FileNotFoundError:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "stdout": "",
                "stderr": "",
                "exit_code": -1,
                "duration_ms": duration_ms,
                "error": "Python interpreter not found",
            }

        except Exception as e:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": False,
                "stdout": "",
                "stderr": "",
                "exit_code": -1,
                "duration_ms": duration_ms,
                "error": f"Execution failed: {str(e)}",
            }


def get_execution_config() -> dict:
    """Return execution configuration for debugging."""
    return {
        "timeout_seconds": DEFAULT_TIMEOUT_SECONDS,
        "max_output_bytes": MAX_OUTPUT_BYTES,
    }
