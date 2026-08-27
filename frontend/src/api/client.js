// api/client.js
// -----------------------------------------------------------------------
// Person 1 (you): this file is the ONLY place that should know about
// fetch/URLs. Components never call fetch() directly — they call the
// functions exported here. That way, when Person 2 finishes the real
// FastAPI endpoints, you flip USE_MOCK to false and nothing else in the
// app has to change.
//
// Person 2 (backend): the shape every function resolves to is documented
// above it. Match those shapes (or tell Person 1 what changed) and the
// UI keeps working. Suggested real endpoints, per the implementation
// plan:
//   POST /api/chat            { message, sessionId, attachments[] }
//   POST /api/upload          multipart file -> { fileId, name, type }
//   POST /api/agent/run       { sessionId, messageId } -> agent run stream
//   GET  /api/agent/status    ?runId=...
//   GET  /api/models          -> list of models + which is "hot"
//   GET  /api/network/stats   -> external call counter, for the monitor
//   GET  /api/kb/documents    -> local knowledge base file list
// -----------------------------------------------------------------------

const USE_MOCK = true; // Person 1: flip to false once /api is live.

// ---- Task classifier -----------------------------------------------
// This is a client-side STUB standing in for Person 3's real router
// (backend/llm/router.py). It exists purely so the UI has something to
// react to during frontend development. Replace calls to this with a
// real POST /api/chat response once the backend exists.
export function classifyTask({ text, hasAttachment }) {
  const t = text.toLowerCase();
  if (hasAttachment) {
    return {
      task: "Document Analysis",
      model: "Vision-Reasoning-14B (local)",
      route: "vision",
    };
  }
  if (/\b(code|python|java|script|function|bug|sql|program)\b/.test(t)) {
    return {
      task: "Coding",
      model: "Qwen2.5-Coder-32B (local)",
      route: "coding",
    };
  }
  return {
    task: "General / Text",
    model: "Llama-3.1-70B (local)",
    route: "text",
  };
}

// ---- Agent run plans, keyed by route --------------------------------
// Mirrors the demo flow in the implementation plan: document pipeline
// and coding pipeline. Person 4 owns the real planner
// (backend/agent/planner.py) — this is just enough to make the
// AgentPlan component demoable without a backend.
const PLAN_TEMPLATES = {
  vision: [
    "Read uploaded file",
    "Detect scanned vs. text PDF",
    "Run on-device OCR",
    "Extract findings from text + layout",
    "Search local knowledge base (SOPs)",
    "Compare findings against requirements",
    "Draft approval note content",
    "Generate .docx deliverable",
    "Verify output",
  ],
  coding: [
    "Parse request & constraints",
    "Route to coding model",
    "Generate code",
    "Execute in isolated sandbox",
    "Run tests / check output",
    "Return verified result",
  ],
  text: [
    "Route to general model",
    "Search local knowledge base",
    "Compose grounded answer",
  ],
};

const DELIVERABLE_TEMPLATES = {
  vision: [{ name: "Approval_Note.docx", kind: "docx" }],
  coding: [{ name: "solution.py", kind: "code" }],
  text: [],
};

// ---- Public "send message" call -------------------------------------
// Resolves to a fully-formed agent run description. In mock mode this
// is synthesized locally; in live mode it should call POST /api/chat
// and (if the backend streams steps) POST /api/agent/run.
export async function sendMessage({ text, attachment }) {
  if (!USE_MOCK) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, attachment }),
    });
    if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
    return res.json();
  }

  const classification = classifyTask({ text, hasAttachment: !!attachment });
  const steps = PLAN_TEMPLATES[classification.route];
  const deliverables = DELIVERABLE_TEMPLATES[classification.route];

  return {
    classification,
    steps,
    deliverables,
    reply: buildMockReply(classification, attachment),
  };
}

function buildMockReply(classification, attachment) {
  if (classification.route === "vision") {
    return `Findings extracted from ${attachment?.name ?? "the uploaded document"} and cross-checked against the local SOP index. Draft approval note generated below — nothing left this machine.`;
  }
  if (classification.route === "coding") {
    return "Code generated and executed inside the sandbox container (no network namespace attached). Output verified below.";
  }
  return "Answer composed using the local model, grounded against the on-prem knowledge base.";
}

// ---- Knowledge base listing ------------------------------------------
export async function getKnowledgeBase() {
  if (!USE_MOCK) {
    const res = await fetch("/api/kb/documents");
    return res.json();
  }
  return [
    { name: "Inspection_SOP.pdf", chunks: 142 },
    { name: "Safety_Manual.pdf", chunks: 288 },
    { name: "Maintenance_Manual.pdf", chunks: 201 },
    { name: "Previous_Approval_Notes.pdf", chunks: 76 },
  ];
}

// ---- Network monitor ---------------------------------------------------
// The literal proof-of-sovereignty widget from the problem statement.
// Person 6 should wire this to the real network_monitor.sh output over
// a WebSocket or polling endpoint. Until then it just proves the UI
// contract: an ever-present, always-zero external call counter.
export async function getNetworkStats() {
  if (!USE_MOCK) {
    const res = await fetch("/api/network/stats");
    return res.json();
  }
  return { externalCalls: 0, blocked: 0, airGapped: true };
}
