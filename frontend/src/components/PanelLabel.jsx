// A single, reused way to label a panel/section. Sans-serif, not mono —
// mono is now reserved for genuinely technical content (code, log
// lines, numeric telemetry), not for every section heading in the app.
// Exists so every card uses identical type/spacing instead of drifting.
export default function PanelLabel({ icon: Icon, children, right }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      {Icon && <Icon size={13} className="text-text-tertiary" />}
      <p className="text-2xs font-semibold uppercase tracking-wide text-text-tertiary">
        {children}
      </p>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}


