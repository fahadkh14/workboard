import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";
import Avatar from "../components/Avatar.jsx";

const SECTIONS = ["Profile", "Account", "Appearance", "Notifications", "Security"];

export default function Settings() {
  const [section, setSection] = useState("Profile");
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { push } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/profile", { name, title });
      setUser(res.data.user);
      push("Profile updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-4xl">
      <div className="lg:w-52 flex-shrink-0">
        <div className="flex lg:flex-col gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`text-left px-3 py-2.5 rounded-btn text-sm font-medium whitespace-nowrap transition-colors ${
                section === s ? "bg-primary/10 text-primary" : "text-muted hover:bg-elevated hover:text-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 card p-6">
        {section === "Profile" && (
          <form onSubmit={saveProfile} className="space-y-5 max-w-md">
            <div className="flex items-center gap-3.5">
              <Avatar name={user?.name} color={user?.avatarColor} size={56} />
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Full name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Title</label>
              <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <button disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        {section === "Account" && (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Email</label>
              <input className="input-field" value={user?.email} disabled />
            </div>
            <p className="text-sm text-muted">To change your email, please contact your workspace administrator.</p>
          </div>
        )}

        {section === "Appearance" && (
          <div className="max-w-md space-y-3">
            <p className="text-sm font-medium mb-2">Theme</p>
            <div className="flex gap-3">
              {["light", "dark"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-card border p-4 text-sm font-medium capitalize transition-colors ${
                    theme === t ? "border-primary text-primary" : "border-border text-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {section === "Notifications" && (
          <div className="max-w-md space-y-4">
            {["Task assignments", "Status changes", "Comments & mentions"].map((label) => (
              <label key={label} className="flex items-center justify-between text-sm">
                {label}
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </div>
        )}

        {section === "Security" && (
          <div className="max-w-md space-y-4">
            <p className="text-sm text-muted">Password changes and two-factor authentication settings will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
