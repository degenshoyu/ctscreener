import Link from "next/link";

import { useRouter } from "next/router";
import { useState } from "react";
import {
  LayoutDashboard,
  Eye,
  KeyRound,
  Book,
  Users,
  BarChart2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const navItems = [
  { label: "Coin Analyst", href: "/", icon: LayoutDashboard },
  { label: "X Watcher", href: "/x-watcher", icon: Eye },
  { label: "API Key", href: "/api-key", icon: KeyRound },
  { label: "System Status", href: "/system-status", icon: FileText },
  { label: "Documentation", href: "/docs", icon: Book },
  { label: "Community", href: "/community", icon: Users },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className={`${ collapsed ? "w-24" : "w-64" } bg-sidebar border-r-2 border-sidebarBorder p-6 space-y-4 transition-all duration-200`}>

        {/* Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Logo"
                className={`transition-all duration-200 ${collapsed ? "w-8" : "w-10"}`}
              />
              {!collapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-bold">ctScreener</span>
                  <span className="text-xs text-gray-400">v0.1 alpha</span>
                </div>
              )}
            </a>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <Link key={href} href={href} legacyBehavior>
                  {collapsed ? (
                    <a
                        className={`block w-full flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-150 ${
                          active ? "bg-cyan-700" : "hover:bg-gray-700"
                        }`}
                      >
                       <TooltipWrapper label={label}>
                        <Icon className="w-[18px] h-[18px]" />
                      </TooltipWrapper>
                    </a>
                  ) : (
                    <a
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        active ? "bg-cyan-700" : "hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      <span>{label}</span>
                    </a>
                  )}
              </Link>
            );
          })}
        </nav>
      </aside>



             {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-mainBg">
        {children}
      </main>
    </div>
  );
}
