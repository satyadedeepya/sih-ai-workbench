import { useRef } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import FileUploader from "./FileUploader.jsx";

// Sticky bottom composer. Owns its own textarea auto-grow and the
// Enter-to-send / Shift+Enter-for-newline behavior; everything else
// (message list, send handling) stays in Chat.jsx.
export default function Composer({
  input,
  onInputChange,
  onSend,
  busy,
  file,
  fileStatus,
  fileError,
  onFileSelected,
  onFileClear,
}) {
  const taRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function autoGrow(e) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  const canSend = !busy && input.trim().length > 0 && !fileError;

  return (
    <div className="border-t border-base-border bg-base-bg p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className="flex items-end gap-2 rounded-xl border border-base-border bg-base-panel p-2 shadow-panel transition-colors duration-150 focus-within:border-wire/60">
          <FileUploader
            file={file}
            status={fileStatus}
            error={fileError}
            onFileSelected={onFileSelected}
            onClear={onFileClear}
          />
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value);
              autoGrow(e);
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask the workbench, or describe what to build from the attached file…"
            aria-label="Message"
            className="max-h-40 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber text-base-bg transition-colors duration-150 hover:bg-amber/90 disabled:cursor-not-allowed disabled:bg-base-panel2 disabled:text-text-disabled"
            aria-label="Send message"
          >
            {busy ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
        <p className="flex items-center justify-center gap-1 text-center font-mono text-3xs text-text-tertiary">
          <kbd className="rounded border border-base-border px-1 py-0.5">Enter</kbd>
          to send
          <span className="mx-1 text-base-border">·</span>
          <kbd className="rounded border border-base-border px-1 py-0.5">Shift+Enter</kbd>
          for newline
          <span className="mx-1 text-base-border">·</span>
          Runs entirely on-premise, zero external requests
        </p>
      </div>
    </div>
  );
}
