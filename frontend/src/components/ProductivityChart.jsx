import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RANGES = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 shadow-elevated text-xs">
      <p className="font-semibold mb-1">{new Date(label).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function ProductivityChart({ data, range, onRangeChange }) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-[15px]">Productivity Overview</h3>
          <p className="text-xs text-muted mt-0.5">Tasks completed vs. created</p>
        </div>
        <div className="flex items-center gap-1 bg-elevated rounded-btn p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r.value ? "bg-primary text-white" : "text-muted hover:text-text"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[260px] mt-3 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="wbCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--wb-primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--wb-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="wbCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--wb-secondary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--wb-secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--wb-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { weekday: "short" })}
              tick={{ fontSize: 11, fill: "var(--wb-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--wb-primary)" fill="url(#wbCompleted)" strokeWidth={2} />
            <Area type="monotone" dataKey="created" name="Created" stroke="var(--wb-secondary)" fill="url(#wbCreated)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
