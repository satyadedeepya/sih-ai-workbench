// A single, reused way to label a panel/section. Exists so every card
// (Model Router, System, Deliverables, System Log, Agent Status) uses
// identical type, tracking, and spacing instead of drifting apart —
// small, but it's most of what makes a UI read as "one product."
export default function PanelLabel({ icon: Icon, children, right }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-text-tertiary" />}
      <p className="font-mono text-2xs font-medium tracking-[0.12em] text-text-tertiary">
        {children}
      </p>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}
