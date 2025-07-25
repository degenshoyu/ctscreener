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
import MoonButton from "@/components/MoonButton";

const navItems = [
  { label: "Coin Analyst", href: "/analyst", icon: LayoutDashboard },
  { label: "High Impact", href: "", icon: BarChart2, disabled: true },
  { label: "API Key", href: "/api-key", icon: KeyRound },
  { label: "System Status", href: "/system-status", icon: Activity },
  { label: "Docs", href: "/docs", icon: Book },
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
  const meteorsRef = useRef([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      meteorsRef.current.push({
        x: window.innerWidth + 50,
        y: -50,
        vx: -(Math.random() * 1.5 + 0.5),
        vy: Math.random() * 1.5 + 0.5,
        length: Math.random() * 100 + 50,
        hue: Math.floor(Math.random() * 360),
      });
      if (meteorsRef.current.length > 3) {
        meteorsRef.current.shift();
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
  let animationFrame;
  const animateStars = () => {
    starRefs.current.forEach((star) => {
      star.vx += (Math.random() - 0.5) * 0.1;
      star.vy += (Math.random() - 0.5) * 0.1;

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

    animationFrame = requestAnimationFrame(animateStars);
  };
  animateStars();
  return () => cancelAnimationFrame(animationFrame);
}, [mouse]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      meteorsRef.current.forEach((meteor) => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        const tailX = meteor.x - meteor.vx * meteor.length;
        const tailY = meteor.y - meteor.vy * meteor.length;

        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        grad.addColorStop(0, `hsla(${meteor.hue}, 100%, 80%, 1)`);
        grad.addColorStop(1, `hsla(${meteor.hue}, 100%, 80%, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${meteor.hue}, 100%, 80%, 0.8)`;

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="min-h-screen flex bg-mainBg text-white relative">
    <MoonButton />
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
  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
</div>

      {/* Sidebar */}
      <aside className={`${ collapsed ? "w-24" : "w-64" }
        sticky top-0 h-screen bg-mainBg/80 backdrop-blur-md border-r-[0.5px] border-blue-400/40
        shadow-[4px_0_12px_-2px_rgba(96,165,250,0.1)] p-6 space-y-4 transition-all duration-200 overflow-y-auto hidden md:block`}>

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
                  <span className="text-xs text-gray-400">v0.2 beta</span>
                </div>
              )}
            </a>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">

    {navItems.map(({ label, href, icon: Icon, disabled }) => {
  const active = router.pathname === href;

if (disabled) {
  return collapsed ? (
    <div
      key={label}
      className="group flex items-center justify-center w-10 h-10 rounded-md text-gray-500 cursor-not-allowed"
    >
      <TooltipWrapper label="Upgrading...">
        <Icon className="w-[18px] h-[18px] opacity-40" />
      </TooltipWrapper>
    </div>
  ) : (
    <div
      key={label}
      className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed"
    >
      <TooltipWrapper label="Upgrading...">
        <Icon className="w-[18px] h-[18px] opacity-40" />
      </TooltipWrapper>
      <span>{label}</span>
    </div>
  );
}

return collapsed ? (
  <Link key={href} href={href} legacyBehavior>
    <a
      className={`group block w-full flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ${
        active
          ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
          : "border-blue-400/30 hover:bg-blue-400/10 backdrop-blur-md"
      }`}
    >
      <TooltipWrapper label={label}>
        <Icon className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-180" />
      </TooltipWrapper>
    </a>
  </Link>
) : (
  <Link key={href} href={href} legacyBehavior>
    <a
      className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
          : " hover:bg-blue-400/10 hover:scale-[1.05] hover:shadow-md backdrop-blur-md "
      }`}
    >
      <Icon className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-180" />
      <span>{label}</span>
    </a>
  </Link>
);
})}

        </nav>
      </aside>

            {/* Right content with sticky Topbar */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Topbar fix */}
        <Topbar />

             {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-mainBg">
        {children}
      </main>
    <footer className="text-center text-sm text-white/40 py-4">
      © {new Date().getFullYear()} ctScreener. All rights reserved.
    </footer>
      </div>

      {/* === Mobile Bottom Nav === */}
<nav className="fixed bottom-0 left-0 w-full flex justify-around bg-mainBg/80 backdrop-blur-md border-t border-blue-400/30 shadow-md p-1 md:hidden z-50">
{navItems.map(({ label, href, icon: Icon, disabled }) => {
  const active = router.pathname === href;

  if (disabled) {
    return (
      <div
        key={label}
        className="flex-1 flex flex-col items-center justify-center py-1 text-xs font-medium text-gray-500 cursor-not-allowed"
      >
        <TooltipWrapper label="Upgrading...">
          <Icon className="w-6 h-6 mb-0.5 opacity-40" />
        </TooltipWrapper>
        {label.split(" ")[0]}
      </div>
    );
  }

  return (
    <Link key={href} href={href} legacyBehavior>
      <a
        className={`flex-1 flex flex-col items-center justify-center py-1 text-xs font-medium transition ${
          active ? "text-white" : "text-blue-100 hover:text-white"
        }`}
      >
        <Icon className="w-6 h-6 mb-0.5" />
        {label.split(" ")[0]}
      </a>
    </Link>
  );
})}
</nav>

    </div>
  );
}
