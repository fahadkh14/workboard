import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, ListChecks } from "lucide-react";
import api from "../services/api.js";
import TaskRow from "../components/TaskRow.jsx";
import TaskDrawer from "../components/TaskDrawer.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonTable } from "../components/Skeletons.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "blocked", label: "Blocked" },
];

export default function MyTasks() {
  const { openNewTask } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [activity, setActivity] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    const query = filter === "all" ? "" : `?status=${filter}`;
    api
      .get(`/tasks${query}`)
      .then((res) => setTasks(res.data.tasks))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
    window.addEventListener("wb:refresh", load);
    return () => window.removeEventListener("wb:refresh", load);
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

  const handleMenuAction = async (label, task) => {
    if (label === "Delete") {
      await api.delete(`/tasks/${task._id}`);
      load();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button onClick={openNewTask} className="btn-primary">
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex items-center gap-1 bg-elevated rounded-btn p-1 w-fit overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === f.key ? "bg-primary text-white" : "text-muted hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        {error ? (
          <ErrorState onRetry={load} />
        ) : loading ? (
          <SkeletonTable rows={6} />
        ) : tasks.length ? (
          <div className="divide-y divide-border">
            {tasks.map((t) => (
              <TaskRow key={t._id} task={t} onToggleComplete={toggleComplete} onOpen={openTask} onMenuAction={handleMenuAction} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks here"
            description="Nothing matches this filter yet. Create a task to get started."
            icon={<ListChecks size={22} />}
            action={
              <button onClick={openNewTask} className="btn-primary">
                <Plus size={16} /> New Task
              </button>
            }
          />
        )}
      </div>

      <TaskDrawer task={activeTask} activity={activity} open={!!activeTask} onClose={() => setActiveTask(null)} onUpdate={updateTask} />
    </div>
  );
}
