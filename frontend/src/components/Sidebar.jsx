// import { useEffect, useState } from "react";
// import { Plus, MessageSquare } from "lucide-react";
// import { getSessions } from "../api/client.js";
// import KnowledgeBase from "./KnowledgeBase.jsx";

// // Left rail: session list + knowledge-base index. Collapses entirely
// // when `collapsed` is true (toggled from the header) rather than just
// // hiding content, so the chat column can use the full width on smaller
// // screens.
// export default function Sidebar({ collapsed }) {
//   const [sessions, setSessions] = useState(null); // null = loading
//   const [activeId, setActiveId] = useState(null);

//   useEffect(() => {
//     getSessions().then((s) => {
//       setSessions(s);
//       const active = s.find((x) => x.active) ?? s[0];
//       setActiveId(active?.id ?? null);
//     });
//   }, []);

//   if (collapsed) return null;

//   return (
//     <aside className="flex h-full w-72 shrink-0 flex-col border-r border-base-border bg-base-panel">
//       <div className="p-3">
//         <button
//           className="flex w-full items-center justify-center gap-2 rounded-lg border border-base-border bg-base-panel2 px-3 py-2 text-sm font-medium text-text-primary transition-colors duration-150 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:bg-primary/15"
//         >
//           <Plus size={15} /> New session
//         </button>
//       </div>

//       <div className="px-3 pb-1.5 pt-2">
//         <p className="text-2xs font-semibold uppercase tracking-wide text-text-tertiary">
//           Sessions
//         </p>
//       </div>

//       <nav className="flex flex-col gap-0.5 px-2" aria-label="Chat sessions">
//         {sessions === null &&
//           [0, 1, 2].map((i) => (
//             <div
//               key={i}
//               className="mx-0 h-9 animate-pulse rounded-md bg-base-panel2"
//               style={{ animationDelay: `${i * 120}ms` }}
//             />
//           ))}

//         {sessions?.length === 0 && (
//           <p className="px-2 py-3 text-2xs leading-relaxed text-text-tertiary">
//             No previous sessions. Start one with New Session above.
//           </p>
//         )}

//         {sessions?.map((s) => {
//           const isActive = s.id === activeId;
//           return (
//             <button
//               key={s.id}
//               onClick={() => setActiveId(s.id)}
//               aria-current={isActive ? "true" : undefined}
//               className={`group flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors duration-150 ${
//                 isActive
//                   ? "bg-base-panel3 text-text-primary shadow-panel"
//                   : "text-text-secondary hover:bg-base-panel2 hover:text-text-primary"
//               }`}
//             >
//               <MessageSquare
//                 size={14}
//                 className={`shrink-0 ${isActive ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary"}`}
//               />
//               <span className="min-w-0 flex-1 truncate">{s.title}</span>
//               <span className="shrink-0 text-3xs text-text-tertiary">
//                 {s.updatedAt}
//               </span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="my-3 border-t border-base-border" />

//       <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
//         <KnowledgeBase />
//       </div>

//       <div className="border-t border-base-border p-3">
//         <p className="text-3xs leading-relaxed text-text-tertiary">
//           MRPL &middot; GPU-Node-01
//           <br />
//           Model weights local, no egress
//         </p>
//       </div>
//     </aside>
//   );
// }



import { useEffect, useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { getSessions } from "../api/client.js";
import KnowledgeBase from "./KnowledgeBase.jsx";

// Left rail: session list + knowledge-base index. Collapses entirely
// when `collapsed` is true (toggled from the header) rather than just
// hiding content, so the chat column can use the full width on smaller
// screens.
export default function Sidebar({ collapsed }) {
  const [sessions, setSessions] = useState(null); // null = loading
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getSessions().then((s) => {
      setSessions(s);
      const active = s.find((x) => x.active) ?? s[0];
      setActiveId(active?.id ?? null);
    });
  }, []);

  if (collapsed) return null;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-base-border bg-base-panel">
      <div className="p-3">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-base-border bg-base-panel2 px-3 py-2 text-sm font-medium text-text-primary transition-colors duration-150 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:bg-primary/15"
        >
          <Plus size={15} /> New session
        </button>
      </div>

      <div className="px-3 pb-1.5 pt-2">
        <p className="text-2xs font-semibold uppercase tracking-wide text-text-tertiary">
          Sessions
        </p>
      </div>

      <nav className="flex flex-col gap-0.5 px-2" aria-label="Chat sessions">
        {sessions === null &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="mx-0 h-9 animate-pulse rounded-md bg-base-panel2"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}

        {sessions?.length === 0 && (
          <p className="px-2 py-3 text-2xs leading-relaxed text-text-tertiary">
            No previous sessions. Start one with New Session above.
          </p>
        )}

        {sessions?.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={`group flex items-center gap-2 rounded-md border-l-2 px-2 py-2 text-left text-sm transition-colors duration-150 ${
                isActive
                  ? "border-gold bg-base-panel3 text-text-primary shadow-panel"
                  : "border-transparent text-text-secondary hover:bg-base-panel2 hover:text-text-primary"
              }`}
            >
              <MessageSquare
                size={14}
                className={`shrink-0 ${isActive ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary"}`}
              />
              <span className="min-w-0 flex-1 truncate">{s.title}</span>
              <span className="shrink-0 text-3xs text-text-tertiary">
                {s.updatedAt}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="my-3 border-t border-base-border" />

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <KnowledgeBase />
      </div>

      <div className="border-t border-base-border p-3">
        <p className="text-3xs leading-relaxed text-text-tertiary">
          MRPL &middot; GPU-Node-01
          <br />
          Model weights local, no egress
        </p>
      </div>
    </aside>
  );
}
