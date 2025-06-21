// components/ui/Switch.jsx
export default function Switch({ checked, onCheckedChange, size = "md" }) {
  const sizes = {
    sm: { w: "w-8", h: "h-4", dot: "h-3 w-3" },
    md: { w: "w-10", h: "h-5", dot: "h-4 w-4" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <div
        className={`
          ${s.w} ${s.h} bg-gray-200 peer-focus:outline-none
          peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full
          peer peer-checked:after:translate-x-full
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:border-gray-300 after:border
          after:rounded-full ${s.dot} after:transition-all
          peer-checked:bg-blue-600
        `}
      ></div>
    </label>
  );
}

