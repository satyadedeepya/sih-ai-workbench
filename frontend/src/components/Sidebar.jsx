import { useEffect, useState } from "react";
import { Plus, MessageSquare, Database, FileStack } from "lucide-react";
import { getKnowledgeBase } from "../api/client.js";

// TODO (Person 2): chat session list is hard-coded. Once
// GET /api/sessions exists, replace MOCK_SESSIONS with real data and
// wire onNewChat to POST /api/sessions.
const MOCK_SESSIONS = [
  { id: "s1", title: "Inspection report → approval note", active: true },
  { id: "s2", title: "CSV downtime analysis (Python)" },
  { id: "s3", title: "P&ID drawing review" },
];

export default function Sidebar({ collapsed }) {
  const [kb, setKb] = useState([]);

  useEffect(() => {
    getKnowledgeBase().then(setKb);
  }, []);

  if (collapsed) return null;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-base-border bg-base-panel">
      <div className="p-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-md border border-base-border bg-base-panel2 px-3 py-2 font-mono text-xs font-medium tracking-wide text-text-primary transition hover:border-wire hover:text-wire">
          <Plus size={14} /> NEW SESSION
        </button>
      </div>

      <div className="px-3 pb-1 pt-3">
        <p className="font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
          SESSIONS
        </p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {MOCK_SESSIONS.map((s) => (
          <button
            key={s.id}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
              s.active
                ? "bg-base-panel2 text-text-primary"
                : "text-text-secondary hover:bg-base-panel2 hover:text-text-primary"
            }`}
          >
            <MessageSquare size={14} className="shrink-0 text-text-tertiary" />
            <span className="truncate">{s.title}</span>
          </button>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-2 border-t border-base-border px-3 pb-1 pt-4">
        <Database size={12} className="text-text-tertiary" />
        <p className="font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
          LOCAL KNOWLEDGE BASE
        </p>
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        {kb.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-text-secondary"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileStack size={12} className="shrink-0 text-text-tertiary" />
              <span className="truncate">{doc.name}</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
              {doc.chunks}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-base-border p-3">
        <p className="font-mono text-[10px] leading-relaxed text-text-tertiary">
          MRPL // GPU-NODE-01
          <br />
          model weights local · no egress
        </p>
      </div>
    </aside>
  );
}
