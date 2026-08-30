import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  priority: "medium",
  dueDate: "",
  tags: "",
};

export default function NewTaskModal({
  open,
  onClose,
  onCreate,
  projects = [],
  members = [],
  defaultProjectId,
}) {
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    ...initialForm,
    project: defaultProjectId || "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    setSubmitting(true);

    try {
      await onCreate({
        ...form,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        project: form.project || undefined,
        assignee: form.assignee || undefined,
        dueDate: form.dueDate || undefined,
      });

      setForm({
        ...initialForm,
        project: defaultProjectId || "",
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className="card w-full max-w-lg p-6 rounded-modal shadow-elevated wb-animate-in"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Create New Task</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-text"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Task title
            </label>

            <input
              ref={titleRef}
              className="input-field"
              placeholder="e.g. Fix authentication API"
              value={form.title}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  title: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Description
            </label>

            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add more detail (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                Project
              </label>

              <select
                className="input-field"
                value={form.project}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    project: e.target.value,
                  }))
                }
              >
                <option value="">No project</option>

                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                Assignee
              </label>

              <select
                className="input-field"
                value={form.assignee}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    assignee: e.target.value,
                  }))
                }
              >
                <option value="">Unassigned</option>

                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                Priority
              </label>

              <select
                className="input-field"
                value={form.priority}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    priority: e.target.value,
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                Due date
              </label>

              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    dueDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Tags
            </label>

            <input
              className="input-field"
              placeholder="frontend, urgent (comma separated)"
              value={form.tags}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  tags: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

