import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATUS_META = {
  todo: { label: "To Do", color: "#9CA3AF" },
  in_progress: { label: "In Progress", color: "var(--wb-info)" },
  completed: { label: "Completed", color: "var(--wb-success)" },
  blocked: { label: "Blocked", color: "var(--wb-danger)" },
};

export default function TaskDistributionChart({ distribution = [] }) {
  const total = distribution.reduce((s, d) => s + d.count, 0);
  const data = distribution.map((d) => ({
    key: d._id,
    name: STATUS_META[d._id]?.label || d._id,
    value: d.count,
    color: STATUS_META[d._id]?.color || "#9CA3AF",
  }));

  const topPercent = total ? Math.round((Math.max(...distribution.map((d) => d.count), 0) / total) * 100) : 0;

  return (
    <div className="card p-5 h-full flex flex-col">
      <h3 className="font-semibold text-[15px]">Task Distribution</h3>
      <p className="text-xs text-muted mt-0.5 mb-2">Where your work stands</p>

      <div className="relative flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} tasks`, name]}
              contentStyle={{
                background: "var(--wb-surface)",
                border: "1px solid var(--wb-border)",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-muted">total tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-2 text-xs text-muted">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="truncate">{d.name}</span>
            <span className="ml-auto font-medium text-text">{d.value}</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-muted col-span-2">No tasks yet.</p>}
      </div>
    </div>
  );
}
