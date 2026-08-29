"""
PERSON 6: Security Policies for Code Execution Sandbox

This module provides AST-based validation to reject dangerous Python code.

IMPORTANT SECURITY DISCLAIMER:
AST validation is ONE layer of defense in depth. It is NOT sufficient to make
arbitrary Python code safe. This sandbox relies on multiple layers:
- AST validation (this module)
- Non-root user execution
- Container resource limits
- Network isolation
- Filesystem restrictions

Do NOT rely solely on AST checks to secure arbitrary code execution.
"""

import ast
from typing import List, Tuple

# Allowlist: modules that are explicitly permitted
ALLOWED_MODULES = {
    "pandas",
    "numpy",
    "matplotlib",
    "matplotlib.pyplot",
    "openpyxl",
    "json",
    "math",
    "statistics",
    "datetime",
    "time",
    "re",
    "collections",
    "itertools",
    "functools",
}

# Blocklist: modules that are explicitly forbidden
BLOCKED_MODULES = {
    "os",
    "subprocess",
    "socket",
    "sys",
    "ctypes",
    "pty",
    "shutil",
    "multiprocessing",
    "threading",
    "urllib",
    "requests",
    "http",
    "ftplib",
    "telnetlib",
    "smtplib",
    "poplib",
    "imaplib",
    "__builtin__",
    "__builtins__",
    "importlib",
    "pickle",
    "shelve",
    "dbm",
    "sqlite3",
    "pathlib",
    "glob",
    "tempfile",
}

# Blocked builtin functions
BLOCKED_BUILTINS = {
    "eval",
    "exec",
    "__import__",
    "compile",
    "open",  # Block direct file operations
    "input",  # Block interactive input
    "breakpoint",
}


class SecurityValidator(ast.NodeVisitor):
    """AST visitor that detects dangerous code patterns."""

    def __init__(self):
        self.errors: List[str] = []
        self.imports: List[str] = []

    def visit_Import(self, node: ast.Import):
        """Check import statements."""
        for alias in node.names:
            module_name = alias.name.split(".")[0]
            self.imports.append(alias.name)

            if module_name in BLOCKED_MODULES or alias.name in BLOCKED_MODULES:
                self.errors.append(
                    f"Blocked import detected: '{alias.name}' (line {node.lineno})"
                )
            elif alias.name not in ALLOWED_MODULES and module_name not in ALLOWED_MODULES:
                # Check if it's a submodule of an allowed module
                is_submodule = any(
                    alias.name.startswith(allowed + ".")
                    for allowed in ALLOWED_MODULES
                )
                if not is_submodule:
                    self.errors.append(
                        f"Import '{alias.name}' is not in allowlist (line {node.lineno})"
                    )
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        """Check from X import Y statements."""
        if node.module:
            module_name = node.module.split(".")[0]
            self.imports.append(node.module)

            if module_name in BLOCKED_MODULES or node.module in BLOCKED_MODULES:
                self.errors.append(
                    f"Blocked import detected: 'from {node.module}' (line {node.lineno})"
                )
            elif node.module not in ALLOWED_MODULES and module_name not in ALLOWED_MODULES:
                # Check if it's a submodule of an allowed module
                is_submodule = any(
                    node.module.startswith(allowed + ".")
                    for allowed in ALLOWED_MODULES
                )
                if not is_submodule:
                    self.errors.append(
                        f"Import 'from {node.module}' is not in allowlist (line {node.lineno})"
                    )
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        """Check function calls for dangerous builtins."""
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            if func_name in BLOCKED_BUILTINS:
                self.errors.append(
                    f"Blocked builtin function: '{func_name}' (line {node.lineno})"
                )
        self.generic_visit(node)

    def visit_Attribute(self, node: ast.Attribute):
        """Check attribute access for dangerous patterns."""
        # Check for __import__ via getattr
        if node.attr == "__import__":
            self.errors.append(
                f"Blocked attribute access: '__import__' (line {node.lineno})"
            )
        self.generic_visit(node)


def validate_code(code: str) -> Tuple[bool, List[str]]:
    """
    Validate Python code using AST analysis.

    Returns:
        (is_valid, error_messages)
    """
    if not code or not code.strip():
        return False, ["Empty code submission"]

    # Check code size (max 100KB)
    if len(code) > 100 * 1024:
        return False, ["Code exceeds maximum size of 100KB"]

    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, [f"Syntax error: {e.msg} at line {e.lineno}"]
    except Exception as e:
        return False, [f"Failed to parse code: {str(e)}"]

    validator = SecurityValidator()
    validator.visit(tree)

    if validator.errors:
        return False, validator.errors

    return True, []


def get_policy_info() -> dict:
    """Return information about security policies for debugging."""
    return {
        "allowed_modules": sorted(list(ALLOWED_MODULES)),
        "blocked_modules": sorted(list(BLOCKED_MODULES)),
        "blocked_builtins": sorted(list(BLOCKED_BUILTINS)),
    }
