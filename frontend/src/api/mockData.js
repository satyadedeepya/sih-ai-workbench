// api/mockData.js
// -----------------------------------------------------------------------
// All demo/placeholder data lives here, isolated from both the UI
// components and from api/client.js's request logic. When a real
// endpoint is ready, delete the corresponding block here and point
// client.js at the network instead — components never import this
// file directly.
// -----------------------------------------------------------------------

export const MOCK_SESSIONS = [
  { id: "s1", title: "Inspection report → approval note", active: true, updatedAt: "2m ago" },
  { id: "s2", title: "CSV downtime analysis (Python)", updatedAt: "1h ago" },
  { id: "s3", title: "P&ID drawing review", updatedAt: "Yesterday" },
];

export const MOCK_KNOWLEDGE_BASE = [
  { name: "Inspection_SOP.pdf", chunks: 142, size: "4.1 MB", updatedAt: "Mar 2026" },
  { name: "Safety_Manual.pdf", chunks: 288, size: "9.8 MB", updatedAt: "Feb 2026" },
  { name: "Maintenance_Manual.pdf", chunks: 201, size: "6.4 MB", updatedAt: "Feb 2026" },
  { name: "Previous_Approval_Notes.pdf", chunks: 76, size: "1.2 MB", updatedAt: "Jan 2026" },
];

export const MODELS = [
  { id: "text", label: "Llama-3.1-70B", role: "General / Reasoning" },
  { id: "coding", label: "Qwen2.5-Coder-32B", role: "Coding" },
  { id: "vision", label: "Vision-Reasoning-14B", role: "Document / Vision" },
];

// Plan templates now carry an estimated duration per step (seconds),
// used only to drive the mock execution timeline's timing/labels.
// Person 4 (agent backend): a real event stream should send
// { label, status, elapsedMs } per step instead — see AgentStatus.jsx.
export const PLAN_TEMPLATES = {
  vision: [
    { label: "Read uploaded file", seconds: 1.1 },
    { label: "Detect scanned vs. text PDF", seconds: 0.4 },
    { label: "Run on-device OCR", seconds: 4.6 },
    { label: "Extract findings from text + layout", seconds: 2.3 },
    { label: "Search local knowledge base", seconds: 1.5 },
    { label: "Compare findings against SOP requirements", seconds: 1.8 },
    { label: "Draft approval note content", seconds: 2.1 },
    { label: "Generate .docx deliverable", seconds: 1.0 },
    { label: "Verify output", seconds: 0.6 },
  ],
  coding: [
    { label: "Parse request & constraints", seconds: 0.5 },
    { label: "Route to coding model", seconds: 0.3 },
    { label: "Generate code", seconds: 2.4 },
    { label: "Execute in isolated sandbox", seconds: 1.6 },
    { label: "Run tests / check output", seconds: 1.1 },
    { label: "Return verified result", seconds: 0.4 },
  ],
  text: [
    { label: "Route to general model", seconds: 0.3 },
    { label: "Search local knowledge base", seconds: 1.2 },
    { label: "Compose grounded answer", seconds: 1.4 },
  ],
};

export const PROCESSING_LABELS = {
  vision: ["Analyzing document", "Searching local knowledge base", "Preparing deliverable", "Verifying output"],
  coding: ["Generating code", "Running in sandbox", "Verifying output"],
  text: ["Searching local knowledge base", "Composing response"],
};

export const DELIVERABLE_TEMPLATES = {
  vision: [{ name: "Approval_Note.docx", kind: "docx", size: "184 KB" }],
  coding: [{ name: "solution.py", kind: "code", size: "3 KB" }],
  text: [],
};

export const SUGGESTED_TASKS = [
  {
    id: "analyze",
    title: "Analyze document",
    description: "Extract findings from a scanned report or drawing",
    prompt: "Analyze this inspection report and prepare an approval note",
    route: "vision",
  },
  {
    id: "code",
    title: "Generate & verify code",
    description: "Write, run, and check code in an isolated sandbox",
    prompt: "Write a Python script to compute average downtime by equipment",
    route: "coding",
  },
  {
    id: "search",
    title: "Search knowledge base",
    description: "Ask a question grounded in local SOPs and manuals",
    prompt: "Summarize what the Safety Manual says about confined-space entry",
    route: "text",
  },
  {
    id: "drawing",
    title: "Review engineering drawing",
    description: "Read a P&ID or scanned diagram for key details",
    prompt: "Review this P&ID and list every safety valve and its tag number",
    route: "vision",
  },
];

// Ambient background log lines — rotate continuously so the System Log
// panel never looks frozen between tasks.
export const AMBIENT_LOG_LINES = [
  { level: "INFO", text: "heartbeat: no outbound DNS queries" },
  { level: "SUCCESS", text: "egress firewall: 0 packets forwarded" },
  { level: "INFO", text: "watchdog: sandbox netns confirmed isolated" },
  { level: "INFO", text: "vector index: idle, 707 chunks resident" },
  { level: "INFO", text: "model pool: 3/3 warm" },
  { level: "SUCCESS", text: "integrity check: local weights hash OK" },
];

// Contextual lines fired when a chat run starts, keyed by route.
export const RUN_LOG_LINES = {
  vision: [
    { level: "INFO", text: "task classifier: routed → vision" },
    { level: "INFO", text: "ocr: running on-device (tesseract)" },
    { level: "INFO", text: "rag: querying local vector store" },
    { level: "SUCCESS", text: "docx writer: draft staged in /local/outputs" },
  ],
  coding: [
    { level: "INFO", text: "task classifier: routed → coding" },
    { level: "INFO", text: "sandbox: container spawned, net=none" },
    { level: "INFO", text: "sandbox: executing generated script" },
    { level: "SUCCESS", text: "sandbox: exit 0, output captured" },
  ],
  text: [
    { level: "INFO", text: "task classifier: routed → general" },
    { level: "INFO", text: "rag: querying local vector store" },
    { level: "SUCCESS", text: "response grounded, 0 external lookups" },
  ],
};
