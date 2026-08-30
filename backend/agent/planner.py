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

try:
    from llm.ollama_client import generate_completion
except Exception:
    generate_completion = None  # Person 3's module not ready yet — fall back to mock

from agent.tools import read_file, search_kb, generate_docx, run_code_in_sandbox

TOOL_FUNCTIONS = {
    "read_file": read_file,
    "search_kb": search_kb,
    "generate_docx": generate_docx,
    "run_code_in_sandbox": run_code_in_sandbox,
}


def _mock_plan(prompt: str) -> dict:
    """Scripted fallback plan, used only when generate_completion is unavailable."""
    if "inspection" in prompt.lower() or "approval note" in prompt.lower():
        return {
            "thought": "Document analysis task: read report, search SOP, draft approval note.",
            "plan": [
                {"tool": "read_file", "args": {"filepath": "sample_report.txt"}},
                {"tool": "search_kb", "args": {"query": "inspection findings SOP"}},
                {"tool": "generate_docx", "args": {
                    "content": "Findings\n\nFindings extracted from the report go here.\n\nRecommendation\n\nRecommendation goes here.",
                    "filename": "Approval_Note.docx",
                }},
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


def _get_plan(prompt: str, model_name: str) -> dict:
    """Ask the LLM for a JSON plan; fall back to the mock plan on any failure."""
    plan_prompt = (
        "You are an agent planner. Given the task below, return ONLY a JSON object "
        "with keys 'thought' (string) and 'plan' (a list of steps). Each step is "
        '{"tool": "<tool name>", "args": {...}}. Available tools: read_file, search_kb, '
        f"generate_docx, run_code_in_sandbox.\n\nTask: {prompt}"
    )

    if generate_completion is not None:
        try:
            raw = generate_completion(model_name, plan_prompt)
            return json.loads(raw)
        except Exception as e:
            print(f"[planner] generate_completion failed ({e}), falling back to mock plan")

    return _mock_plan(prompt)


def run_agent(prompt: str, model_name: str, active_files: list) -> str:
    """
    The core agent execution loop.
    """
    print(f"--- Starting Agent Execution using {model_name} ---")

    parsed = _get_plan(prompt, model_name)
    thought = parsed.get("thought", "")
    plan = parsed.get("plan", [])

    print(f"Thought: {thought}")

    outputs = []
    for step in plan:
        tool_name = step.get("tool")
        args = step.get("args", {})

        tool_fn = TOOL_FUNCTIONS.get(tool_name)
        if tool_fn is None:
            print(f"  -> Unknown tool: {tool_name}, skipping")
            continue

        result = tool_fn(**args)
        print(f"  -> {tool_name}({args}) => {result}")
        outputs.append(result)

        if isinstance(result, str) and result.lower().startswith(("error", "failed", "file not found")):
            return f"Agent execution failed at step '{tool_name}': {result}"

    return "Agent execution completed. " + " | ".join(outputs) if outputs else "Agent execution completed."


if __name__ == "__main__":
    with open("sample_report.txt", "w") as f:
        f.write("Inspection Report\n\nFinding 1: Corrosion detected on line 12.\nFinding 2: Pressure gauge nominal.")

    print(run_agent("Analyze this inspection report and prepare an approval note.", "local-model", ["sample_report.txt"]))
    print()
    print(run_agent("Write a Python program and run it in the sandbox.", "local-model", []))