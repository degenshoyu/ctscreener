import { useConnectWallet } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { PiggyBank } from "lucide-react";

export default function WalletButton() {
  const { connectWallet } = useConnectWallet();
  const { wallets } = useSolanaWallets();
  const { authenticated, user, logout } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState("bottts");
  const router = useRouter();
  const [ctsBalance, setCtsBalance] = useState(0);

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
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="px-4 py-2 rounded bg-white/5 text-white hover:bg-white/10 border border-white/20 flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
        <img
          src={dicebearAvatar}
          alt="Avatar"
          className="w-6 h-6 rounded-full border border-white/20"
        />
          {shorten(address)}
          <ChevronDown className="w-4 h-4" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded shadow-lg w-32 z-50 border border-gray-700">
            <div className="px-4 py-2 text-sm text-purple-400 border-b border-gray-700">
              {Math.floor(ctsBalance).toLocaleString()} $ctS
            </div>
           <button
              className="w-full px-4 py-2 hover:bg-gray-700 rounded text-left transition-colors"
              onClick={() => {
                router.push("/profile");
                setDropdownOpen(false);
              }}
            >
              Profile
            </button>
            <button
              className="w-full px-4 py-2 hover:bg-gray-700 rounded text-left transition-colors"
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
      onClick={handleLogin}
    >
      Login
    </button>
  );
}
