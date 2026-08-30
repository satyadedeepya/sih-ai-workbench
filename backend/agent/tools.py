# import os

# /**
#  * PERSON 4: AGENT & TOOLS ENGINEER
#  * 
#  * TODOs for tools.py:
#  * 1. Implement Python tools that the LLM can call.
#  * 2. read_file(filepath): Reads text/csv files.
#  * 3. generate_docx(content, filename): Creates real Word documents (use python-docx).
#  * 4. run_code_in_sandbox(code): Sends code to Person 6's Docker sandbox for execution.
#  */

# def read_file(filepath: str) -> str:
#     """Reads a local file."""
#     if os.path.exists(filepath):
#         with open(filepath, 'r') as f:
#             return f.read()
#     return "File not found."

# def search_kb(query: str) -> str:
#     """Calls Person 5's RAG system to search local knowledge base."""
#     # from rag.vector_store import search
#     # return search(query)
#     return "Local SOP retrieved: Follow safety protocol 42."

# def generate_docx(content: str, filename: str) -> str:
#     """Generates a Word Document."""
#     # TODO: Use python-docx
#     return f"Created {filename} successfully."

# def run_code_in_sandbox(code: str) -> str:
#     """Executes code securely in the Docker sandbox."""
#     # TODO: Connect to sandbox API/container
#     return "Code executed successfully. Output: ..."






import os
import subprocess
import sys
import tempfile

"""
PERSON 4: AGENT & TOOLS ENGINEER

TODOs for tools.py:
1. Implement Python tools that the LLM can call.
2. read_file(filepath): Reads text/csv files.
3. generate_docx(content, filename): Creates real Word documents (use python-docx).
4. run_code_in_sandbox(code): Sends code to Person 6's Docker sandbox for execution.
"""


def read_file(filepath: str) -> str:
    """Reads a local file."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {e}"
    return "File not found."


def search_kb(query: str) -> str:
    """Calls Person 5's RAG system to search local knowledge base."""
    # TODO: replace with the real call once Person 5's RAG is ready:
    # from rag.vector_store import search
    # return search(query)
    return "Local SOP retrieved: Follow safety protocol 42."


def generate_docx(content: str, filename: str) -> str:
    """Generates a Word Document."""
    try:
        from docx import Document

        doc = Document()
        # Split content into paragraphs on blank lines so multi-section
        # text (e.g. "Findings\n\n...\n\nRecommendation\n\n...") reads cleanly.
        for paragraph in content.split("\n\n"):
            if paragraph.strip():
                doc.add_paragraph(paragraph.strip())

        doc.save(filename)
        return f"Created {filename} successfully."

    except Exception as e:
        return f"Failed to create {filename}: {e}"


def run_code_in_sandbox(code: str) -> str:
    """Executes code securely in the Docker sandbox."""
    # TODO(Person 6): swap this local subprocess call for a real request
    # to the Docker sandbox container once it's ready, e.g.:
    # import requests
    # resp = requests.post("http://sandbox:8080/run", json={"code": code}, timeout=10)
    # return resp.json()["output"]
    #
    # Until then, this runs the code locally with a timeout so the agent
    # loop can be built and demoed without waiting on the sandbox service.
    script_path = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
            f.write(code)
            script_path = f.name

        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=10,
        )

        if result.returncode == 0:
            return f"Code executed successfully. Output: {result.stdout.strip()}"
        return f"Code execution failed (exit {result.returncode}). Error: {result.stderr.strip()}"

    except subprocess.TimeoutExpired:
        return "Code execution timed out after 10 seconds."
    except Exception as e:
        return f"Sandbox execution error: {e}"
    finally:
        if script_path:
            try:
                os.unlink(script_path)
            except Exception:
                pass