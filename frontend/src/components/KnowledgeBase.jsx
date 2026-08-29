import { useEffect, useState } from "react";
import { Database, FileStack } from "lucide-react";
import { getKnowledgeBase } from "../api/client.js";
import PanelLabel from "./PanelLabel.jsx";

// Local knowledge-base document list. Kept as its own component (per
// the suggested structure) since it owns its own fetch and empty state,
// separate from session management in Sidebar.jsx.
export default function KnowledgeBase() {
  const [docs, setDocs] = useState(null); // null = loading

  useEffect(() => {
    let mounted = true;
    getKnowledgeBase().then((d) => mounted && setDocs(d));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="px-1">
        <PanelLabel icon={Database}>LOCAL KNOWLEDGE BASE</PanelLabel>
      </div>

      {docs === null && (
        <div className="flex flex-col gap-1 px-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-7 animate-pulse rounded-md bg-base-panel2"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}

      {docs?.length === 0 && (
        <p className="px-2 py-2 text-2xs text-text-tertiary">
          No documents indexed
        </p>
      )}

      <div className="flex flex-col gap-0.5 overflow-y-auto">
        {docs?.map((doc) => (
          <button
            key={doc.name}
            className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-base-panel2"
            title={`${doc.name} · ${doc.chunks} chunks · ${doc.size}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileStack
                size={12}
                className="shrink-0 text-text-tertiary group-hover:text-wire"
              />
              <span className="truncate text-2xs text-text-secondary group-hover:text-text-primary">
                {doc.name}
              </span>
            </span>
            <span className="shrink-0 font-mono text-3xs text-text-tertiary">
              {doc.chunks}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
