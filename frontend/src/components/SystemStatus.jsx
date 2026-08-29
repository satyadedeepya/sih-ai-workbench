import { useEffect, useState } from "react";
import { Cpu, HardDrive } from "lucide-react";
import { getSystemStatus } from "../api/client.js";
import PanelLabel from "./PanelLabel.jsx";

// GPU/system facts card. `vramPct` drifts slightly on a client timer
// purely for visual liveliness — it is NOT a real hardware reading.
// TODO (Person 6): wire this to real nvidia-smi/DCGM output via
// getSystemStatus() once a polling endpoint exists; everything else
// here is presentational.
export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [vram, setVram] = useState(null);

  useEffect(() => {
    let mounted = true;
    getSystemStatus().then((s) => {
      if (!mounted) return;
      setStatus(s);
      setVram(s.vramPct);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (vram === null) return;
    const id = setInterval(() => {
      setVram((v) => Math.min(78, Math.max(52, v + (Math.random() * 4 - 2))));
    }, 2400);
    return () => clearInterval(id);
  }, [vram === null]);

  return (
    <div className="rounded-xl border border-base-border bg-base-panel p-3.5 shadow-panel">
      <PanelLabel>SYSTEM</PanelLabel>

      {!status ? (
        <div className="flex flex-col gap-2">
          <div className="h-5 animate-pulse rounded bg-base-panel2" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-base-panel2" />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <Cpu size={14} className="shrink-0 text-text-tertiary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{status.gpuNode}</span>
                <span className="font-mono text-3xs text-text-tertiary">
                  {vram.toFixed(0)}% VRAM
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-base-panel2">
                <div
                  className="h-full rounded-full bg-wire transition-all duration-1000 ease-out"
                  style={{ width: `${vram}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <HardDrive size={14} className="shrink-0 text-text-tertiary" />
            <span className="text-xs text-text-secondary">
              {status.modelsResident}/{status.modelsTotal} models resident
              <span className="ml-1.5 font-mono text-3xs text-text-tertiary">
                · weights on local disk
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
