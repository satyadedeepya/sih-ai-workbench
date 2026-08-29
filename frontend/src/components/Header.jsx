import { PanelLeftClose, PanelLeftOpen, Gauge } from "lucide-react";
import NetworkMonitor from "./NetworkMonitor.jsx";

// The application's top bar. Deliberately restrained: one wordmark, one
// status cluster (NetworkMonitor), one sidebar toggle. Everything here
// is a structural landmark a returning user should be able to find
// without looking — nothing here should change position or size.
export default function Header({ collapsed, onToggleSidebar }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-base-border bg-base-panel px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-1 text-text-secondary transition-colors duration-150 hover:bg-base-panel2 hover:text-text-primary"
          aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-amber/15 text-amber">
            <Gauge size={16} strokeWidth={2.25} />
            <span className="pointer-events-none absolute inset-x-0 h-px animate-scan bg-amber/60" />
          </div>
          <div className="leading-tight">
            <h1 className="font-mono text-sm font-semibold tracking-wide text-text-primary">
              MRPL <span className="text-text-tertiary">//</span> SOVEREIGN WORKBENCH
            </h1>
            <p className="font-mono text-3xs text-text-tertiary">
              On-premise agentic AI &middot; SIH 26117
            </p>
          </div>
        </div>
      </div>

      <NetworkMonitor />
    </header>
  );
}
