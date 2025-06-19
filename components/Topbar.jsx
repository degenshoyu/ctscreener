// components/Topbar.jsx
"use client";

import WalletButton from "./WalletButton";

export default function Topbar() {
  return (
    <div className="sticky top-0 z-50 w-full flex justify-end items-center px-6 py-4 bg-mainBg/80 space-x-4 backdrop-blur-md backdrop-brightness-75 border-b-[0.5p] border-blue-400/50 shadow-[0_4px_20px_0_rgba(96,165,250,0.1)]">
<a
  href="https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=2pHPoTfkRjhxqo5JDzEyqRTftQivJHCiUiT5uGp2pump"
  target="_blank"
  rel="noopener noreferrer"
  className="
    relative inline-flex items-center justify-center px-6 py-2
    font-semibold text-white backdrop-blur-lg
    bg-gradient-to-br from-blue-900/50 to-blue-600/30
    border border-blue-400/30 shadow-xl
    rounded-full overflow-hidden transition-all duration-300
    hover:scale-105 hover:shadow-2xl
    before:absolute before:inset-0 before:bg-gradient-to-tr before:from-blue-400/30 before:to-cyan-300/10 before:blur-lg before:opacity-40
  "
>
        Buy $ctS
      </a>
      <WalletButton />
    </div>
  );
}
