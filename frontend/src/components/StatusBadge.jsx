const CONFIG = {
  todo: { label: "To Do", bg: "rgba(107,114,128,0.12)", color: "var(--wb-muted)" },
  in_progress: { label: "In Progress", bg: "rgba(59,130,246,0.12)", color: "var(--wb-info)" },
  completed: { label: "Completed", bg: "rgba(16,185,129,0.12)", color: "var(--wb-success)" },
  blocked: { label: "Blocked", bg: "rgba(239,68,68,0.12)", color: "var(--wb-danger)" },
  active: { label: "Active", bg: "rgba(16,185,129,0.12)", color: "var(--wb-success)" },
  on_hold: { label: "On Hold", bg: "rgba(245,158,11,0.12)", color: "var(--wb-warning)" },
  archived: { label: "Archived", bg: "rgba(107,114,128,0.12)", color: "var(--wb-muted)" },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.todo;
  return (
    <span className="pill" style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}
