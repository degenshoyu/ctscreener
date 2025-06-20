"use client";

import { LayoutGrid, List } from "lucide-react";

export default function ViewModeToggle({ viewMode, setViewMode }) {
  const isEmbed = viewMode === "embed";

  return (
    <div className="relative inline-flex h-10 px-1 bg-white/10 border border-blue-400/30 rounded-full backdrop-blur-md overflow-hidden">
      {/* 滑块 */}
      <span
        className={`
          absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full
          bg-gradient-to-br from-blue-500/50 to-blue-400/30 shadow-md transition-transform duration-300
          ${isEmbed ? "translate-x-0" : "translate-x-full"}
        `}
      ></span>

      <div className="relative flex w-full gap-1">
        <button
          onClick={() => setViewMode("embed")}
          className={`relative flex items-center justify-center min-w-[120px] px-4 z-10 font-medium transition-all duration-300 ${
            isEmbed ? "text-white font-semibold" : "text-blue-100 hover:text-white"
          }`}
        >
          <LayoutGrid size={16} className="mr-1" /> Embed Card
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`relative flex items-center justify-center min-w-[120px] px-4 z-10 font-medium transition-all duration-300 ${
            !isEmbed ? "text-white font-semibold" : "text-blue-100 hover:text-white"
          }`}
        >
          <List size={16} className="mr-1" /> Tweet List
        </button>
      </div>
    </div>
  );
}
