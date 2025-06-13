// components/Topbar.jsx
"use client";

import WalletButton from "./WalletButton";

export default function Topbar() {
  return (
    <div className="flex justify-end items-center px-6 mb-10 space-x-4">
      <a
        href="https://pump.fun/coin/2pHPoTfkRjhxqo5JDzEyqRTftQivJHCiUiT5uGp2pump"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
      >
        Buy $ctS
      </a>
      <WalletButton />
    </div>
  );
}
