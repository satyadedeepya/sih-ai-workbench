# /**
#  * PERSON 4: AGENT & TOOLS ENGINEER
#  * 
#  * TODOs for planner.py:
#  * 1. Implement the Agent Loop: Think -> Act -> Observe.
#  * 2. Given a prompt, ask the LLM to create a "Plan".
#  * 3. Execute the steps in the plan by calling the appropriate local tools (from tools.py).
#  * 4. Iterate until the goal is achieved, then format the final output (e.g. generate a DOCX).
#  */

# from llm.ollama_client import generate_completion
# from agent.tools import read_file, search_kb, generate_docx

# def run_agent(prompt: str, model_name: str, active_files: list) -> str:
#     """
#     The core agent execution loop.
#     """
#     print(f"--- Starting Agent Execution using {model_name} ---")
    
#     # Step 1: Create Plan
#     plan_prompt = f"Create a step-by-step plan to solve this task using available tools: {prompt}"
#     # plan = generate_completion(model_name, plan_prompt)
    
#     # Step 2: Execute Plan (Pseudo-code)
#     # for step in plan:
#     #     if step requires search: search_kb()
#     #     if step requires file generation: generate_docx()
    
#     return "Agent execution completed. Files generated (if applicable)."










"""
PERSON 4: AGENT & TOOLS ENGINEER

TODOs for planner.py:
1. Implement the Agent Loop: Think -> Act -> Observe.
2. Given a prompt, ask the LLM to create a "Plan".
3. Execute the steps in the plan by calling the appropriate local tools (from tools.py).
4. Iterate until the goal is achieved, then format the final output (e.g. generate a DOCX).
"""

import json
import re

try:
    from llm.ollama_client import OllamaClient
    _ollama_client = OllamaClient()
except Exception:
    _ollama_client = None  # Person 3's module not importable yet — fall back to mock

from agent.tools import read_file, search_kb, generate_docx, run_code_in_sandbox

TOOL_FUNCTIONS = {
    "read_file": read_file,
    "search_kb": search_kb,
    "generate_docx": generate_docx,
    "run_code_in_sandbox": run_code_in_sandbox,
}

# Small local models are inconsistent about argument names.
# This maps common variations the model might use to the actual
# parameter name each tool function expects.
ARG_ALIASES = {
    "read_file": {"filename": "filepath", "file_path": "filepath", "path": "filepath"},
    "generate_docx": {"filepath": "filename", "output_path": "filename", "text": "content"},
    "search_kb": {"search_query": "query", "q": "query"},
    "run_code_in_sandbox": {"script": "code", "python_code": "code"},
}


def _normalize_args(tool_name: str, args: dict) -> dict:
    """Rename any argument keys the model got 'close enough' on."""
    aliases = ARG_ALIASES.get(tool_name, {})
    normalized = {}
    for key, value in args.items():
        real_key = aliases.get(key, key)
        normalized[real_key] = value
    return normalized


def _extract_json(text: str) -> dict:
    """
    Small local models sometimes wrap JSON in extra text or code fences.
    This pulls out the first {...} block and parses it.
    """
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text)
    text = re.sub(r"```$", "", text).strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model output")
    return json.loads(match.group(0))


def _mock_plan(prompt: str) -> dict:
    """Scripted fallback plan, used only when Ollama is unavailable or returns bad output."""
    if "inspection" in prompt.lower() or "approval note" in prompt.lower():
        return {
            "thought": "Document analysis task: read report, search SOP, draft approval note.",
            "plan": [
                {"tool": "read_file", "args": {"filepath": "sample_report.txt"}},
                {"tool": "search_kb", "args": {"query": "inspection findings SOP"}},
                {"tool": "generate_docx", "args": {"content": "", "filename": "Approval_Note.docx"}},
            ],
        }
    if "code" in prompt.lower() or "python" in prompt.lower():
        return {
            "thought": "Coding task: generate and run a short script.",
            "plan": [
                {"tool": "run_code_in_sandbox", "args": {"code": "print('hello from the sandbox')"}},
            ],
        }
    return {"thought": "Unrecognized task type.", "plan": []}


def _get_plan(prompt: str, model_name: str, active_files: list) -> dict:
    """Ask Ollama for a JSON plan; fall back to the mock plan on any failure."""

    files_note = (
        f"Available files the user uploaded: {active_files}. "
        "You MUST use these exact filenames if reading a file — never invent a filename."
        if active_files else
        "No files were uploaded for this task."
    )

    plan_prompt = f"""You are an agent planner for an industrial AI workbench. Given the task below, return ONLY a JSON object with keys 'thought' (string) and 'plan' (a list of steps).

Each step is: {{"tool": "<tool name>", "args": {{...}}}}

Available tools:
- read_file(filepath): reads an existing text file. Use ONLY for reading uploaded documents.
- search_kb(query): searches internal SOPs/manuals for relevant information.
- generate_docx(content, filename): creates a Word document. Leave content as an empty string — it will be filled in automatically after gathering information.
- run_code_in_sandbox(code): writes and executes a Python script.

{files_note}

STRICT RULES — follow these exactly, do not skip steps:
1. If files were uploaded (see above), you MUST include a read_file step for EVERY uploaded file, using its exact filename.
2. If the task asks for a report, approval note, summary document, or anything to be written/prepared/drafted, you MUST include exactly one generate_docx step as the LAST step in the plan.
3. If the task is about writing or running code (not documents), use run_code_in_sandbox instead — do not include generate_docx in that case.
4. search_kb is optional — only include it if the task mentions checking SOPs, manuals, or guidelines.

Example — task "analyze inspection_report.txt and prepare an approval note", with file inspection_report.txt available:
{{"thought": "Document task: must read the file then generate a docx.", "plan": [
    {{"tool": "read_file", "args": {{"filepath": "inspection_report.txt"}}}},
    {{"tool": "generate_docx", "args": {{"content": "", "filename": "Approval_Note.docx"}}}}
]}}

Example — task "write and run a python script to print numbers 1 to 5":
{{"thought": "This is a coding task.", "plan": [{{"tool": "run_code_in_sandbox", "args": {{"code": "for i in range(1,6): print(i)"}}}}]}}

Task: {prompt}

Respond with JSON only, no other text, no markdown formatting."""

    if _ollama_client is not None and _ollama_client.is_available():
        try:
            result = _ollama_client.generate(model_name, plan_prompt)
            raw_text = result["response"]
            return _extract_json(raw_text)
        except Exception as e:
            print(f"[planner] Ollama call failed ({e}), falling back to mock plan")
    else:
        print("[planner] Ollama not available, using mock plan")

    return _mock_plan(prompt)


def _synthesize_document_content(original_prompt: str, gathered_info: list, model_name: str) -> str:
    """
    Second LLM call: given everything the agent has read/searched so far,
    write the actual document body. This is what makes the output real
    instead of a generic placeholder — the model has to use the gathered
    facts, not guess.
    """
    context = "\n\n".join(gathered_info) if gathered_info else "(no information was gathered)"

    synth_prompt = f"""You are drafting the body text of a Word document for an industrial approval note.

User's request: {original_prompt}

Information gathered so far:
{context}

Write the document content now. Reference the specific findings above — do not write a generic placeholder like "see attached". Plain text only, no JSON, no markdown headers, just the document body."""

    if _ollama_client is not None and _ollama_client.is_available():
        try:
            result = _ollama_client.generate(model_name, synth_prompt)
            return result["response"].strip()
        except Exception as e:
            print(f"[planner] Synthesis call failed ({e}), using gathered info directly")

    # Fallback if Ollama unavailable: just dump what was gathered
    return context


def _fix_code_with_error(broken_code: str, error_message: str, model_name: str) -> str:
    """
    If generated code fails to run, send the code + error back to the
    model and ask for a corrected version. One retry only — if it still
    fails after this, we give up and report the error.
    """
    fix_prompt = f"""The following Python code failed to run:

```
{broken_code}
```

Error:
{error_message}

Fix the code. Respond with ONLY the corrected Python code, no explanation, no markdown code fences."""

    if _ollama_client is not None and _ollama_client.is_available():
        try:
            result = _ollama_client.generate(model_name, fix_prompt)
            fixed = result["response"].strip()
            fixed = re.sub(r"^```(?:python)?", "", fixed)
            fixed = re.sub(r"```$", "", fixed).strip()
            return fixed
        except Exception as e:
            print(f"[planner] Code-fix call failed ({e})")

    return broken_code  # couldn't fix it, return original so it fails the same way


def run_agent(prompt: str, model_name: str, active_files: list) -> str:
    """
    The core agent execution loop.

    Two-phase execution:
      Phase A — run all "information gathering" steps (read_file, search_kb,
                run_code_in_sandbox) in order, collecting their output.
                run_code_in_sandbox gets one automatic retry if it fails,
                using the error to ask the model for a fix.
      Phase B — if the plan includes generate_docx, synthesize real content
                from everything gathered in Phase A before writing the file.
    """
    print(f"--- Starting Agent Execution using {model_name} ---")

    parsed = _get_plan(prompt, model_name, active_files)
    thought = parsed.get("thought", "")
    plan = parsed.get("plan", [])

    print(f"Thought: {thought}")

    # Safety net: if the model invents a filename instead of using the one
    # actually uploaded, auto-correct it. Only safe to do when there's
    # exactly one uploaded file — with multiple files we can't guess which
    # one was meant, so we leave those cases alone.
    if len(active_files) == 1:
        for step in plan:
            if step.get("tool") == "read_file":
                step_args = step.get("args", {})
                given_path = step_args.get("filepath") or step_args.get("filename") or step_args.get("path")
                if given_path != active_files[0]:
                    print(f"  -> Correcting hallucinated filename '{given_path}' to '{active_files[0]}'")
                    step["args"] = {"filepath": active_files[0]}

    # Guard: if no files were uploaded but the plan still tries to read one,
    # fail clearly instead of letting it hit a generic "File not found".
    if not active_files:
        for step in plan:
            if step.get("tool") == "read_file":
                return (
                    "I can't complete this task — it asks me to read a file, "
                    "but no file was uploaded. Please upload the document you'd "
                    "like me to analyze."
                )

    gathered_info = []
    docx_step = None
    outputs = []

    # Phase A — execute every step except generate_docx, save that step for later
    for step in plan:
        tool_name = step.get("tool")
        args = _normalize_args(tool_name, step.get("args", {}))

        if tool_name == "generate_docx":
            docx_step = args  # handle after gathering is done
            continue

        tool_fn = TOOL_FUNCTIONS.get(tool_name)
        if tool_fn is None:
            print(f"  -> Unknown tool: {tool_name}, skipping")
            continue

        try:
            result = tool_fn(**args)
        except TypeError as e:
            print(f"  -> Bad arguments for {tool_name}: {args} ({e})")
            return f"Agent execution failed at step '{tool_name}': model passed unexpected arguments {args}"

        # One retry for broken generated code
        if tool_name == "run_code_in_sandbox" and isinstance(result, str) and "failed" in result.lower():
            print(f"  -> {tool_name} failed, asking model to fix the code and retrying once...")
            fixed_code = _fix_code_with_error(args.get("code", ""), result, model_name)
            result = tool_fn(code=fixed_code)
            args = {"code": fixed_code}

        print(f"  -> {tool_name}({args}) => {result}")
        outputs.append(result)

        if isinstance(result, str) and result.lower().startswith(("error", "failed", "file not found")):
            return f"Agent execution failed at step '{tool_name}': {result}"

        gathered_info.append(f"[{tool_name}] {result}")

    # Phase B — generate the document using everything gathered
    if docx_step is not None:
        filename = docx_step.get("filename", "output.docx")
        real_content = _synthesize_document_content(prompt, gathered_info, model_name)

        result = generate_docx(content=real_content, filename=filename)
        print(f"  -> generate_docx(content=<synthesized>, filename='{filename}') => {result}")
        outputs.append(result)

        if isinstance(result, str) and result.lower().startswith(("error", "failed")):
            return f"Agent execution failed at step 'generate_docx': {result}"

    return "Agent execution completed. " + " | ".join(outputs) if outputs else "Agent execution completed."


if __name__ == "__main__":
    with open("sample_report.txt", "w") as f:
        f.write("Inspection Report\n\nFinding 1: Corrosion detected on line 12.\nFinding 2: Pressure gauge nominal.")

    print(run_agent("Analyze this inspection report and prepare an approval note.", "llama3.2", ["sample_report.txt"]))
    print()
    print(run_agent("Write a Python program and run it in the sandbox.", "llama3.2", []))