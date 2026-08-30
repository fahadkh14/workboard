import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, Share2, MoreHorizontal, Plus } from "lucide-react";
import api from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Avatar from "../components/Avatar.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskRow from "../components/TaskRow.jsx";
import TaskDrawer from "../components/TaskDrawer.jsx";
import ErrorState from "../components/ErrorState.jsx";

const TABS = ["Overview", "Board", "Tasks", "Timeline", "Activity"];

function Timeline({ project }) {
  const created = new Date(project.createdAt);
  const steps = [
    { label: "Project started", date: created, done: true },
    { label: "Design completed", done: project.progress >= 25 },
    { label: "Development started", done: project.progress >= 50 },
    { label: "Testing", done: project.progress >= 75 },
    { label: "Launch", done: project.progress >= 100 },
  ];
  return (
    <div className="card p-6">
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  background: s.done ? "var(--wb-primary)" : "var(--wb-surface)",
                  borderColor: s.done ? "var(--wb-primary)" : "var(--wb-border)",
                }}
              />
              <p className={`text-sm font-medium ${s.done ? "text-text" : "text-muted"}`}>{s.label}</p>
              {s.date && <p className="text-xs text-muted mt-0.5">{s.date.toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members } = useOutletContext();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("Overview");
  const [error, setError] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [activity, setActivity] = useState([]);

  const load = useCallback(() => {
    setError(false);
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`)])
      .then(([p, t]) => {
        setProject(p.data.project);
        setTasks(t.data.tasks);
      })
      .catch(() => setError(true));
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount/id change
    load();
  }, [load]);

  const toggleComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "todo" : "completed";
    await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
    load();
  };

  const changeStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    load();
  };

  const openTask = async (task) => {
    const res = await api.get(`/tasks/${task._id}`);
    setActiveTask(res.data.task);
    setActivity(res.data.activity);
  };

  const updateTask = async (taskId, patch) => {
    await api.put(`/tasks/${taskId}`, patch);
    load();
  };

  if (error) return <ErrorState onRetry={load} />;
  if (!project) return null;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/projects")} className="flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Projects
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: project.color }} />
            <h2 className="text-2xl font-bold">{project.name}</h2>
          </div>
          <p className="text-sm text-muted max-w-xl">{project.description}</p>
          <div className="mt-2.5">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="btn-secondary">
            <Share2 size={15} /> Share
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-btn border border-border text-muted hover:text-text">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center -space-x-2">
        {(project.members || []).map((m) => (
          <Avatar key={m._id} name={m.name} color={m.avatarColor} size={28} />
        ))}
      </div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs text-muted mb-2">Progress</p>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden mb-2">
              <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.color }} />
            </div>
            <p className="text-sm font-medium">{project.progress}% complete</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-2">Tasks</p>
            <p className="text-2xl font-bold">
              {project.completedCount} / {project.taskCount}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-muted mb-2">Due date</p>
            <p className="text-2xl font-bold">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "—"}</p>
          </div>
        </div>
      )}

      {tab === "Board" && <KanbanBoard tasks={tasks} onStatusChange={changeStatus} onOpen={openTask} />}

      {tab === "Tasks" && (
        <div className="card p-4">
          {tasks.length ? (
            <div className="divide-y divide-border">
              {tasks.map((t) => (
                <TaskRow key={t._id} task={t} onToggleComplete={toggleComplete} onOpen={openTask} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-10">No tasks in this project yet.</p>
          )}
        </div>
      )}

      {tab === "Timeline" && <Timeline project={project} />}

      {tab === "Activity" && (
        <div className="card p-5">
          <p className="text-sm text-muted text-center py-6">Open a task to see its activity history.</p>
        </div>
      )}

      <TaskDrawer key={activeTask?._id} task={activeTask} activity={activity} open={!!activeTask} onClose={() => setActiveTask(null)} onUpdate={updateTask} />
    </div>
  );
}
