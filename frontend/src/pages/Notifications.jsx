import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import api from "../services/api.js";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonTask } from "../components/Skeletons.jsx";

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  const markAllRead = async () => {
    await api.patch("/notifications/read-all");
    load();
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button onClick={markAllRead} className="btn-secondary text-sm">
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      <div className="card p-2">
        {error ? (
          <ErrorState onRetry={load} />
        ) : loading ? (
          <div className="p-3">
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
          </div>
        ) : notifications.length ? (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className="w-full text-left flex items-start gap-3 px-3 py-3.5 hover:bg-elevated/60 rounded-lg transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: n.read ? "transparent" : "var(--wb-primary)" }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.body && <p className="text-sm text-muted truncate">"{n.body}"</p>}
                  <p className="text-xs text-muted mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="You're all caught up" description="No new notifications right now." icon={<Bell size={22} />} />
        )}
      </div>
    </div>
  );
}
