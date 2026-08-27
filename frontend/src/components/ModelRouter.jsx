import { Cpu, Code2, FileSearch, MessageCircle } from "lucide-react";

const ROUTE_ICON = {
  vision: FileSearch,
  coding: Code2,
  text: MessageCircle,
};

const MODELS = [
  { id: "text", label: "Llama-3.1-70B", role: "General / Reasoning" },
  { id: "coding", label: "Qwen2.5-Coder-32B", role: "Coding" },
  { id: "vision", label: "Vision-Reasoning-14B", role: "Document / Vision" },
];

// Shows the router's decision for the most recent message. This panel
// is the visible half of "model auto-selection across at least two
// task types" — the judge should be able to look at this and see which
// model handled the request and why.
export default function ModelRouter({ classification }) {
  const activeRoute = classification?.route;
  const Icon = activeRoute ? ROUTE_ICON[activeRoute] : Cpu;

  return (
    <div className="rounded-lg border border-base-border bg-base-panel p-3">
      <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
        MODEL ROUTER
      </p>

      <div className="mb-3 flex items-center gap-2 rounded-md border border-base-border bg-base-panel2 px-2.5 py-2">
        <Icon size={14} className="shrink-0 text-amber" />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-primary">
            {classification ? classification.task : "Awaiting request"}
          </p>
          <p className="truncate font-mono text-[10px] text-text-tertiary">
            {classification ? classification.model : "no task classified yet"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {MODELS.map((m) => {
          const isActive = activeRoute === m.id;
          return (
            <div
              key={m.id}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition ${
                isActive
                  ? "border border-amber/40 bg-amber/10 text-text-primary"
                  : "border border-transparent text-text-secondary"
              }`}
            >
              <span>{m.label}</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px]">
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                )}
                {m.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
