"""
PERSON 6: Sandbox HTTP API Server

Exposes a minimal HTTP API for secure code execution.
Endpoint: POST /execute

This server is intended to run ONLY inside the secure-internal Docker network.
It should never be exposed to the public internet or host network.
"""

import json
import logging
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Dict

from security_policies import validate_code, get_policy_info
from execute_code import execute_code, get_execution_config


# Configuration
HOST = "0.0.0.0"  # Listen on all interfaces (within container)
PORT = 5000
MAX_REQUEST_SIZE = 200 * 1024  # 200 KB

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("sandbox.runner")


class SandboxRequestHandler(BaseHTTPRequestHandler):
    """HTTP request handler for sandbox code execution."""

    def log_message(self, format, *args):
        """Override to use our logger."""
        logger.info(f"{self.address_string()} - {format % args}")

    def send_json_response(self, status_code: int, data: Dict):
        """Send JSON response."""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_GET(self):
        """Handle GET requests - health check and info endpoints."""
        if self.path == "/health":
            self.send_json_response(200, {
                "status": "healthy",
                "service": "sandbox-runner",
            })
        elif self.path == "/info":
            self.send_json_response(200, {
                "service": "sandbox-runner",
                "endpoints": ["/health", "/info", "/execute (POST)"],
                "security_policies": get_policy_info(),
                "execution_config": get_execution_config(),
            })
        else:
            self.send_json_response(404, {
                "error": "Not found",
                "available_endpoints": ["/health", "/info", "/execute (POST)"],
            })

    def do_POST(self):
        """Handle POST requests - code execution."""
        if self.path != "/execute":
            self.send_json_response(404, {
                "error": f"Unknown endpoint: {self.path}",
                "expected": "/execute",
            })
            return

        # Check content length
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            self.send_json_response(400, {
                "error": "Empty request body",
            })
            return

        if content_length > MAX_REQUEST_SIZE:
            self.send_json_response(413, {
                "error": f"Request too large: {content_length} bytes (max {MAX_REQUEST_SIZE})",
            })
            return

        # Read and parse request body
        try:
            body = self.rfile.read(content_length)
            request_data = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError as e:
            self.send_json_response(400, {
                "error": "Invalid JSON",
                "details": str(e),
            })
            return
        except Exception as e:
            self.send_json_response(400, {
                "error": "Failed to read request",
                "details": str(e),
            })
            return

        # Validate request structure
        if "code" not in request_data:
            self.send_json_response(400, {
                "error": "Missing 'code' field in request",
            })
            return

        code = request_data["code"]
        if not isinstance(code, str):
            self.send_json_response(400, {
                "error": "'code' field must be a string",
            })
            return

        # Optional: custom timeout
        timeout = request_data.get("timeout", 10)
        if not isinstance(timeout, (int, float)) or timeout <= 0 or timeout > 60:
            self.send_json_response(400, {
                "error": "Invalid timeout (must be 0 < timeout <= 60 seconds)",
            })
            return

        logger.info(f"Received code execution request ({len(code)} bytes, timeout={timeout}s)")

        # Step 1: Security validation
        is_valid, validation_errors = validate_code(code)
        if not is_valid:
            logger.warning(f"Code validation failed: {validation_errors}")
            self.send_json_response(403, {
                "error": "Code validation failed",
                "validation_errors": validation_errors,
                "success": False,
            })
            return

        logger.info("Code passed security validation")

        # Step 2: Execute code
        try:
            result = execute_code(code, timeout=int(timeout))

            # Log execution result
            if result["success"]:
                logger.info(f"Code executed successfully in {result['duration_ms']}ms")
            else:
                logger.warning(f"Code execution failed: {result.get('error', 'Unknown error')}")

            # Return result
            status_code = 200 if result["success"] else 400
            self.send_json_response(status_code, result)

        except Exception as e:
            logger.error(f"Unexpected error during execution: {str(e)}")
            self.send_json_response(500, {
                "error": "Internal server error",
                "details": str(e),
                "success": False,
            })


def run_server():
    """Start the HTTP server."""
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, SandboxRequestHandler)

    logger.info("=" * 60)
    logger.info("Sandbox Runner Starting")
    logger.info("=" * 60)
    logger.info(f"Listening on {HOST}:{PORT}")
    logger.info(f"Endpoints:")
    logger.info(f"  GET  /health  - Health check")
    logger.info(f"  GET  /info    - Service information")
    logger.info(f"  POST /execute - Code execution")
    logger.info("=" * 60)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        httpd.shutdown()


if __name__ == "__main__":
    run_server()
