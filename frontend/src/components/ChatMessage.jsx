import { useState } from "react";
import { Bot, User, Copy, Check, AlertTriangle, RotateCcw } from "lucide-react";
import AgentStatus from "./AgentStatus.jsx";

// Splits on fenced ```code``` blocks so responses can show a real,
// copyable code block without pulling in a full markdown dependency —
// the vast majority of what "markdown rendering" needs to mean here is
// "don't dump raw triple-backticks at the user."
function parseSegments(text) {
  const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
  const segments = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) segments.push({ type: "text", content: parts[i] });
    if (parts[i + 2] !== undefined) {
      segments.push({ type: "code", lang: parts[i + 1], content: parts[i + 2].replace(/\n$/, "") });
    }
  }
  return segments;
}

function CodeBlock({ lang, content }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-base-border bg-base-bg">
      <div className="flex items-center justify-between border-b border-base-border px-3 py-1.5">
        <span className="font-mono text-3xs text-text-tertiary">{lang || "text"}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-3xs text-text-tertiary transition-colors duration-150 hover:bg-base-panel2 hover:text-text-primary"
        >
          {copied ? <Check size={11} className="text-secure" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-2xs leading-relaxed text-text-primary">
        {content}
      </pre>
    </div>
  );
}

export default function ChatMessage({ message, onRetry }) {
  const isUser = message.role === "user";
  const segments = !isUser ? parseSegments(message.text) : null;

  return (
    <div className={`flex animate-fade-up gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
          isUser
            ? "border-info/40 bg-info/10 text-info"
            : "border-secure/40 bg-secure/10 text-secure"
        }`}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {message.attachment && (
          <span className="rounded-md border border-base-border bg-base-panel px-2 py-1 font-mono text-3xs text-text-secondary">
            📎 {message.attachment.name}
          </span>
        )}

        {message.error ? (
          <div className="flex items-center gap-2 rounded-lg border border-alert/40 bg-alert/10 px-3.5 py-2.5 text-sm text-alert">
            <AlertTriangle size={14} className="shrink-0" />
            <span className="flex-1">Something went wrong. The request didn't complete.</span>
            <button
              type="button"
              onClick={onRetry}
              className="flex shrink-0 items-center gap-1 rounded-md border border-alert/40 px-2 py-1 text-3xs font-medium transition-colors duration-150 hover:bg-alert/20"
            >
              <RotateCcw size={11} /> Retry
            </button>
          </div>
        ) : (
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "bg-base-panel3 text-text-primary"
                : "border border-base-border bg-base-panel text-text-primary shadow-panel"
            }`}
          >
            {isUser
              ? message.text
              : segments.map((seg, i) =>
                  seg.type === "code" ? (
                    <CodeBlock key={i} lang={seg.lang} content={seg.content} />
                  ) : (
                    <p key={i} className="whitespace-pre-wrap first:mt-0 last:mb-0">
                      {seg.content.trim()}
                    </p>
                  )
                )}
          </div>
        )}

        {message.steps && <div className="w-full min-w-[16rem]"><AgentStatus steps={message.steps} runId={message.runId} /></div>}

        <span className="px-1 text-3xs text-text-tertiary">{message.time}</span>
      </div>
    </div>
  );
}

