// import React, { useState } from 'react';
// import { sendMessageToAgent } from '../api/client';

// /**
//  * PERSON 1: FRONTEND & UI DEVELOPER
//  * 
//  * TODOs for Chat.jsx:
//  * 1. Handle user inputs and display the conversation history.
//  * 2. When a user sends a message, call the backend API (see client.js).
//  * 3. Render rich responses: if the agent outputs a file (like a .docx), render a download button.
//  * 4. If the agent outputs code, render a formatted code block.
//  */
// export default function Chat() {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);

//   const handleSend = async () => {
//     // 1. Add user message to UI
//     // 2. Call sendMessageToAgent(input)
//     // 3. Update UI with agent's response
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto">
//         {/* Render messages here */}
//       </div>
      
//       <div className="mt-4 flex">
//         <input 
//           type="text" 
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask the agent to analyze a document or write code..."
//           className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
//         />
//         <button onClick={handleSend} className="ml-2 bg-blue-600 px-4 py-2 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, User } from "lucide-react";
import FileUploader from "./FileUploader.jsx";
import AgentPlan from "./AgentPlan.jsx";
import { sendMessage } from "../api/client.js";

const SUGGESTIONS = [
  "Analyze this inspection report and prepare an approval note",
  "Write a Python script to compute average downtime by equipment",
  "Summarize what the Safety Manual says about confined-space entry",
];

let runCounter = 0;

// The center pane: message history, the live agent plan for whichever
// message triggered a run, and the composer. `onRun` bubbles the
// latest classification/steps/deliverables up to App so the right-hand
// panels (ModelRouter, Deliverables) can react to it.
export default function Chat({ onRun }) {
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "assistant",
      text: "Workbench is up and running locally. Attach a scanned report, ask for code, or query the knowledge base — every request stays on this machine.",
    },
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || busy) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      attachment: file ? { name: file.name } : null,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const attachedFile = file;
    setFile(null);
    setBusy(true);

    const result = await sendMessage({ text, attachment: attachedFile });
    const runId = `run-${runCounter++}`;

    onRun?.({ ...result, runId });

    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: result.reply,
      steps: result.steps,
      runId,
    };
    setMessages((m) => [...m, assistantMsg]);
    setBusy(false);
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                  m.role === "user"
                    ? "border-wire/40 bg-wire/10 text-wire"
                    : "border-secure/40 bg-secure/10 text-secure"
                }`}
              >
                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`flex max-w-[85%] flex-col gap-2 ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {m.attachment && (
                  <span className="rounded-md border border-base-border bg-base-panel px-2 py-1 font-mono text-[10px] text-text-secondary">
                    📎 {m.attachment.name}
                  </span>
                )}
                <div
                  className={`rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-base-panel2 text-text-primary"
                      : "border border-base-border bg-base-panel text-text-primary"
                  }`}
                >
                  {m.text}
                </div>
                {m.steps && (
                  <div className="w-full min-w-[16rem]">
                    <AgentPlan steps={m.steps} runId={m.runId} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-secure/40 bg-secure/10 text-secure">
                <Bot size={14} />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-base-border bg-base-panel px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:200ms]" />
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:400ms]" />
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-col gap-1.5 pt-2">
              <p className="font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
                TRY
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-fit rounded-md border border-base-border px-3 py-1.5 text-left text-xs text-text-secondary transition hover:border-wire hover:text-wire"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-base-border bg-base-bg p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex items-end gap-2 rounded-lg border border-base-border bg-base-panel p-2 focus-within:border-wire">
            <FileUploader
              file={file}
              onFileSelected={setFile}
              onClear={() => setFile(null)}
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Ask the workbench, or describe what to build from the attached file…"
              className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={busy || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber text-base-bg transition disabled:cursor-not-allowed disabled:bg-base-panel2 disabled:text-text-tertiary"
              aria-label="Send"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <p className="text-center font-mono text-[10px] text-text-tertiary">
            Runs entirely on-premise · GPU-NODE-01 · zero external requests
          </p>
        </div>
      </div>
    </div>
  );
}
