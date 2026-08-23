import { useState } from "react";
import { Search, Bell, Sun, Moon, Menu, HelpCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Header({ title, onOpenPalette, onOpenMobileSidebar, unreadCount = 0 }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-border bg-bg/80 backdrop-blur">
      <button className="lg:hidden text-muted" onClick={onOpenMobileSidebar}>
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-bold whitespace-nowrap hidden sm:block">{title}</h1>

      <button
        onClick={onOpenPalette}
        className="flex-1 max-w-md mx-auto flex items-center gap-2 rounded-input border border-border bg-surface px-3.5 py-2 text-sm text-muted hover:border-primary/40 transition-colors"
      >
        <Search size={15} />
        <span className="flex-1 text-left hidden sm:inline">Search tasks, projects or commands...</span>
        <span className="hidden sm:inline text-xs bg-elevated border border-border rounded px-1.5 py-0.5">
          Ctrl K
        </span>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <a
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:bg-surface hover:text-text transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" style={{ background: "var(--wb-danger)" }} />
          )}
        </a>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:bg-surface hover:text-text transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-btn text-muted hover:bg-surface hover:text-text transition-colors">
          <HelpCircle size={18} />
        </button>
        <Avatar name={user?.name} color={user?.avatarColor} size={32} />
      </div>
    </header>
  );
}
