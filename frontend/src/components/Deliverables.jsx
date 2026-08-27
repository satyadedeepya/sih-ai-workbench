import { FileType2, Download, PackageOpen } from "lucide-react";

const KIND_LABEL = {
  docx: "Word",
  xlsx: "Excel",
  pptx: "PowerPoint",
  code: "Code",
};

// The problem statement is explicit that the system must produce "real
// deliverables", not just chat replies. This panel is where those
// files surface. TODO (Person 2): each deliverable should carry a
// real download URL from the backend (e.g. GET /api/files/{id}) —
// swap the disabled mock button for an <a href={url} download>.
export default function Deliverables({ items }) {
  return (
    <div className="rounded-lg border border-base-border bg-base-panel p-3">
      <p className="mb-2 font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
        DELIVERABLES
      </p>

      {(!items || items.length === 0) && (
        <div className="flex flex-col items-center gap-1.5 rounded-md border border-dashed border-base-border py-6 text-center">
          <PackageOpen size={16} className="text-text-tertiary" />
          <p className="max-w-[14rem] text-[11px] text-text-tertiary">
            Generated files appear here once the agent finishes a task.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {items?.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 rounded-md border border-base-border bg-base-panel2 px-2.5 py-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileType2 size={14} className="shrink-0 text-secure" />
              <span className="min-w-0">
                <span className="block truncate text-xs text-text-primary">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {KIND_LABEL[item.kind] ?? item.kind}
                </span>
              </span>
            </span>
            <button
              type="button"
              className="shrink-0 text-text-tertiary transition hover:text-wire"
              title="Download (wire to GET /api/files/{id})"
            >
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
