const CONFIG = {
  high: { label: "High", bg: "rgba(239,68,68,0.12)", color: "var(--wb-danger)" },
  medium: { label: "Medium", bg: "rgba(245,158,11,0.12)", color: "var(--wb-warning)" },
  low: { label: "Low", bg: "rgba(59,130,246,0.12)", color: "var(--wb-info)" },
};

export default function PriorityBadge({ priority }) {
  const cfg = CONFIG[priority] || CONFIG.medium;
  return (
    <span className="pill" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}
