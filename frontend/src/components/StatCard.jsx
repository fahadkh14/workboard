import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";

export default function StatCard({ label, value, trend, icon, accent = "var(--wb-primary)" }) {
  const isPositive = trend >= 0;
  return (
    <div className="card p-5 wb-animate-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}1a`, color: accent }}
          >
            {icon}
          </div>
          <span className="text-xs font-semibold tracking-wider text-muted uppercase">{label}</span>
        </div>
        <button className="text-muted hover:text-text">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <p className="text-[32px] font-bold leading-none mb-3">{value}</p>
      {typeof trend === "number" && (
        <p
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: isPositive ? "var(--wb-success)" : "var(--wb-danger)" }}
        >
          {isPositive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          {Math.abs(trend)}% this week
        </p>
      )}
    </div>
  );
}
