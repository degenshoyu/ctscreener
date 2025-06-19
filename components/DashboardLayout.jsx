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
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TooltipWrapper from "@/components/ui/TooltipWrapper";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Topbar from "@/components/Topbar";

const navItems = [
  { label: "Coin Analyst", href: "/", icon: LayoutDashboard },
  { label: "API Key", href: "/api-key", icon: KeyRound },
  { label: "System Status", href: "/system-status", icon: Activity },
  { label: "Documentation", href: "/docs", icon: Book },
  { label: "Community", href: "/community", icon: Users },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);

  return (
    <div className="min-h-screen flex bg-mainBg text-white">
      {/* Sidebar */}
      <aside className={`${ collapsed ? "w-24" : "w-64" } sticky top-0 h-screen bg-mainBg/80 backdrop-blur-md border-r-[0.5px] border-blue-400/40 shadow-[4px_0_12px_-2px_rgba(96,165,250,0.1)] p-6 space-y-4 transition-all duration-200 overflow-y-auto`}>

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
            <a className="flex items-center gap-3 group">
              <img
                src="/logo.svg"
                alt="Logo"
                className={`transition-all duration-500 ${collapsed ? "w-8" : "w-10"} group-hover:animate-spin`}
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
                        className={`block w-full flex items-center justify-center w-10 h-10 rounded-md transition-colors transition-all duration-300 ${
                          active
                          ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
      : "border-blue-400/30 hover:bg-blue-400/10 backdrop-blur-md"

                        }`}
                      >
                       <TooltipWrapper label={label}>
                        <Icon className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-180" />
                      </TooltipWrapper>
                    </a>
                  ) : (
                    <a
                      className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors transition-all duration-300 ${
                        active
                            ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
  : "border-blue-400/30 hover:bg-blue-400/10 backdrop-blur-md"

                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-180" />
                      <span>{label}</span>
                    </a>
                  )}
              </Link>
            );
          })}
        </nav>
      </aside>

            {/* Right content with sticky Topbar */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Topbar 固定 */}
        <Topbar />

             {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-mainBg">
        {children}
      </main>
      </div>
    </div>
  );
}
