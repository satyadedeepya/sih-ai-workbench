import { useCallback, useRef, useState } from "react";
import { Paperclip, FileText, X, UploadCloud, AlertTriangle, CheckCircle2 } from "lucide-react";

const ACCEPTED = {
  ".pdf": "PDF",
  ".docx": "DOCX",
  ".xlsx": "XLSX",
  ".png": "PNG",
  ".jpg": "JPG",
  ".jpeg": "JPEG",
};
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB — demo-reasonable ceiling

function extOf(name) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Compact "attach" control that expands into a highlighted drop target
// on drag-over, and into a rich preview card once a file is selected.
// UI-only: no bytes are actually sent anywhere. TODO (Person 2): wire
// onFileSelected's accepted files to POST /api/upload and swap the
// mock "processing → ready" timer for the real response.
export default function FileUploader({ file, status, error, onFileSelected, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const [dragError, setDragError] = useState(false);
  const inputRef = useRef(null);

  const validate = useCallback((f) => {
    const ext = extOf(f.name);
    if (!ACCEPTED[ext]) {
      return `Unsupported file type (${ext || "unknown"}). Accepted: ${Object.values(ACCEPTED).join(", ")}.`;
    }
    if (f.size > MAX_BYTES) {
      return `File is too large (${formatBytes(f.size)}). Limit is ${formatBytes(MAX_BYTES)}.`;
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    (files) => {
      const f = files?.[0];
      if (!f) return;
      const err = validate(f);
      onFileSelected(f, err);
    },
    [onFileSelected, validate]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
        const f = e.dataTransfer.items?.[0];
        setDragError(f && f.kind === "file" ? false : false);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {!file && !dragOver && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-base-border px-2.5 py-2 text-2xs text-text-secondary transition-colors duration-150 hover:border-borderHi hover:bg-base-panel2 hover:text-text-primary"
          title="Attach a scanned PDF, image, drawing, or spreadsheet"
        >
          <Paperclip size={14} />
          <span className="hidden sm:inline">Attach file</span>
        </button>
      )}

      {!file && dragOver && (
        <div
          className={`flex items-center gap-1.5 rounded-lg border-2 border-dashed px-2.5 py-2 text-2xs transition-colors duration-150 ${
            dragError
              ? "border-alert bg-alert/10 text-alert"
              : "border-info bg-info/10 text-info"
          }`}
        >
          <UploadCloud size={14} />
          <span>Drop to attach</span>
        </div>
      )}

      {file && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-2xs ${
            error
              ? "border-alert/40 bg-alert/10"
              : "border-info/40 bg-info/10"
          }`}
        >
          {error ? (
            <AlertTriangle size={14} className="shrink-0 text-alert" />
          ) : status === "ready" ? (
            <CheckCircle2 size={14} className="shrink-0 text-secure" />
          ) : (
            <FileText size={14} className="shrink-0 text-info" />
          )}
          <div className="min-w-0 leading-tight">
            <p className="max-w-[11rem] truncate text-text-primary">{file.name}</p>
            <p className={`truncate font-mono text-3xs ${error ? "text-alert" : "text-text-tertiary"}`}>
              {error
                ? error
                : `${(extOf(file.name).slice(1) || "FILE").toUpperCase()} · ${formatBytes(file.size)} · ${
                    status === "ready" ? "Ready for analysis" : "Processing…"
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="ml-1 shrink-0 rounded p-0.5 text-text-tertiary transition-colors duration-150 hover:text-alert"
            aria-label="Remove attachment"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        aria-label="Attach a file"
        accept={Object.keys(ACCEPTED).join(",")}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
