import Link from "next/link";

import { useRouter } from "next/router";
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
import { useState, useEffect, useRef } from "react";

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
  const [mouse, setMouse] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const starRefs = useRef(Array.from({ length: 40 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    hue: Math.floor(Math.random() * 360),
    size: Math.random() * 2 + 1,
  })));

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      starRefs.current.forEach((star) => {
        star.vx += (Math.random() - 0.5) * 0.1;
        star.vy += (Math.random() - 0.5) * 0.1
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.05;
          star.vx += dx * force;
          star.vy += dy * force;
        }

          star.vx *= 0.95;
          star.vy *= 0.95;

          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = window.innerWidth;
          if (star.x > window.innerWidth) star.x = 0;
          if (star.y < 0) star.y = window.innerHeight;
          if (star.y > window.innerHeight) star.y = 0;
        });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [mouse]);

  return (
    <div className="min-h-screen flex bg-mainBg text-white relative">
        {/* === Fancy floating stars === */}
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
  {starRefs.current.map((star, i) => (
    <div
      key={i}
      className="absolute rounded-full blur-[2px]"
      style={{
        top: `${star.y}px`,
        left: `${star.x}px`,
        width: `${star.size * 2}px`,
        height: `${star.size * 2}px`,
        backgroundColor: `hsl(${star.hue} 100% 70% / 1)`,
        boxShadow: `0 0 6px hsl(${star.hue} 100% 70% / 0.6)`,
      }}
    />
  ))}
    </div>
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
                        className={`block w-full flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
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
                      className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
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
