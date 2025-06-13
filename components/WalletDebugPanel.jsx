"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";

export default function WalletDebugPanel() {
  const { authenticated, user, ready: privyReady } = usePrivy();
  const { wallets, ready: solanaReady } = useSolanaWallets();

  useEffect(() => {
    console.log("🔎 privyReady:", privyReady);
    console.log("🔐 authenticated:", authenticated);
    console.log("👤 user:", user);
    console.log("🪙 solanaReady:", solanaReady);
    console.log("👛 wallets:", wallets);
  }, [privyReady, authenticated, user, solanaReady, wallets]);

  return (
    <div className="bg-zinc-900 text-white p-4 text-sm rounded-lg space-y-2 mt-4">
      <div>✅ Privy Ready: <strong>{String(privyReady)}</strong></div>
      <div>🔐 Authenticated: <strong>{String(authenticated)}</strong></div>
      <div>🪙 Solana Ready: <strong>{String(solanaReady)}</strong></div>
      <div>👛 Wallet Count: <strong>{wallets.length}</strong></div>
      <pre className="bg-zinc-800 p-2 rounded overflow-auto max-h-48">
        {JSON.stringify(wallets, null, 2)}
      </pre>
    </div>
  );
}

