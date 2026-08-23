import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  LayoutGrid,
  Users,
  Sparkles,
  PieChart,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react";
import Logo from "./Logo.jsx";
import Avatar from "./Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const WORKSPACE = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/projects", label: "Projects", icon: LayoutGrid },
  { to: "/team", label: "Team", icon: Users },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
];

const INSIGHTS = [{ to: "/analytics", label: "Analytics", icon: PieChart }];

const SYSTEM = [
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavSection({ title, items, collapsed }) {
  return (
    <div className="mb-5">
      {!collapsed && (
        <p className="px-3 mb-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">{title}</p>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-elevated hover:text-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />}
                <Icon size={18} strokeWidth={2} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen bg-surface border-r border-border flex flex-col z-50 transition-all duration-200
          ${collapsed ? "lg:w-[72px]" : "lg:w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} w-[240px]`}
      >
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-border flex-shrink-0">
          <Logo size={30} />
          {!collapsed && <span className="text-[17px] font-bold tracking-tight">WorkBoard</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection title="Workspace" items={WORKSPACE} collapsed={collapsed} />
          <NavSection title="Insights" items={INSIGHTS} collapsed={collapsed} />
          <NavSection title="System" items={SYSTEM} collapsed={collapsed} />
        </nav>

        <div className="border-t border-border p-3 flex items-center gap-2.5">
          <Avatar name={user?.name} color={user?.avatarColor} status="online" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-muted hover:text-text p-1">
              <MoreVertical size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex items-center justify-center absolute -right-3 top-16 w-6 h-6 rounded-full bg-surface border border-border text-muted hover:text-primary shadow-subtle"
        >
          {collapsed ? <ChevronsRight size={13} /> : <ChevronsLeft size={13} />}
        </button>
      </aside>
    </>
  );
}
