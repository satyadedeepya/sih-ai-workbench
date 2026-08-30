import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import Composer from "./Composer.jsx";
import HeroEmptyState from "./HeroEmptyState.jsx";
import { sendMessage, classifyTask } from "../api/client.js";
import { PROCESSING_LABELS } from "../api/mockData.js";

let runCounter = 0;

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Center pane: message history + composer + (when there's no history
// yet) the hero empty state. `onRun` bubbles the latest classification
// / steps / deliverables up to App so the right-hand panels can react.
export default function Chat({ onRun }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState("ready");
  const [fileError, setFileError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("Working…");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function handleFileSelected(f, err) {
    setFile(f);
    setFileError(err);
    if (err) {
      setFileStatus("error");
      return;
    }
    setFileStatus("processing");
    setTimeout(() => setFileStatus("ready"), 900);
  }

  function handleFileClear() {
    setFile(null);
    setFileError(null);
    setFileStatus("ready");
  }

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || busy || fileError) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      attachment: file ? { name: file.name } : null,
      time: timeNow(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const attachedFile = file;
    handleFileClear();
    setBusy(true);

    const classification = classifyTask({ text, hasAttachment: !!attachedFile });
    const labels = PROCESSING_LABELS[classification.route] ?? ["Working…"];
    let labelIndex = 0;
    setProcessingLabel(labels[0]);
    const labelTimer = setInterval(() => {
      labelIndex = (labelIndex + 1) % labels.length;
      setProcessingLabel(labels[labelIndex]);
    }, 900);

    try {
      const result = await sendMessage({ text, attachment: attachedFile });
      const runId = `run-${runCounter++}`;
      onRun?.({ ...result, runId });

      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: result.reply,
        steps: result.steps,
        runId,
        time: timeNow(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: "assistant", error: true, retryText: text, time: timeNow() },
      ]);
    } finally {
      clearInterval(labelTimer);
      setBusy(false);
    }
  }

  const isEmpty = messages.length === 0 && !busy;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {isEmpty ? (
        <HeroEmptyState onSelectTask={(prompt) => handleSend(prompt)} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onRetry={() => handleSend(m.retryText)} />
            ))}

            {busy && (
              <div className="flex animate-fade-in gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-secure/40 bg-secure/10 text-secure">
                  <Bot size={14} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-base-border bg-base-panel px-3.5 py-2.5 shadow-panel">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:200ms]" />
                    <span className="h-1.5 w-1.5 animate-blink rounded-full bg-text-tertiary [animation-delay:400ms]" />
                  </span>
                  <span className="text-xs text-text-secondary">{processingLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Composer
        input={input}
        onInputChange={setInput}
        onSend={() => handleSend()}
        busy={busy}
        file={file}
        fileStatus={fileStatus}
        fileError={fileError}
        onFileSelected={handleFileSelected}
        onFileClear={handleFileClear}
      />
    </div>
  );
}

