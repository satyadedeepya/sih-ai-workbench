import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import { AMBIENT_LOG_LINES, RUN_LOG_LINES } from "../api/mockData.js";
import PanelLabel from "./PanelLabel.jsx";

const LEVEL_COLOR = {
  SUCCESS: "text-secure",
  INFO: "text-info",
  WARNING: "text-warn",
  ERROR: "text-alert",
};

let seq = 0;
function makeLine(level, text) {
  seq += 1;
  return { id: seq, level, text, time: new Date().toTimeString().slice(0, 8) };
}

// Continuously-scrolling activity feed. Structured so real backend
// logs can replace the mock arrays in api/mockData.js without touching
// this component — it only expects { level, text } objects, and
// `level` is one of INFO / SUCCESS / WARNING / ERROR.
export default function SystemLog({ lastRun }) {
  const [lines, setLines] = useState(() => [
    makeLine("SUCCESS", "workbench initialized, all models local"),
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      const pick = AMBIENT_LOG_LINES[Math.floor(Math.random() * AMBIENT_LOG_LINES.length)];
      setLines((prev) => [...prev.slice(-39), makeLine(pick.level, pick.text)]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!lastRun?.runId) return;
    const route = lastRun.classification?.route ?? "text";
    const burst = RUN_LOG_LINES[route] ?? [];
    const timeouts = burst.map((l, i) =>
      setTimeout(() => {
        setLines((prev) => [...prev.slice(-39), makeLine(l.level, l.text)]);
      }, i * 550)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [lastRun?.runId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-base-border bg-base-panel p-3.5 shadow-panel">
      <PanelLabel
        icon={Activity}
        right={<span className="h-1.5 w-1.5 animate-blink rounded-full bg-secure" />}
      >
        Activity log
      </PanelLabel>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-0.5 overflow-y-auto font-mono text-3xs leading-relaxed"
      >
        {lines.map((l) => (
          <div key={l.id} className="flex gap-2">
            <span className="shrink-0 text-text-disabled">{l.time}</span>
            <span className={`shrink-0 font-medium ${LEVEL_COLOR[l.level]}`}>{l.level}</span>
            <span className="min-w-0 truncate text-text-secondary">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
