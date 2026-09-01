// frontend/src/api/client.js

import {
  MOCK_SESSIONS,
  MOCK_KNOWLEDGE_BASE,
  PLAN_TEMPLATES,
  DELIVERABLE_TEMPLATES,
} from "./mockData.js";

const USE_MOCK = false;
const USE_REAL_CHAT = true;
const USE_REAL_UPLOAD = true;


// ---- Task classifier ---------------------------------------------------

export function classifyTask({ text, hasAttachment }) {
  if (hasAttachment) {
    return {
      task: "Document Analysis",
      model: "llama3.1:8b (local)",
      route: "vision",
    };
  }

  return {
    task: "General / Text",
    model: "llama3.1:8b (local)",
    route: "text",
  };
}


// ---- File upload -------------------------------------------------------

export async function uploadFile(file) {
  if (!file) {
    return null;
  }

  if (!USE_REAL_UPLOAD || USE_MOCK) {
    return {
      filename: file.name,
      status: "Uploaded successfully",
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`File upload failed: ${res.status}`);
  }

  return res.json();
}


// ---- Public send message call ------------------------------------------

export async function sendMessage({ text, attachment }) {
  let uploadedFile = null;

  if (attachment && USE_REAL_UPLOAD) {
    uploadedFile = await uploadFile(attachment);
  }

  if (USE_REAL_CHAT && !USE_MOCK) {
    const responseAttachment = uploadedFile
      ? {
          name: uploadedFile.filename,
        }
      : null;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        attachment: responseAttachment,
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat request failed: ${res.status}`);
    }

    const data = await res.json();

    const classification =
      data.classification ||
      classifyTask({
        text,
        hasAttachment: !!attachment,
      });

    return {
      classification,
      steps:
        data.steps ||
        PLAN_TEMPLATES[classification.route] ||
        [],
      deliverables:
        data.deliverables ||
        data.generated_files ||
        [],
      reply:
        data.reply ||
        data.response ||
        "No response received from backend.",
    };
  }

  const classification = classifyTask({
    text,
    hasAttachment: !!attachment,
  });

  const steps =
    PLAN_TEMPLATES[classification.route] || [];

  const deliverables =
    DELIVERABLE_TEMPLATES[classification.route] || [];

  return {
    classification,
    steps,
    deliverables,
    reply: buildMockReply(
      classification,
      attachment
    ),
  };
}


// ---- Mock reply fallback -----------------------------------------------

function buildMockReply(classification, attachment) {
  if (classification.route === "vision") {
    return (
      `Findings extracted from ${
        attachment?.name ??
        "the uploaded document"
      } and cross-checked against the local SOP index. ` +
      "Draft approval note generated below."
    );
  }

  if (classification.route === "coding") {
    return (
      "Code generated and executed inside the sandbox container. " +
      "Output verified below."
    );
  }

  return (
    "Answer composed using the local model, grounded against " +
    "the on-prem knowledge base."
  );
}


// ---- Sessions -----------------------------------------------------------

export async function getSessions() {
  return MOCK_SESSIONS;
}


// ---- Knowledge base listing --------------------------------------------

export async function getKnowledgeBase() {
  return MOCK_KNOWLEDGE_BASE;
}


// ---- Network monitor ----------------------------------------------------

export async function getNetworkStats() {
  return {
    externalCalls: 0,
    blocked: 0,
    airGapped: true,
    healthy: true,
  };
}


// ---- System / GPU telemetry --------------------------------------------

export async function getSystemStatus() {
  return {
    gpuNode: "GPU-NODE-01",
    vramPct: 61,
    modelsResident: 1,
    modelsTotal: 1,
  };
}