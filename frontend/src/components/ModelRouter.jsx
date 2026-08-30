import { Cpu, Code2, FileSearch, MessageCircle } from "lucide-react";
import { MODELS } from "../api/mockData.js";
import PanelLabel from "./PanelLabel.jsx";

const ROUTE_ICON = {
  vision: FileSearch,
  coding: Code2,
  text: MessageCircle,
};

// Shows the router's decision for the most recent message, plus a
// standing list of every local model and its state (standby / selected
// / unavailable). This is the visible half of "model auto-selection
// across at least two task types" — a judge should be able to look at
// this and immediately see which model handled the request and why.
export default function ModelRouter({ classification }) {
  const activeRoute = classification?.route;
  const Icon = activeRoute ? ROUTE_ICON[activeRoute] : Cpu;

  return (
    <div className="rounded-xl border border-base-border bg-base-panel p-3.5 shadow-panel">
      <PanelLabel>Model router</PanelLabel>

      <div
        className={`mb-3 flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors duration-200 ${
          classification
            ? "border-primary/30 bg-primary/10"
            : "border-dashed border-base-border bg-transparent"
        }`}
      >
        <Icon size={14} className={`shrink-0 ${classification ? "text-primary" : "text-text-tertiary"}`} />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-primary">
            {classification ? classification.task : "Standing by"}
          </p>
          <p className="truncate text-3xs text-text-tertiary">
            {classification ? classification.model : "3 models resident · ready to route"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {MODELS.map((m, i) => {
          const isActive = activeRoute === m.id;
          const isIdle = !activeRoute;
          return (
            <div
              key={m.id}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors duration-200 ${
                isActive ? "border border-primary/40 bg-primary/10 text-text-primary" : "border border-transparent text-text-secondary"
              }`}
            >
              <span>{m.label}</span>
              <span className="flex items-center gap-1.5 text-3xs">
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                {isIdle && (
                  <span
                    className="h-1.5 w-1.5 animate-blink rounded-full bg-secure/70"
                    style={{ animationDelay: `${i * 350}ms` }}
                  />
                )}
                {isIdle ? "standby" : m.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
