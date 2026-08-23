import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import CommandPalette from "../components/CommandPalette.jsx";
import NewTaskModal from "../components/NewTaskModal.jsx";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";

const TITLES = {
  "/": "Dashboard",
  "/tasks": "My Tasks",
  "/projects": "Projects",
  "/team": "Team",
  "/assistant": "AI Assistant",
  "/analytics": "Analytics",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const { push } = useToast();

  const title = TITLES[location.pathname] || (location.pathname.startsWith("/projects/") ? "Project" : "WorkBoard");

  useEffect(() => {
    api.get("/notifications").then((res) => setUnreadCount(res.data.unreadCount)).catch(() => {});
    api.get("/projects").then((res) => setProjects(res.data.projects)).catch(() => {});
    api.get("/users/team").then((res) => setMembers(res.data.members)).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const createTask = useCallback(
    async (payload) => {
      await api.post("/tasks", payload);
      push("Task created successfully.");
      window.dispatchEvent(new CustomEvent("wb:refresh"));
    },
    [push]
  );

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          title={title}
          unreadCount={unreadCount}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
          <Outlet context={{ openNewTask: () => setTaskModalOpen(true), projects, members }} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        recentTasks={[]}
        recentProjects={projects}
        onCreateTask={() => setTaskModalOpen(true)}
      />
      <NewTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onCreate={createTask}
        projects={projects}
        members={members}
      />
    </div>
  );
}
