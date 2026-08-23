import { useEffect, useState, useCallback } from "react";
import { Plus, X, LayoutGrid } from "lucide-react";
import api from "../services/api.js";
import ProjectCard from "../components/ProjectCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonProject } from "../components/Skeletons.jsx";
import { useToast } from "../components/Toast.jsx";

const COLORS = ["#5B5CE2", "#7C3AED", "#10B981", "#F59E0B", "#3B82F6", "#EF4444"];

function NewProjectModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", description: "", color: COLORS[0], dueDate: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ ...form, dueDate: form.dueDate || undefined });
      onClose();
      setForm({ name: "", description: "", color: COLORS[0], dueDate: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card w-full max-w-md p-6 rounded-modal shadow-elevated wb-animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Create New Project</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-text">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Project name</label>
            <input autoFocus className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: c, outline: form.color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Due date</label>
            <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { push } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get("/projects")
      .then((res) => setProjects(res.data.projects))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const createProject = async (payload) => {
    await api.post("/projects", payload);
    push("Project created successfully.");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Project
        </button>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonProject />
          <SkeletonProject />
          <SkeletonProject />
        </div>
      ) : projects.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            title="No projects yet"
            description="Your workspace is ready. Create your first project and start building."
            icon={<LayoutGrid size={22} />}
            action={
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                <Plus size={16} /> Create Project
              </button>
            }
          />
        </div>
      )}

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createProject} />
    </div>
  );
}
