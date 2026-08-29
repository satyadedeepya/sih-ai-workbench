// // // import React from 'react';
// // // import Chat from './components/Chat';
// // // import FileUploader from './components/FileUploader';

// // // /**
// // //  * PERSON 1: FRONTEND & UI DEVELOPER
// // //  * 
// // //  * TODOs for App.jsx:
// // //  * 1. Build a modern layout that feels like an "AI Workbench" (not just a chat app).
// // //  * 2. It should have a sidebar for active files/documents, and a main area for chat/agent execution.
// // //  * 3. Include a "Model Selection" indicator to show which model is currently active (e.g. "Coding Model", "Vision Model").
// // //  * 4. Display a network activity indicator proving that no external connections are being made.
// // //  */
// // // function App() {
// // //   return (
// // //     <div className="flex h-screen bg-gray-900 text-white">
// // //       {/* Sidebar for files and Agent status */}
// // //       <aside className="w-1/4 p-4 border-r border-gray-700">
// // //         <h1 className="text-xl font-bold mb-4">Sovereign AI Workbench</h1>
        
// // //         {/* Person 1: Implement File uploader UI here */}
// // //         <FileUploader />
        
// // //         <div className="mt-8">
// // //           <h2 className="text-lg font-semibold">Agent Status</h2>
// // //           {/* Person 1: Render agent steps here (e.g. "Reading PDF...", "Generating Word Doc...") */}
// // //         </div>
// // //       </aside>

// // //       {/* Main Chat Interface */}
// // //       <main className="flex-1 p-4">
// // //         {/* Person 1: Implement the main chat interface here */}
// // //         <Chat />
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // export default App;


// // import { useState } from "react";
// // import { PanelLeftClose, PanelLeftOpen, Gauge } from "lucide-react";
// // import Sidebar from "./components/Sidebar.jsx";
// // import Chat from "./components/Chat.jsx";
// // import ModelRouter from "./components/ModelRouter.jsx";
// // import Deliverables from "./components/Deliverables.jsx";
// // import NetworkMonitor from "./components/NetworkMonitor.jsx";

// // export default function App() {
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [lastRun, setLastRun] = useState(null); // { classification, deliverables, runId }

// //   return (
// //     <div className="relative flex h-screen w-screen overflow-hidden bg-base-bg">
// //       {/* faint blueprint grid — the one deliberate "material" reference
// //           to the subject: engineering drawings / P&IDs */}
// //       <div className="pointer-events-none absolute inset-0 bg-blueprint bg-grid opacity-40" />

// //       <div className="relative z-10 flex h-full w-full flex-col">
// //         {/* ---- Top status bar ------------------------------------- */}
// //         <header className="flex h-14 shrink-0 items-center justify-between border-b border-base-border bg-base-panel px-4">
// //           <div className="flex items-center gap-3">
// //             <button
// //               onClick={() => setCollapsed((c) => !c)}
// //               className="text-text-secondary transition hover:text-text-primary"
// //               aria-label="Toggle sidebar"
// //             >
// //               {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
// //             </button>
// //             <div className="flex items-center gap-2">
// //               <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber/15 text-amber">
// //                 <Gauge size={16} />
// //               </div>
// //               <div className="leading-tight">
// //                 <p className="font-mono text-sm font-semibold tracking-wide text-text-primary">
// //                   MRPL <span className="text-text-tertiary">//</span> SOVEREIGN WORKBENCH
// //                 </p>
// //                 <p className="font-mono text-[10px] text-text-tertiary">
// //                   On-premise agentic AI · SIH 26117
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <NetworkMonitor />
// //         </header>

// //         {/* ---- Body ------------------------------------------------ */}
// //         <div className="flex min-h-0 flex-1">
// //           <Sidebar collapsed={collapsed} />

// //           <Chat onRun={setLastRun} />

// //           <aside className="hidden w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-base-border bg-base-bg p-3 lg:flex">
// //             <ModelRouter classification={lastRun?.classification} />
// //             <Deliverables items={lastRun?.deliverables} />
// //           </aside>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { PanelLeftClose, PanelLeftOpen, Gauge } from "lucide-react";
// import Sidebar from "./components/Sidebar.jsx";
// import Chat from "./components/Chat.jsx";
// import ModelRouter from "./components/ModelRouter.jsx";
// import Deliverables from "./components/Deliverables.jsx";
// import NetworkMonitor from "./components/NetworkMonitor.jsx";
// import SystemTelemetry from "./components/SystemTelemetry.jsx";
// import SystemLog from "./components/SystemLog.jsx";

// export default function App() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [lastRun, setLastRun] = useState(null); // { classification, deliverables, runId }

//   return (
//     <div className="relative flex h-screen w-screen overflow-hidden bg-base-bg">
//       {/* faint blueprint grid — the one deliberate "material" reference
//           to the subject: engineering drawings / P&IDs */}
//       <div className="pointer-events-none absolute inset-0 bg-blueprint bg-grid opacity-40" />

//       <div className="relative z-10 flex h-full w-full flex-col">
//         {/* ---- Top status bar ------------------------------------- */}
//         <header className="flex h-14 shrink-0 items-center justify-between border-b border-base-border bg-base-panel px-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setCollapsed((c) => !c)}
//               className="text-text-secondary transition hover:text-text-primary"
//               aria-label="Toggle sidebar"
//             >
//               {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
//             </button>
//             <div className="flex items-center gap-2">
//               <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber/15 text-amber">
//                 <Gauge size={16} />
//               </div>
//               <div className="leading-tight">
//                 <p className="font-mono text-sm font-semibold tracking-wide text-text-primary">
//                   MRPL <span className="text-text-tertiary">//</span> SOVEREIGN WORKBENCH
//                 </p>
//                 <p className="font-mono text-[10px] text-text-tertiary">
//                   On-premise agentic AI · SIH 26117
//                 </p>
//               </div>
//             </div>
//           </div>

//           <NetworkMonitor />
//         </header>

//         {/* ---- Body ------------------------------------------------ */}
//         <div className="flex min-h-0 flex-1">
//           <Sidebar collapsed={collapsed} />

//           <Chat onRun={setLastRun} />

//           <aside className="hidden w-80 shrink-0 flex-col gap-3 border-l border-base-border bg-base-bg p-3 lg:flex">
//             <div className="flex shrink-0 flex-col gap-3 overflow-y-auto">
//               <ModelRouter classification={lastRun?.classification} />
//               <SystemTelemetry />
//               <Deliverables items={lastRun?.deliverables} />
//             </div>
//             <SystemLog lastRun={lastRun} />
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Chat from "./components/Chat.jsx";
import ModelRouter from "./components/ModelRouter.jsx";
import Deliverables from "./components/Deliverables.jsx";
import SystemStatus from "./components/SystemStatus.jsx";
import SystemLog from "./components/SystemLog.jsx";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [lastRun, setLastRun] = useState(null); // { classification, steps, deliverables, runId }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-base-bg">
      {/* faint blueprint grid — the one deliberate "material" reference to
          the subject (engineering drawings / P&IDs), kept subtle so it
          reads as texture, not decoration */}
      <div className="pointer-events-none absolute inset-0 bg-blueprint bg-grid opacity-60" />

      <div className="relative z-10 flex h-full w-full flex-col">
        <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed((c) => !c)} />

        <div className="flex min-h-0 flex-1">
          <Sidebar collapsed={collapsed} />

          <Chat onRun={setLastRun} />

          <aside className="hidden w-80 shrink-0 flex-col gap-3 border-l border-base-border bg-base-bg p-3 lg:flex">
            <div className="flex shrink-0 flex-col gap-3 overflow-y-auto no-scrollbar">
              <ModelRouter classification={lastRun?.classification} />
              <SystemStatus />
              <Deliverables items={lastRun?.deliverables} />
            </div>
            <SystemLog lastRun={lastRun} />
          </aside>
        </div>
      </div>
    </div>
  );
}
