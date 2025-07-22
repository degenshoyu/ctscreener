"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useToast } from "@/hooks/use-toast";

export default function ApiKeyPage() {
  const { authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();
  const address = wallets[0]?.address;
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState("-");
  const [plan, setPlan] = useState("-");
  const [usage, setUsage] = useState("-");
  const [quota, setQuota] = useState("10,000");
  const [status, setStatus] = useState("Inactive");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const backendUrl = "https://api.ctscreener.xyz";
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!authenticated || !address) {
      if (!hasWarned.current) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to generate your API Key.",
          variant: "destructive",
        });
        hasWarned.current = true;
      }
      return;
    }

    hasWarned.current = false;

    const run = async () => {
      console.log("🚀 Running API Key fetch with wallet:", address);
      setLoading(true);
      setError(null);

      try {
        const balRes = await fetch(`/api/checkBalance?wallet=${address}`);
        const balData = await balRes.json();
        setBalance(balData.balance || 0);

        if (balData.balance < 10_000) {
          toast({
            title: "Insufficient $ctS",
            description: "You need at least 10,000 $ctS to generate an API Key.",
            variant: "destructive",
          });
          return;
        }

        let token = localStorage.getItem(`ct_api_key_${address}`);
        if (!token) {
          const res = await fetch(`${backendUrl}/api/request-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: address }),
          });
          const data = await res.json();
          if (!res.ok || !data.success || !data.token) {
            throw new Error(data.error || "Failed to fetch key");
          }
          token = data.token;
          localStorage.setItem(`ct_api_key_${address}`, token);
        }

        setApiKey(token);

        const payload = JSON.parse(atob(token.split(".")[1]));
        setPlan(payload.plan || "-");

        const statusRes = await fetch(`${backendUrl}/api/user-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statusData = await statusRes.json();
        setUsage(statusData.usage_count || "-");
        setQuota(statusData.quota || "10,000");
        setStatus(statusData.is_active ? "Active" : "Inactive");

      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [authenticated, address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    alert("✅ API Key copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <Head>
        <title>API Key - ctScreener</title>
        <meta name="description" content="Your API Key and usage." />
      </Head>

      <div className="text-white px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow">
          Your API Key
        </h1>

        <p className="text-blue-100/80 mb-6">
          💰 <span className="font-semibold">{balance.toLocaleString()}</span> $ctS balance
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 p-4 rounded-lg mb-6 text-red-300">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-blue-400/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-2xl space-y-8 transition-transform duration-300 hover:scale-[1.02]">
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">🔐 Your API Key</h2>
            <div className="bg-gradient-to-r from-blue-700/30 to-blue-500/30 border border-blue-400/40 rounded-xl px-5 py-4 font-mono text-lg text-green-300 break-all select-all shadow-inner">
              {loading ? "Loading..." : showKey ? apiKey : "•••••••••••••••••••••••••••"}
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-colors shadow"
                disabled={!apiKey || apiKey === "-"}
              >
                {showKey ? "Hide" : "Show"}
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-colors shadow"
                disabled={!apiKey || apiKey === "-"}
              >
                Copy Key
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">📊 Usage Summary</h2>
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-blue-400/30 rounded-xl p-6 space-y-3 shadow-inner">
              <div className="flex justify-between text-base text-gray-300">
                <span>Status</span>
                <span className={status === "Active" ? "text-green-400" : "text-yellow-400"}>
                  {status}
                </span>
              </div>
              <div className="flex justify-between text-base text-gray-300">
                <span>Plan</span>
                <span>{plan}</span>
              </div>
              <div className="flex justify-between text-base text-gray-300">
                <span>Used</span>
                <span>{usage}</span>
              </div>
              <div className="flex justify-between text-base text-gray-300">
                <span>Monthly Quota</span>
                <span>{quota}</span>
              </div>
            </div>
          </div>

<p className="text-sm text-yellow-200/90 mt-4">
  📖 Learn how to use the API by visiting{" "}
  <a
    href="https://api.ctscreener.xyz/docs/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-blue-400 hover:text-blue-300"
  >
    https://api.ctscreener.xyz/docs/
  </a>.
</p>

        </div>
      </div>
    </DashboardLayout>
  );
}
