import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function ProjectCard({ project }) {
  const dueLabel = project.dueDate
    ? (() => {
        const diff = Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return `${Math.abs(diff)}d overdue`;
        if (diff === 0) return "Due today";
        return `Due in ${diff}d`;
      })()
    : null;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="card p-5 flex flex-col gap-3.5 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 wb-animate-in"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
          <h3 className="font-semibold text-[15px] truncate">{project.name}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-sm text-muted line-clamp-2 min-h-[2.5em]">{project.description || "No description yet."}</p>

      <div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden mb-2">
          <div
            className="h-full rounded-full"
            style={{ width: `${project.progress || 0}%`, background: project.color }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {project.completedCount || 0} / {project.taskCount || 0} tasks
          </span>
          {dueLabel && <span>{dueLabel}</span>}
        </div>
      </div>

      <div className="flex items-center -space-x-2 pt-1">
        {(project.members || []).slice(0, 3).map((m) => (
          <Avatar key={m._id} name={m.name} color={m.avatarColor} size={26} />
        ))}
        {(project.members || []).length > 3 && (
          <span className="w-[26px] h-[26px] rounded-full bg-elevated border-2 border-surface flex items-center justify-center text-[10px] font-semibold text-muted">
            +{project.members.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
