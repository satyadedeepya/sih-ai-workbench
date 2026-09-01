import json
import re
import json

try:
    from llm.ollama_client import OllamaClient
    _ollama_client = OllamaClient()
except Exception:
    _ollama_client = None

from agent.tools import (
    read_file,
    search_kb,
    generate_docx,
    run_code_in_sandbox,
)


TOOL_FUNCTIONS = {
    "read_file": read_file,
    "search_kb": search_kb,
    "generate_docx": generate_docx,
    "run_code_in_sandbox": run_code_in_sandbox,
}


ARG_ALIASES = {
    "read_file": {
        "filename": "filepath",
        "file_path": "filepath",
        "path": "filepath",
    },
    "generate_docx": {
        "filepath": "filename",
        "output_path": "filename",
        "text": "content",
    },
    "search_kb": {
        "search_query": "query",
        "q": "query",
    },
    "run_code_in_sandbox": {
        "script": "code",
        "python_code": "code",
    },
}


def _normalize_args(tool_name: str, args: dict) -> dict:
    aliases = ARG_ALIASES.get(tool_name, {})
    normalized = {}

    if not isinstance(args, dict):
        return normalized

    for key, value in args.items():
        real_key = aliases.get(key, key)
        normalized[real_key] = value

    return normalized


def _extract_json(text: str) -> dict:
    text = text.strip()

    text = re.sub(
        r"^```(?:json)?",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"```$",
        "",
        text,
    ).strip()

    match = re.search(
        r"\{.*\}",
        text,
        re.DOTALL,
    )

    if not match:
        raise ValueError(
            "No JSON object found in model output"
        )

    return json.loads(match.group(0))


def _ask_llm(prompt: str, model_name: str) -> str:
    if _ollama_client is None:
        raise RuntimeError(
            "Ollama client is not available"
        )

    if not _ollama_client.is_available():
        raise RuntimeError(
            "Ollama is not available"
        )

    result = _ollama_client.generate(
        model_name,
        prompt,
    )

    return result["response"].strip()


def _read_uploaded_files(active_files: list) -> list:
    """
    Read all files uploaded with the current request.

    This is intentionally deterministic.
    We do NOT ask the LLM to decide whether to read
    the uploaded file.
    """

    gathered = []

    for filepath in active_files:

        if not filepath:
            continue

        print(
            f"  -> Reading uploaded file: {filepath}"
        )

        try:
            result = read_file(filepath)

        except Exception as e:
            result = (
                f"Error reading uploaded file: {e}"
            )

        if result:
            gathered.append(
                f"FILE: {filepath}\n\n{result}"
            )

    return gathered


def _synthesize_file_answer(
    original_prompt: str,
    gathered_info: list,
    model_name: str,
) -> str:

    if not gathered_info:
        return (
            "I could not read the uploaded file."
        )

    context = "\n\n".join(
        gathered_info
    )

    final_prompt = f"""
You are an AI assistant analyzing a document uploaded by the user.

Answer the user's question using ONLY the information contained
in the uploaded document.

Do not use the knowledge base.
Do not invent information.
Do not say that you lack access to the document if the document
contains the answer.

If the document does not contain the requested information,
say clearly that the information is not present in the document.

Give a direct, concise answer.

USER QUESTION:
{original_prompt}

UPLOADED DOCUMENT:
{context}

ANSWER:
"""

    try:
        return _ask_llm(
            final_prompt,
            model_name,
        )

    except Exception as e:
        print(
            f"[planner] File answer generation failed: {e}"
        )

        return (
            "The document was successfully read, "
            "but the local model failed to generate "
            f"the answer: {e}"
        )


def _create_plan(
    prompt: str,
    model_name: str,
    active_files: list,
) -> dict:

    if active_files:
        files_description = "\n".join(
            f"- {filename}"
            for filename in active_files
        )
    else:
        files_description = (
            "No files are currently uploaded."
        )

    planner_prompt = f"""
You are the planning component of a local AI workbench.

Available tools:

1. read_file(filepath)
2. search_kb(query)
3. generate_docx(content, filename)
4. run_code_in_sandbox(code)

Currently uploaded files:
{files_description}

Rules:

- If an uploaded file exists and the user asks about it,
  use read_file with the exact uploaded filename.
- Never invent filenames.
- If the user asks about an internal SOP/manual/knowledge base,
  use search_kb with a valid query.
- If the user explicitly asks to execute or test code,
  use run_code_in_sandbox.
- For ordinary questions, use no tools.
- Keep the plan minimal.
- Every tool argument must match the function signature exactly.

Return ONLY valid JSON.

Format:

{{
    "thought": "brief explanation",
    "plan": [
        {{
            "tool": "tool_name",
            "args": {{}}
        }}
    ]
}}

USER:
{prompt}
"""

    raw_response = _ask_llm(
        planner_prompt,
        model_name,
    )

    return _extract_json(
        raw_response
    )


def _fallback_plan(
    prompt: str,
    active_files: list,
) -> dict:

    if active_files:
        return {
            "thought": (
                "Read the uploaded document."
            ),
            "plan": [
                {
                    "tool": "read_file",
                    "args": {
                        "filepath": filepath
                    },
                }
                for filepath in active_files
            ],
        }

    return {
        "thought": "No tool required.",
        "plan": [],
    }


def _get_plan(
    prompt: str,
    model_name: str,
    active_files: list,
) -> dict:

    try:
        return _create_plan(
            prompt,
            model_name,
            active_files,
        )

    except Exception as e:

        print(
            f"[planner] LLM planning failed: {e}"
        )

        return _fallback_plan(
            prompt,
            active_files,
        )


def _synthesize_final_answer(
    original_prompt: str,
    gathered_info: list,
    model_name: str,
) -> str:

    if not gathered_info:
        return _ask_llm(
            original_prompt,
            model_name,
        )

    context = "\n\n".join(
        gathered_info
    )

    final_prompt = f"""
You are the final response component of an industrial AI workbench.

Answer the user's request using the information gathered from
the uploaded document or local tools.

User request:
{original_prompt}

Information gathered:
{context}

Rules:

- Answer the actual question directly.
- Use the gathered information.
- Do not invent facts.
- Do not mention internal tool names.
- If the information is insufficient, say so clearly.
- Keep the answer concise and useful.
"""

    try:
        return _ask_llm(
            final_prompt,
            model_name,
        )

    except Exception as e:

        print(
            f"[planner] Final synthesis failed: {e}"
        )

        return context


def _fix_code_with_error(
    broken_code: str,
    error_message: str,
    model_name: str,
) -> str:

    fix_prompt = f"""
The following Python code failed during execution.

CODE:
{broken_code}

ERROR:
{error_message}

Return ONLY corrected Python code.
Do not use markdown.
Do not explain anything.
"""

    try:

        fixed = _ask_llm(
            fix_prompt,
            model_name,
        )

        fixed = re.sub(
            r"^```(?:python)?",
            "",
            fixed,
            flags=re.IGNORECASE,
        )

        fixed = re.sub(
            r"```$",
            "",
            fixed,
        ).strip()

        return fixed

    except Exception as e:

        print(
            f"[planner] Code fix failed: {e}"
        )

        return broken_code


def run_agent(
    prompt: str,
    model_name: str,
    active_files: list,
) -> str:

    print(
        f"--- Starting Agent Execution using {model_name} ---"
    )

    # ============================================================
    # IMPORTANT:
    # Uploaded files bypass the LLM planner.
    #
    # This prevents the 8B model from randomly choosing
    # search_kb, inventing filenames, or requesting invalid
    # tool arguments.
    # ============================================================

    if active_files:

        print(
            f"Uploaded files detected: {active_files}"
        )

        gathered_info = _read_uploaded_files(
            active_files
        )

        if not gathered_info:
            return (
                "I could not extract readable text "
                "from the uploaded document."
            )

        print(
            "  -> Uploaded document read successfully."
        )

        return _synthesize_file_answer(
            prompt,
            gathered_info,
            model_name,
        )

    # ============================================================
    # NO FILE:
    # Use the normal agent planner.
    # ============================================================

    parsed = _get_plan(
        prompt,
        model_name,
        active_files,
    )

    thought = parsed.get(
        "thought",
        "",
    )

    plan = parsed.get(
        "plan",
        [],
    )

    print(
        f"Thought: {thought}"
    )

    if not isinstance(plan, list):
        return (
            "The AI planner returned an invalid execution plan."
        )

    gathered_info = []
    docx_step = None

    for step in plan:

        if not isinstance(step, dict):
            continue

        tool_name = step.get(
            "tool"
        )

        args = _normalize_args(
            tool_name,
            step.get("args", {}),
        )

        if tool_name == "generate_docx":

            docx_step = args
            continue

        if tool_name not in TOOL_FUNCTIONS:

            print(
                f"Unknown tool requested: {tool_name}"
            )

            continue

        tool_fn = TOOL_FUNCTIONS[
            tool_name
        ]

        try:

            result = tool_fn(
                **args
            )

        except TypeError as e:

            print(
                f"Bad arguments for {tool_name}: "
                f"{args} ({e})"
            )

            return (
                f"Agent execution failed at step "
                f"'{tool_name}': invalid arguments."
            )

        except Exception as e:

            print(
                f"Tool {tool_name} failed: {e}"
            )

            return (
                f"Agent execution failed at step "
                f"'{tool_name}': {e}"
            )

        print(
            f"  -> {tool_name}({args}) => {result}"
        )

        if (
            isinstance(result, str)
            and result.lower().startswith(
                (
                    "error",
                    "failed",
                    "file not found",
                )
            )
        ):

            if tool_name == "run_code_in_sandbox":

                print(
                    "  -> Code execution failed. "
                    "Asking the LLM to fix the code."
                )

                fixed_code = _fix_code_with_error(
                    args.get("code", ""),
                    result,
                    model_name,
                )

                try:

                    result = tool_fn(
                        code=fixed_code
                    )

                    print(
                        f"  -> Retry result: {result}"
                    )

                except Exception as retry_error:

                    return (
                        "Agent execution failed during "
                        f"code retry: {retry_error}"
                    )

            else:

                return result

        if isinstance(result, str):
            gathered_info.append(
                result
            )

    # ============================================================
    # Generate document if requested.
    # ============================================================

    if docx_step:

        content = docx_step.get(
            "content",
            "",
        )

        filename = docx_step.get(
            "filename",
            "Generated_Document.docx",
        )

        if not content and gathered_info:

            content = "\n\n".join(
                gathered_info
            )

        try:

            docx_result = generate_docx(
                content=content,
                filename=filename,
            )

            gathered_info.append(
                docx_result
            )

        except Exception as e:

            return (
                f"Document generation failed: {e}"
            )

    return _synthesize_final_answer(
        prompt,
        gathered_info,
        model_name,
    )
