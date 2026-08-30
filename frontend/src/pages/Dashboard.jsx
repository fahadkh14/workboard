import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { ListChecks, Loader2, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import ProductivityChart from "../components/ProductivityChart.jsx";
import TaskDistributionChart from "../components/TaskDistributionChart.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import TaskRow from "../components/TaskRow.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonCard, SkeletonProject, SkeletonTask } from "../components/Skeletons.jsx";
import ErrorState from "../components/ErrorState.jsx";
import TaskDrawer from "../components/TaskDrawer.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const { openNewTask } = useOutletContext();
  const { push } = useToast();

  const [summary, setSummary] = useState(null);
  const [range, setRange] = useState(7);
  const [productivity, setProductivity] = useState([]);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [activity, setActivity] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      api.get("/dashboard/summary"),
      api.get(`/dashboard/productivity?days=${range}`),
      api.get("/dashboard/recent"),
    ])
      .then(([s, p, r]) => {
        setSummary(s.data.summary);
        setProductivity(p.data.productivity);
        setRecent(r.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount/range change
    load();
    const handler = () => load();
    window.addEventListener("wb:refresh", handler);
    return () => window.removeEventListener("wb:refresh", handler);
  }, [load]);

  const toggleComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "todo" : "completed";
    await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
    load();
  };

  const openTask = async (task) => {
    const res = await api.get(`/tasks/${task._id}`);
    setActiveTask(res.data.task);
    setActivity(res.data.activity);
  };

  const updateTask = async (id, patch) => {
    await api.put(`/tasks/${id}`, patch);
    load();
  };

  if (error) return <ErrorState onRetry={load} />;

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold leading-tight">
            Good {timeOfDay()}, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted mt-1">
            Here's your workspace overview for today. <span className="hidden sm:inline">· {today}</span>
          </p>
        </div>
        <button onClick={openNewTask} className="btn-primary flex-shrink-0">
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !summary ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard label="Total Tasks" value={summary.total} trend={summary.trend} icon={<ListChecks size={16} />} accent="var(--wb-primary)" />
            <StatCard label="In Progress" value={summary.inProgress} icon={<Loader2 size={16} />} accent="var(--wb-info)" />
            <StatCard label="Completed" value={summary.completed} icon={<CheckCircle2 size={16} />} accent="var(--wb-success)" />
            <StatCard label="Overdue" value={summary.overdue} icon={<AlertTriangle size={16} />} accent="var(--wb-danger)" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProductivityChart data={productivity} range={range} onRangeChange={setRange} />
        </div>
        <TaskDistributionChart distribution={recent?.distribution || []} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[15px]">Active Projects</h3>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SkeletonProject />
            <SkeletonProject />
          </div>
        ) : recent?.projects?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {recent.projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <div className="card">
            <EmptyState
              title="No projects yet"
              description="Your workspace is ready. Create your first project and start building."
              icon={<ListChecks size={22} />}
            />
          </div>
        )}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-[15px] mb-2">Recent Tasks</h3>
        {loading ? (
          <>
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
          </>
        ) : recent?.tasks?.length ? (
          <div className="divide-y divide-border">
            {recent.tasks.map((t) => (
              <TaskRow key={t._id} task={t} onToggleComplete={toggleComplete} onOpen={openTask} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start tracking your work."
            icon={<ListChecks size={22} />}
            action={
              <button onClick={openNewTask} className="btn-primary">
                <Plus size={16} /> New Task
              </button>
            }
          />
        )}
      </div>

      <TaskDrawer
        key={activeTask?._id}
        task={activeTask}
        activity={activity}
        open={!!activeTask}
        onClose={() => setActiveTask(null)}
        onUpdate={updateTask}
      />
    </div>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
