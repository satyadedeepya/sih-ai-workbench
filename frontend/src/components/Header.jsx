// import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
// import NetworkMonitor from "./NetworkMonitor.jsx";

// // The application's top bar. Deliberately restrained: one wordmark, one
// // status cluster (NetworkMonitor), one sidebar toggle. Everything here
// // is a structural landmark a returning user should be able to find
// // without looking — nothing here should change position or size.
// export default function Header({ collapsed, onToggleSidebar }) {
//   return (
//     <header className="flex h-14 shrink-0 items-center justify-between border-b border-base-border bg-base-panel px-4">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onToggleSidebar}
//           className="rounded-md p-1 text-text-secondary transition-colors duration-150 hover:bg-base-panel2 hover:text-text-primary"
//           aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
//           title={collapsed ? "Show sidebar" : "Hide sidebar"}
//         >
//           {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
//         </button>
//         <div className="flex items-center gap-2.5">
//           <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
//             <Sparkles size={15} strokeWidth={2.25} />
//           </div>
//           <div className="leading-tight">
//             <h1 className="text-sm font-semibold tracking-tight text-text-primary">
//               MRPL <span className="font-normal text-text-tertiary">Workbench</span>
//             </h1>
//             <p className="text-2xs text-text-tertiary">
//               Sovereign, on-premise AI &middot; SIH 26117
//             </p>
//           </div>
//         </div>
//       </div>

//       <NetworkMonitor />
//     </header>
//   );
// }



import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import NetworkMonitor from "./NetworkMonitor.jsx";

// The application's top bar. Deliberately restrained: one wordmark, one
// status cluster (NetworkMonitor), one sidebar toggle on each side.
// Everything here is a structural landmark a returning user should be
// able to find without looking — nothing here should change position
// or size.
export default function Header({ collapsed, onToggleSidebar, rightCollapsed, onToggleRightSidebar }) {
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles size={15} strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">
              <span className="text-gold">MRPL</span>{" "}
              <span className="font-normal text-text-tertiary">Workbench</span>
            </h1>
            <p className="text-2xs text-text-tertiary">
              Sovereign, on-premise AI &middot; SIH 26117
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NetworkMonitor />
        {onToggleRightSidebar && (
          <button
            onClick={onToggleRightSidebar}
            className="hidden rounded-md p-1 text-text-secondary transition-colors duration-150 hover:bg-base-panel2 hover:text-text-primary lg:block"
            aria-label={rightCollapsed ? "Show panel" : "Hide panel"}
            title={rightCollapsed ? "Show panel" : "Hide panel"}
          >
            {rightCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
          </button>
        )}
      </div>
    </header>
  );
}
