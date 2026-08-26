/**
 * PERSON 4: AGENT & TOOLS ENGINEER
 * 
 * TODOs for planner.py:
 * 1. Implement the Agent Loop: Think -> Act -> Observe.
 * 2. Given a prompt, ask the LLM to create a "Plan".
 * 3. Execute the steps in the plan by calling the appropriate local tools (from tools.py).
 * 4. Iterate until the goal is achieved, then format the final output (e.g. generate a DOCX).
 */

from llm.ollama_client import generate_completion
from agent.tools import read_file, search_kb, generate_docx

def run_agent(prompt: str, model_name: str, active_files: list) -> str:
    """
    The core agent execution loop.
    """
    print(f"--- Starting Agent Execution using {model_name} ---")
    
    # Step 1: Create Plan
    plan_prompt = f"Create a step-by-step plan to solve this task using available tools: {prompt}"
    # plan = generate_completion(model_name, plan_prompt)
    
    # Step 2: Execute Plan (Pseudo-code)
    # for step in plan:
    #     if step requires search: search_kb()
    #     if step requires file generation: generate_docx()
    
    return "Agent execution completed. Files generated (if applicable)."
