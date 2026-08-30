import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, LoaderCircle, XCircle, RotateCcw } from "lucide-react";
import PanelLabel from "./PanelLabel.jsx";

// Steps through `steps` (each { label, seconds }) one at a time so the
// agent's plan → act → observe loop is visible as a real execution
// timeline, not a spinner. Completed steps show their elapsed time and
// go calm/muted; the running step gets a subtle spin; pending steps
// stay quiet. The "failed" visual state (icon + Retry button) is fully
// styled below but never triggered by mock data on purpose — a demo
// shouldn't self-sabotage. It's exercised once real step events exist.
//
// Person 4 (agent backend): once backend/agent/planner.py can stream
// real step events (SSE or a websocket), replace the internal timer
// with updates from that stream — feed it { label, status, elapsedMs }
// per step and this component's rendering stays the same.
export default function AgentStatus({ steps, runId }) {
  const [stepStates, setStepStates] = useState([]); // 'pending' | 'running' | 'completed' | 'failed'
  const [elapsed, setElapsed] = useState({});
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!steps?.length) return;

    setStepStates(steps.map(() => "pending"));
    setElapsed({});

    let cursor = 0;
    steps.forEach((step, i) => {
      const startAt = cursor;
      const duration = Math.max(300, step.seconds * 260); // compressed for demo pacing
      cursor += duration;

      timers.current.push(
        setTimeout(() => {
          setStepStates((prev) => {
            const next = [...prev];
            next[i] = "running";
            return next;
          });
        }, startAt)
      );

      timers.current.push(
        setTimeout(() => {
          setStepStates((prev) => {
            const next = [...prev];
            next[i] = "completed";
            return next;
          });
          setElapsed((prev) => ({ ...prev, [i]: step.seconds }));
        }, startAt + duration)
      );
    });

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, steps]);

  if (!steps?.length) return null;

  return (
    <div className="rounded-xl border border-base-border bg-base-panel2 p-3.5 shadow-panel">
      <PanelLabel>Agent activity</PanelLabel>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const state = stepStates[i] ?? "pending";
          return (
            <li key={step.label} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">
                {state === "completed" && (
                  <CheckCircle2 size={15} className="text-secure" />
                )}
                {state === "running" && (
                  <LoaderCircle size={15} className="animate-spin text-primary" />
                )}
                {state === "failed" && <XCircle size={15} className="text-alert" />}
                {state === "pending" && (
                  <Circle size={15} className="text-text-disabled" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-xs leading-snug ${
                    state === "completed"
                      ? "text-text-secondary"
                      : state === "pending"
                      ? "text-text-tertiary"
                      : state === "failed"
                      ? "text-alert"
                      : "text-text-primary"
                  }`}
                >
                  {step.label}
                </span>
                <span className="font-mono text-3xs text-text-tertiary">
                  {state === "completed" && `Completed · ${elapsed[i]?.toFixed(1)}s`}
                  {state === "running" && "Running…"}
                  {state === "failed" && "Failed — see below"}
                </span>
              </span>
              {state === "failed" && (
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1 rounded-md border border-alert/40 bg-alert/10 px-2 py-1 text-3xs font-medium text-alert transition-colors duration-150 hover:bg-alert/20"
                >
                  <RotateCcw size={11} /> Retry
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
