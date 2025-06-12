// components/Topbar.jsx
"use client";

import { useState } from "react";
import LoginPopup from "./LoginPopup";
import { useSession } from "next-auth/react";
import DynamicWalletButton from "./DynamicWalletButton";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Wallet } from "lucide-react";

export default function Topbar() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex justify-end items-center px-6 mb-10 space-x-4">
      <DynamicWalletButton />
      {session ? (
        <img
          src={session.user.image}
          alt="Twitter Profile"
          className="w-10 h-10 rounded-full border border-gray-300 hover:opacity-80 cursor-pointer"
          onClick={() => setLoginOpen(true)}
        />
      ) : (
        <button
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded hover:opacity-90"
          onClick={() => setLoginOpen(true)}
        >
          Login
        </button>
      )}

      <LoginPopup isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
