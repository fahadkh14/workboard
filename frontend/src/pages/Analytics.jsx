import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import api from "../services/api.js";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonCard } from "../components/Skeletons.jsx";

const RANGES = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "quarter", label: "This Quarter" },
];

const STATUS_LABEL = { todo: "To Do", in_progress: "In Progress", completed: "Completed", blocked: "Blocked" };
const PRIORITY_LABEL = { low: "Low", medium: "Medium", high: "High" };

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([api.get("/analytics/overview"), api.get(`/analytics/productivity?range=${range}`)])
      .then(([o, t]) => {
        setOverview(o.data.overview);
        setTrend(t.data.trend);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount/range change
    load();
  }, [load]);

  if (error) return <ErrorState onRetry={load} />;

  const byStatus = (overview?.byStatus || []).map((d) => ({ name: STATUS_LABEL[d._id] || d._id, value: d.count }));
  const byPriority = (overview?.byPriority || []).map((d) => ({ name: PRIORITY_LABEL[d._id] || d._id, value: d.count }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex items-center gap-1 bg-elevated rounded-btn p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                range === r.key ? "bg-primary text-white" : "text-muted hover:text-text"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !overview ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="card p-5">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-3">Completion Rate</p>
              <p className="text-[28px] font-bold">{overview.completionRate}%</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-3">Avg Completion Time</p>
              <p className="text-[28px] font-bold">{overview.avgCompletionDays}d</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-3">Overdue Tasks</p>
              <p className="text-[28px] font-bold" style={{ color: overview.overdue > 0 ? "var(--wb-danger)" : undefined }}>
                {overview.overdue}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-3">Team Productivity</p>
              <p className="text-[28px] font-bold">{trend.reduce((s, t) => s + t.completed, 0)}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-[15px] mb-4">Productivity Trend</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--wb-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--wb-muted)" }} tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                <Tooltip contentStyle={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border)", borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="completed" stroke="var(--wb-primary)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-[15px] mb-4">Tasks by Status</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--wb-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                <Tooltip contentStyle={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--wb-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-[15px] mb-4">Tasks by Priority</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--wb-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--wb-muted)" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ background: "var(--wb-surface)", border: "1px solid var(--wb-border)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--wb-secondary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-[15px] mb-4">Project Progress</h3>
          <div className="space-y-4">
            {(overview?.projectProgress || []).map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted">{p.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
            {!overview?.projectProgress?.length && <p className="text-sm text-muted">No projects to show yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
