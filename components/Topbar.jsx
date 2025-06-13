// components/Topbar.jsx
"use client";

import { useEffect, useState } from "react";
import DynamicWalletButton from "./DynamicWalletButton";

export default function Topbar() {
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <div className="flex justify-end items-center px-6 mb-10 space-x-4">
      <a
        href="https://pump.fun/coin/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
      >
        Buy $ctS
      </a>
      <DynamicWalletButton />
    </div>
  );
}
