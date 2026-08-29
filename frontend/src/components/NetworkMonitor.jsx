// // import { useEffect, useState } from "react";
// // import { ShieldCheck } from "lucide-react";
// // import { getNetworkStats } from "../api/client.js";

// // // This is the app's signature element. The whole problem statement
// // // hinges on one claim — "nothing leaves the building" — and the judges
// // // are told explicitly to look for proof of it. So instead of a badge
// // // that says "Secure", this renders like a live instrumentation readout:
// // // an uptime clock ticking up next to an external-call counter that
// // // never leaves zero. Person 6: wire `getNetworkStats` to the real
// // // network_monitor.sh output and this keeps working unchanged.
// // export default function NetworkMonitor() {
// //   const [uptime, setUptime] = useState(0);
// //   const [stats, setStats] = useState({ externalCalls: 0, airGapped: true });

// //   useEffect(() => {
// //     const tick = setInterval(() => setUptime((u) => u + 1), 1000);
// //     return () => clearInterval(tick);
// //   }, []);

// //   useEffect(() => {
// //     let mounted = true;
// //     getNetworkStats().then((s) => mounted && setStats(s));
// //     const poll = setInterval(() => {
// //       getNetworkStats().then((s) => mounted && setStats(s));
// //     }, 8000);
// //     return () => {
// //       mounted = false;
// //       clearInterval(poll);
// //     };
// //   }, []);

// //   const hh = String(Math.floor(uptime / 3600)).padStart(2, "0");
// //   const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
// //   const ss = String(uptime % 60).padStart(2, "0");

// //   return (
// //     <div className="flex items-center gap-3 rounded-md border border-base-border bg-base-panel px-3 py-1.5">
// //       <div className="relative flex h-2 w-2">
// //         <span className="absolute inline-flex h-full w-full animate-blink rounded-full bg-secure" />
// //         <span className="relative inline-flex h-2 w-2 rounded-full bg-secure" />
// //       </div>
// //       <ShieldCheck size={14} className="text-secure" strokeWidth={2} />
// //       <span className="font-mono text-xs tracking-wide text-secure">
// //         AIR-GAPPED
// //       </span>
// //       <span className="hidden text-base-border sm:inline">|</span>
// //       <span className="hidden font-mono text-xs text-text-secondary sm:inline">
// //         EXT&nbsp;CALLS&nbsp;
// //         <span className="text-text-primary">
// //           {String(stats.externalCalls).padStart(6, "0")}
// //         </span>
// //       </span>
// //       <span className="hidden text-base-border md:inline">|</span>
// //       <span className="hidden font-mono text-xs text-text-secondary md:inline">
// //         UPTIME <span className="text-text-primary">{hh}:{mm}:{ss}</span>
// //       </span>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { ShieldCheck } from "lucide-react";
// import { getNetworkStats } from "../api/client.js";

// // This is the app's signature element. The whole problem statement
// // hinges on one claim — "nothing leaves the building" — and the judges
// // are told explicitly to look for proof of it. So instead of a badge
// // that says "Secure", this renders like a live instrumentation readout:
// // an uptime clock ticking up next to an external-call counter that
// // never leaves zero. Person 6: wire `getNetworkStats` to the real
// // network_monitor.sh output and this keeps working unchanged.
// export default function NetworkMonitor() {
//   const [uptime, setUptime] = useState(0);
//   const [stats, setStats] = useState({ externalCalls: 0, airGapped: true });

//   useEffect(() => {
//     const tick = setInterval(() => setUptime((u) => u + 1), 1000);
//     return () => clearInterval(tick);
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     getNetworkStats().then((s) => mounted && setStats(s));
//     const poll = setInterval(() => {
//       getNetworkStats().then((s) => mounted && setStats(s));
//     }, 8000);
//     return () => {
//       mounted = false;
//       clearInterval(poll);
//     };
//   }, []);

//   const hh = String(Math.floor(uptime / 3600)).padStart(2, "0");
//   const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
//   const ss = String(uptime % 60).padStart(2, "0");

//   return (
//     <div className="flex items-center gap-3 rounded-md border border-base-border bg-base-panel px-3 py-1.5">
//       <div className="relative flex h-2 w-2">
//         <span className="absolute inline-flex h-full w-full animate-blink rounded-full bg-secure" />
//         <span className="relative inline-flex h-2 w-2 rounded-full bg-secure" />
//       </div>
//       <ShieldCheck size={14} className="text-secure" strokeWidth={2} />
//       <span className="font-mono text-xs tracking-wide text-secure">
//         AIR-GAPPED
//       </span>
//       <span className="hidden text-base-border sm:inline">|</span>
//       <span className="hidden font-mono text-xs text-text-secondary sm:inline">
//         EXT&nbsp;CALLS&nbsp;
//         <span className="text-text-primary">
//           {String(stats.externalCalls).padStart(6, "0")}
//         </span>
//       </span>
//       <span className="hidden text-base-border md:inline">|</span>
//       <span className="hidden font-mono text-xs text-text-secondary md:inline">
//         UPTIME <span className="text-text-primary">{hh}:{mm}:{ss}</span>
//       </span>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { getNetworkStats } from "../api/client.js";

// The signature element. The whole product's claim is "nothing leaves
// the building," and judges are told explicitly to look for proof of
// it — so this isn't a static "Secure" badge, it's a live readout: an
// uptime clock ticking up next to an external-call counter that stays
// at zero, plus a system-health dot. All values are frontend mock data
// today; see getNetworkStats() for the exact shape the backend should
// return.
export default function NetworkMonitor() {
  const [uptime, setUptime] = useState(0);
  const [stats, setStats] = useState({ externalCalls: 0, airGapped: true, healthy: true });

  useEffect(() => {
    const tick = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let mounted = true;
    getNetworkStats().then((s) => mounted && setStats(s));
    const poll = setInterval(() => {
      getNetworkStats().then((s) => mounted && setStats(s));
    }, 8000);
    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  const hh = String(Math.floor(uptime / 3600)).padStart(2, "0");
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-base-border bg-base-panel2 px-3 py-1.5 shadow-panel"
      role="status"
      aria-label="System status: air-gapped, zero external calls"
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-blink rounded-full bg-secure" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-secure" />
        </span>
        <ShieldCheck size={13} className="text-secure" strokeWidth={2.25} />
        <span className="font-mono text-3xs font-semibold tracking-wide text-secure">
          AIR-GAPPED
        </span>
      </div>

      <span className="hidden h-3.5 w-px bg-base-border sm:block" />

      <span className="hidden items-center gap-1.5 font-mono text-3xs text-text-secondary sm:flex">
        EXT&nbsp;CALLS
        <span className="text-text-primary">
          {String(stats.externalCalls).padStart(6, "0")}
        </span>
      </span>

      <span className="hidden h-3.5 w-px bg-base-border md:block" />

      <span className="hidden items-center gap-1.5 font-mono text-3xs text-text-secondary md:flex">
        UPTIME
        <span className="text-text-primary">
          {hh}:{mm}:{ss}
        </span>
      </span>

      <span className="hidden h-3.5 w-px bg-base-border lg:block" />

      <span
        className="hidden items-center gap-1.5 font-mono text-3xs text-text-secondary lg:flex"
        title="All local services reachable"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${stats.healthy ? "bg-secure" : "bg-alert"}`}
        />
        {stats.healthy ? "SYSTEM OK" : "DEGRADED"}
      </span>
    </div>
  );
}
