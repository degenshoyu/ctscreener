"use client";
import { LayoutGrid, List, Brain } from "lucide-react";

export default function ViewModeToggle({ viewMode, setViewMode }) {
  const viewModes = ["embed", "list", "ai"];
  const activeIndex = viewModes.indexOf(viewMode);

  return (
    <div className="relative grid grid-cols-3 h-10 w-full max-w-md bg-white/10 border border-blue-400/30 rounded-full backdrop-blur-md overflow-hidden">
      {/* 滑块：用 left: 0 + translateX(n%) 精准移动 */}
      <span
        className="absolute top-1 bottom-1 left-1 w-[calc(33.333%-0.5rem)] rounded-full bg-gradient-to-br from-purple-500/50 to-purple-400/30 shadow-md transition-transform duration-300"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      <button
        onClick={() => setViewMode("embed")}
        className={`relative z-10 flex items-center justify-center px-4 font-medium transition-all duration-300 ${
          viewMode === "embed" ? "text-white font-semibold" : "text-blue-100 hover:text-white"
        }`}
      >
        <LayoutGrid size={16} className="mr-1" />
        Embed Card
      </button>

      <button
        onClick={() => setViewMode("list")}
        className={`relative z-10 flex items-center justify-center px-4 font-medium transition-all duration-300 ${
          viewMode === "list" ? "text-white font-semibold" : "text-blue-100 hover:text-white"
        }`}
      >
        <List size={16} className="mr-1" />
        Tweet List
      </button>

      <button
        onClick={() => setViewMode("ai")}
        className={`relative z-10 flex items-center justify-center px-4 font-medium transition-all duration-300 ${
          viewMode === "ai" ? "text-white font-semibold" : "text-purple-100 hover:text-white"
        }`}
      >
        <Brain size={16} className="mr-1" />
        AI Insight
      </button>
    </div>
  );
}
