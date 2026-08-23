import { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import api from "../services/api.js";
import Avatar from "../components/Avatar.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { SkeletonProject } from "../components/Skeletons.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/users/team")
      .then((res) => setMembers(res.data.members))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Team</h2>
        <button className="btn-primary">
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {error ? (
        <ErrorState />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonProject />
          <SkeletonProject />
        </div>
      ) : members.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m._id} className="card p-5 flex items-center gap-3.5">
              <Avatar name={m.name} color={m.avatarColor} size={48} status={m.status} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{m.name}</p>
                <p className="text-xs text-muted truncate">{m.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                  <span>{m.taskCount} Tasks</span>
                  <span>{m.projectCount} Projects</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState title="No team members yet" description="Invite teammates to start collaborating." icon={<Users size={22} />} />
        </div>
      )}
    </div>
  );
}
