

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
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [lastRun, setLastRun] = useState(null); // { classification, steps, deliverables, runId }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base-bg">
      <div className="flex h-full w-full flex-col">
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          rightCollapsed={rightCollapsed}
          onToggleRightSidebar={() => setRightCollapsed((c) => !c)}
        />

        <div className="flex min-h-0 flex-1">
          <Sidebar collapsed={collapsed} />

          <Chat onRun={setLastRun} />

          {!rightCollapsed && (
            <aside className="hidden w-80 shrink-0 flex-col gap-3 border-l border-base-border bg-base-bg p-3 lg:flex">
              <div className="flex shrink-0 flex-col gap-3 overflow-y-auto no-scrollbar">
                <ModelRouter classification={lastRun?.classification} />
                <SystemStatus />
                <Deliverables items={lastRun?.deliverables} />
              </div>
              <SystemLog lastRun={lastRun} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
