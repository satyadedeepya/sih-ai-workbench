# backend/llm/test_classifier_stress.py

try:
    from .classifier import classify_task
except ImportError:
    from classifier import classify_task

# Each entry: (prompt, file_info, expected_task_type)
TEST_CASES = [
    # --- Coding ---
    ("Write a Python program to analyze this CSV and calculate average downtime by equipment.",
     None, "coding"),
    ("Can you implement SJF scheduling in Java?",
     None, "coding"),
    ("Fix the bug in this function, it's throwing an index error.",
     None, "coding"),
    ("Write a script to rename all files in a folder.",
     None, "coding"),

    # --- Document (no file attached, but clearly about analysis) ---
    ("Summarize the major findings in the attached inspection report.",
     None, "document"),
    ("Prepare an approval note based on the SOP and inspection results.",
     None, "document"),
    ("Compare these findings with the safety manual requirements.",
     None, "document"),

    # --- Document (with file_info, text-based file) ---
    ("Analyze this and prepare an approval note.",
     {"filename": "inspection_report.pdf", "extension": ".pdf", "is_scanned": False},
     "document"),
    ("Extract the key points from this manual.",
     {"filename": "safety_manual.docx", "extension": ".docx", "is_scanned": False},
     "document"),

    # --- Vision (scanned PDF or image file) ---
    ("Analyze this and prepare an approval note.",
     {"filename": "scanned_report.pdf", "extension": ".pdf", "is_scanned": True},
     "vision"),
    ("What does this drawing show?",
     {"filename": "pid_diagram.png", "extension": ".png", "is_scanned": False},
     "vision"),
    ("Read the handwritten notes in this photo.",
     {"filename": "notes.jpg", "extension": ".jpg", "is_scanned": False},
     "vision"),

    # --- General / ambiguous (should NOT be misclassified as coding/document) ---
    ("Hello, what can you help me with?",
     None, "general"),
    ("What's the difference between preventive and predictive maintenance?",
     None, "general"),
    ("Explain what this system does.",
     None, "general"),

    # --- Tricky edge cases worth knowing about ---
    ("The report mentions a Python script was used for calibration — is that normal?",
     None, "coding"),  # false positive risk: "Python" appears but intent is document-ish
    ("Write a summary of this code file's logic.",
     {"filename": "script.py", "extension": ".py", "is_scanned": False},
     "coding"),  # ambiguous: could argue document, but code file = coding makes sense
]


def run_stress_test():
    passed = 0
    failed = []

    for prompt, file_info, expected in TEST_CASES:
        actual = classify_task(prompt, file_info)
        status = "✅" if actual == expected else "❌"
        if actual == expected:
            passed += 1
        else:
            failed.append((prompt, file_info, expected, actual))

        print(f"{status} expected={expected:<10} actual={actual:<10} | {prompt[:60]}")

    print(f"\n{passed}/{len(TEST_CASES)} passed")

    if failed:
        print("\n=== FAILURES ===")
        for prompt, file_info, expected, actual in failed:
            print(f"Prompt: {prompt}")
            print(f"  file_info: {file_info}")
            print(f"  expected: {expected} | got: {actual}\n")


if __name__ == "__main__":
    run_stress_test()