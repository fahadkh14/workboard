import { useState } from "react";
import { X } from "lucide-react";
import Avatar from "./Avatar.jsx";
import PriorityBadge from "./PriorityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function TaskDrawer({ task, activity = [], open, onClose, onUpdate }) {
  const [local, setLocal] = useState(task);

  if (!open || !local) return null;

  const change = (field, value) => {
    setLocal((t) => ({ ...t, [field]: value }));
    onUpdate?.(local._id, { [field]: value });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen w-full sm:w-[460px] bg-surface border-l border-border z-[65] flex flex-col wb-animate-in shadow-elevated">
        <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
          <h2 className="font-semibold text-[15px]">Task Details</h2>
          <button onClick={onClose} className="text-muted hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <input
            className="w-full text-lg font-bold bg-transparent outline-none"
            value={local.title}
            onChange={(e) => setLocal((t) => ({ ...t, title: e.target.value }))}
            onBlur={(e) => onUpdate?.(local._id, { title: e.target.value })}
          />
          <textarea
            className="w-full text-sm text-muted bg-transparent outline-none resize-none"
            rows={3}
            placeholder="Add a description..."
            value={local.description || ""}
            onChange={(e) => setLocal((t) => ({ ...t, description: e.target.value }))}
            onBlur={(e) => onUpdate?.(local._id, { description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted mb-1.5">Status</p>
              <select
                className="input-field text-sm"
                value={local.status}
                onChange={(e) => change("status", e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-muted mb-1.5">Priority</p>
              <select
                className="input-field text-sm"
                value={local.priority}
                onChange={(e) => change("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-muted mb-1.5">Project</p>
              <p className="text-sm font-medium">{local.project?.name || "No project"}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1.5">Due date</p>
              <input
                type="date"
                className="input-field text-sm"
                value={local.dueDate ? local.dueDate.slice(0, 10) : ""}
                onChange={(e) => change("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={local.status} />
            <PriorityBadge priority={local.priority} />
          </div>

          {local.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {local.tags.map((t) => (
                <span key={t} className="pill bg-elevated text-muted">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold mb-3">Activity</h3>
            <div className="space-y-3">
              {activity.length === 0 && <p className="text-xs text-muted">No activity yet.</p>}
              {activity.map((a) => (
                <div key={a._id} className="flex items-start gap-2.5 text-xs">
                  <Avatar name={a.user?.name} color={a.user?.avatarColor} size={22} />
                  <p className="text-muted">
                    <span className="text-text font-medium">{a.user?.name}</span> {a.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}