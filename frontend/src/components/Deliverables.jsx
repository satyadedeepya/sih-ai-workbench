import { FileType2, Download, PackageOpen, LoaderCircle, AlertTriangle } from "lucide-react";
import PanelLabel from "./PanelLabel.jsx";

const KIND_LABEL = { docx: "Word", xlsx: "Excel", pptx: "PowerPoint", code: "Code" };

// Real, generated deliverables — the problem statement is explicit
// that the system must produce actual files, not just chat replies.
// TODO (Person 2): each deliverable should carry a real download URL
// from the backend (GET /api/files/{id}) — swap the disabled button
// for <a href={url} download>. `status` on an item ('generating' |
// 'ready' | 'failed') is supported below for when the backend streams
// deliverable progress.
export default function Deliverables({ items }) {
  return (
    <div className="rounded-xl border border-base-border bg-base-panel p-3.5 shadow-panel">
      <PanelLabel>Deliverables</PanelLabel>

      {(!items || items.length === 0) && (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-base-border py-6 text-center">
          <PackageOpen size={16} className="text-text-tertiary" />
          <p className="text-2xs font-medium text-text-secondary">No deliverables yet</p>
          <p className="max-w-[13rem] text-3xs leading-relaxed text-text-tertiary">
            Generated documents, spreadsheets and presentations will appear
            here once the agent finishes a task.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {items?.map((item) => {
          const status = item.status ?? "ready";
          return (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 rounded-lg border border-base-border bg-base-panel2 px-2.5 py-2 transition-colors duration-150 hover:border-borderHi"
            >
              <span className="flex min-w-0 items-center gap-2">
                {status === "generating" && (
                  <LoaderCircle size={14} className="shrink-0 animate-spin text-primary" />
                )}
                {status === "failed" && <AlertTriangle size={14} className="shrink-0 text-alert" />}
                {status === "ready" && <FileType2 size={14} className="shrink-0 text-secure" />}
                <span className="min-w-0">
                  <span className="block truncate text-xs text-text-primary">{item.name}</span>
                  <span className="font-mono text-3xs text-text-tertiary">
                    {KIND_LABEL[item.kind] ?? item.kind}
                    {item.size ? ` · ${item.size}` : ""}
                    {status === "generating" ? " · generating…" : ""}
                    {status === "failed" ? " · failed" : ""}
                  </span>
                </span>
              </span>
              {status === "ready" && (
                <button
                  type="button"
                  className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors duration-150 hover:bg-base-panel3 hover:text-info"
                  title="Download (wire to GET /api/files/{id})"
                  aria-label={`Download ${item.name}`}
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
