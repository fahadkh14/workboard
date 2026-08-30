import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FilePlus, FolderPlus, Settings } from "lucide-react";

export default function CommandPalette({ open, onClose, recentTasks = [], recentProjects = [], onCreateTask }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const commands = useMemo(
    () => [
      { label: "Create Task", shortcut: "⌘ T", icon: FilePlus, action: () => onCreateTask?.() },
      { label: "Create Project", shortcut: "⌘ P", icon: FolderPlus, action: () => navigate("/projects") },
      { label: "Open Settings", icon: Settings, action: () => navigate("/settings") },
    ],
    [navigate, onCreateTask]
  );

  if (!open) return null;

  const q = query.toLowerCase();
  const filteredCommands = commands.filter((c) => c.label.toLowerCase().includes(q));
  const filteredTasks = recentTasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4);
  const filteredProjects = recentProjects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4);

  const run = (fn) => {
    fn();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 px-4 bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-lg rounded-modal shadow-elevated overflow-hidden wb-animate-in"
      >
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            placeholder="Search WorkBoard..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredTasks.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">Recent</p>
              {filteredTasks.map((t) => (
                <button
                  key={t._id}
                  onClick={() => run(() => navigate("/tasks"))}
                  className="w-full text-left px-2.5 py-2 text-sm rounded-md hover:bg-elevated flex items-center gap-2"
                >
                  {t.title}
                </button>
              ))}
            </div>
          )}
          {filteredProjects.length > 0 && (
            <div className="mb-2">
              {filteredProjects.map((p) => (
                <button
                  key={p._id}
                  onClick={() => run(() => navigate(`/projects/${p._id}`))}
                  className="w-full text-left px-2.5 py-2 text-sm rounded-md hover:bg-elevated flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </button>
              ))}
            </div>
          )}
          <div>
            <p className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">Commands</p>
            {filteredCommands.map((c) => (
              <button
                key={c.label}
                onClick={() => run(c.action)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-sm rounded-md hover:bg-elevated"
              >
                <span className="flex items-center gap-2.5">
                  <c.icon size={15} className="text-muted" />
                  {c.label}
                </span>
                {c.shortcut && <span className="text-xs text-muted">{c.shortcut}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}