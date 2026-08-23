import { useState } from "react";
import PriorityBadge from "./PriorityBadge.jsx";
import Avatar from "./Avatar.jsx";

const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "blocked", label: "Blocked" },
];

function KanbanCard({ task, onOpen, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onOpen(task)}
      className="card p-3.5 cursor-grab active:cursor-grabbing hover:shadow-elevated transition-shadow"
    >
      <p className="text-sm font-medium mb-1.5">{task.title}</p>
      {task.description && <p className="text-xs text-muted mb-2.5 line-clamp-2">{task.description}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span className="text-[11px] text-muted">
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        {task.assignee && <Avatar name={task.assignee.name} color={task.assignee.avatarColor} size={22} />}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onStatusChange, onOpen }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDrop = (e, status) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onStatusChange(taskId, status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`rounded-card border border-dashed p-3 min-h-[200px] transition-colors ${
              dragOverCol === col.key ? "border-primary bg-primary/5" : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="text-xs text-muted">{colTasks.length} Task{colTasks.length === 1 ? "" : "s"}</span>
            </div>
            <div className="space-y-2.5">
              {colTasks.map((task) => (
                <KanbanCard
                  key={task._id}
                  task={task}
                  onOpen={onOpen}
                  onDragStart={(e, id) => e.dataTransfer.setData("text/plain", id)}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
