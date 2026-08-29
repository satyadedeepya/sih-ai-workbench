import { FileSearch, Code2, Database, Ruler, ShieldCheck } from "lucide-react";
import { SUGGESTED_TASKS } from "../api/mockData.js";

const CARD_ICON = {
  analyze: FileSearch,
  code: Code2,
  search: Database,
  drawing: Ruler,
};

// First-load state for the center workspace. Has one job: in under 10
// seconds, tell a judge (or a new employee) what this thing does and
// give them a working way to try it — every card here fires a real
// message through the same composer, it isn't decorative.
export default function HeroEmptyState({ onSelectTask }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-4 flex items-center gap-1.5 rounded-full border border-secure/30 bg-secure/10 px-3 py-1">
        <ShieldCheck size={12} className="text-secure" />
        <span className="font-mono text-3xs font-medium tracking-wide text-secure">
          RUNS ENTIRELY ON-PREMISE
        </span>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
        Sovereign AI for confidential work.
      </h2>
      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-text-secondary">
        Analyze confidential documents, work with scanned reports, write and
        verify code, and search MRPL's own manuals — all without a single
        request leaving this machine.
      </p>

      <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTED_TASKS.map((task) => {
          const Icon = CARD_ICON[task.id] ?? FileSearch;
          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.prompt)}
              className="group flex items-start gap-3 rounded-xl border border-base-border bg-base-panel p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-borderHi hover:bg-base-panel2 hover:shadow-elevated"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber transition-colors duration-200 group-hover:bg-amber/20">
                <Icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-text-primary">
                  {task.title}
                </span>
                <span className="mt-0.5 block text-2xs leading-snug text-text-tertiary">
                  {task.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
