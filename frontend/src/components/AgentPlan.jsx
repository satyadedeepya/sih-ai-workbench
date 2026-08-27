import { useEffect, useState } from "react";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";

// Ticks through `steps` one at a time so the agent's plan->act->observe
// loop is visible, not just a spinner. Person 4: once
// backend/agent/planner.py can stream real step events (e.g. over
// server-sent events / a websocket), replace the setInterval below with
// updates from that stream — the `steps` + `activeIndex` contract can
// stay the same.
export default function AgentPlan({ steps, runId }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (!steps?.length) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i < steps.length ? i + 1 : i));
    }, 650);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, steps]);

  if (!steps?.length) return null;

  return (
    <div className="rounded-lg border border-base-border bg-base-panel2 p-3">
      <p className="mb-2 font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
        AGENT PLAN
      </p>
      <ol className="flex flex-col gap-1.5">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step} className="flex items-center gap-2 text-xs">
              {done && (
                <CheckCircle2 size={14} className="shrink-0 text-secure" />
              )}
              {active && (
                <LoaderCircle
                  size={14}
                  className="shrink-0 animate-spin text-amber"
                />
              )}
              {!done && !active && (
                <Circle size={14} className="shrink-0 text-text-tertiary" />
              )}
              <span
                className={
                  done
                    ? "text-text-secondary line-through decoration-base-border"
                    : active
                    ? "text-text-primary"
                    : "text-text-tertiary"
                }
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
