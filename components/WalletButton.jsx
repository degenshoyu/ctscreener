"use client";

import { useConnectWallet } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { User, LogOut } from "lucide-react";

export default function WalletButton() {
  const { connectWallet } = useConnectWallet();
  const { wallets } = useSolanaWallets();
  const { authenticated, user, logout } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState("bottts");
  const router = useRouter();
  const [ctsBalance, setCtsBalance] = useState(0);
  const containerRef = useRef();

  const address = user?.wallet?.address;

  useEffect(() => {
    if (address) {
      fetch(`/api/user/get?wallet=${address}`)
        .then((res) => res.json())
        .then((data) => {
          setAvatarStyle(data.avatarStyle || "bottts");
        });
      fetch(`/api/checkBalance?wallet=${address}`)
        .then((res) => res.json())
        .then((data) => {
          setCtsBalance(data.balance || 0);
        });
    }
  }, [authenticated, address]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async () => {
    await connectWallet({
      walletChainType: "solana-only",
      walletList: ["phantom", "solflare", "backpack"],
    });

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 250));
      if (wallets[0]?.loginOrLink) {
        await wallets[0].loginOrLink();
        break;
      }
    }
  };

  const shorten = (addr) => addr.slice(0, 5) + "..." + addr.slice(-4);

  if (authenticated) {
    const dicebearAvatar = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${address}`;

    return (
      <div ref={containerRef} className="relative inline-block text-left">
        {/* BUTTON */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="
            inline-flex items-center gap-2 px-5 py-2 font-semibold text-white
            rounded-full backdrop-blur-lg
            bg-gradient-to-br from-blue-900/50 to-blue-600/30
            border border-blue-400/30 shadow-md transition
            hover:shadow-lg
          "
        >
          <img
            src={dicebearAvatar}
            alt="Avatar"
            className="w-6 h-6 rounded-full border border-white/20"
          />
          {shorten(address)}
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* POPOVER DROPDOWN */}
        {dropdownOpen && (
          <div
            className="
              absolute right-0 mt-2 w-48
              bg-gradient-to-br from-blue-800/40 to-blue-600/20
              border border-blue-400/20
              backdrop-blur-xl shadow-2xl rounded-2xl
              overflow-hidden animate-fadeIn
            "
          >
            <div className="px-5 py-3 text-sm text-cyan-300 border-b border-blue-400/20">
              {Math.floor(ctsBalance).toLocaleString()} $ctS
            </div>
            <button
              className="flex items-center gap-2 w-full px-5 py-3 text-left text-white hover:bg-blue-700/30 transition"
              onClick={() => {
                router.push("/profile");
                setDropdownOpen(false);
              }}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              className="flex items-center gap-2 w-full px-5 py-3 text-left text-white hover:bg-blue-700/30 transition"
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* ANIMATION */}
        <style jsx global>{`
          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="
        inline-flex items-center justify-center px-5 py-2 font-semibold text-white
        rounded-full backdrop-blur-lg bg-gradient-to-br from-blue-900/50 to-blue-600/30
        border border-blue-400/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl
      "
    >
      Connect Wallet
    </button>
  );
}
