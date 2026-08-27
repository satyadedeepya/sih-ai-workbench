# backend/llm/classifier.py

import re

CODING_KEYWORDS = [
    "write code", "write a program", "write a function", "implement",
    "python script", "java program", "c++ code", "debug", "fix this code",
    "refactor", "algorithm", "function that", "class that", "sql query",
    "regex", "compile", "syntax error", "write a script",
    # --- added: bug/error language ---
    "fix the bug", "fix this bug", "throwing an error", "throwing an exception",
    "index error", "null pointer", "stack trace", "traceback",
    "this error", "this bug", "not working code", "code is failing",
]

CODING_LANGUAGE_HINTS = [
    "python", "java", "javascript", "c++", "c#", "sql", "html", "css",
    "typescript", "bash", "powershell", "go ", "rust"
]

CODE_FILE_EXTENSIONS = {
    ".py", ".java", ".js", ".ts", ".cpp", ".c", ".cs", ".go", ".rs",
    ".sql", ".sh", ".ps1", ".html", ".css", ".json", ".ipynb"
}

DOCUMENT_KEYWORDS = [
    "summarize", "summarise", "analyze this report", "analyse this report",
    "findings", "approval note", "inspection", "sop", "manual",
    "extract", "compare with", "prepare a report", "review this document"
]

VISION_FILE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff"}
SCANNED_PDF_HINT = "scanned"


def classify_task(prompt: str, file_info: dict | None = None) -> str:
    prompt_lower = prompt.lower()

    # 1. File-based signals take priority
    if file_info:
        ext = file_info.get("extension", "").lower()

        if ext in VISION_FILE_EXTENSIONS:
            return "vision"
        if file_info.get("is_scanned"):
            return "vision"
        if ext in CODE_FILE_EXTENSIONS:
            return "coding"
        if ext in [".pdf", ".docx", ".doc", ".txt"]:
            return "document"

    # 2. Coding signals
    if any(kw in prompt_lower for kw in CODING_KEYWORDS):
        return "coding"
    if any(lang in prompt_lower for lang in CODING_LANGUAGE_HINTS):
        return "coding"
    if re.search(r"```", prompt):
        return "coding"

    # 3. Document signals
    if any(kw in prompt_lower for kw in DOCUMENT_KEYWORDS):
        return "document"

    # 4. Fallback
    return "general"