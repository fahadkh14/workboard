import { useState } from "react";
import { MoreVertical, Check } from "lucide-react";
import PriorityBadge from "./PriorityBadge.jsx";
import Avatar from "./Avatar.jsx";

function formatDue(date) {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  const diffDays = Math.round((d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TaskRow({ task, onToggleComplete, onOpen, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDone = task.status === "completed";
  const due = formatDue(task.dueDate);
  const overdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  return (
    <div
      className="group flex items-center gap-3 py-3 px-1 rounded-lg hover:bg-elevated/60 transition-colors cursor-pointer"
      onClick={() => onOpen?.(task)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete?.(task);
        }}
        className={`flex-shrink-0 w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-colors ${
          isDone ? "bg-primary border-primary" : "border-border hover:border-primary"
        }`}
      >
        {isDone && <Check size={12} color="white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? "line-through text-muted" : "text-text"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.project && (
            <span className="text-xs text-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: task.project.color }} />
              {task.project.name}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {task.assignee && <Avatar name={task.assignee.name} color={task.assignee.avatarColor} size={24} />}

      {due && (
        <span className="text-xs font-medium hidden sm:inline" style={{ color: overdue ? "var(--wb-danger)" : "var(--wb-muted)" }}>
          {due}
        </span>
      )}

      <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="opacity-0 group-hover:opacity-100 text-muted hover:text-text p-1 transition-opacity"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-7 z-20 w-40 card p-1.5 shadow-elevated">
            {["Edit", "Change Status", "Assign", "Move", "Delete"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  onMenuAction?.(label, task);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-sm rounded-md hover:bg-elevated text-text"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
