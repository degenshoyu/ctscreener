import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function TokenSearchBoxImpact({
  address,
  setAddress,
  walletAddress,
  onTokenInfo,
  onTweets,
  onSearch,
  onTweetCount,
  shillerWindow,
  setJobId,
  customStart,
  customEnd,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeTicker, setIncludeTicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet and hold at least 100,000 $ctS to use High Impact.",
        variant: "destructive",
        duration: 999999,
      });
    }
  }, [walletAddress]);

  const pollJob = async (jobId, retries = 1500) => {
    if (retries <= 0) return;
    try {
      const res = await fetch(`/api/jobProxy?job_id=${jobId}`);
      const json = await res.json();
      if (json.status === "completed" && Array.isArray(json.scored_tweets)) {
        onTweets(json.scored_tweets);
        onSearch(false);
        setLoading(false);
      } else if (json.status === "processing") {
        if (typeof json.tweets_count === "number") {
          onTweetCount(json.tweets_count);
        }
        setTimeout(() => pollJob(jobId, retries - 1), 3000);
      }
    } catch (err) {
      onSearch(false);
      setError("Polling failed");
    }
  };

  const handleSearch = async () => {
    if (loading || !walletAddress) return;
    setLoading(true);
    onSearch(true);
    try {
      const balanceRes = await fetch(`/api/checkBalance?wallet=${walletAddress}`);
      const { balance } = await balanceRes.json();
      if (balance < 100000) {
        toast({
          title: "Insufficient $ctS",
          description: "You need at least 100,000 $ctS to use this feature.",
          variant: "destructive",
          duration: 999999,
        });
        onSearch(false);
        setLoading(false);
        return;
      }

      const res = await axios.get(`https://api.dexscreener.com/tokens/v1/solana/${address.trim()}`);
      const pairs = res.data;
      const match = pairs.find(p => p.baseToken.address === address.trim() || p.quoteToken.address === address.trim());
      if (!match) throw new Error("No matching token pair");

      const token = match.baseToken.address === address.trim() ? match.baseToken : match.quoteToken;
      const tokenInfo = {
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        priceUsd: match.priceUsd,
        marketCap: match.marketCap,
        fdv: match.fdv,
        pairUrl: match.url,
        liquidityUsd: match.liquidity.usd,
        txns: match.txns,
        volume: match.volume,
        priceChange: match.priceChange,
        pairCreatedAt: match.pairCreatedAt,
        imageUrl: match.info?.imageUrl || null,
      };
      onTokenInfo(tokenInfo);

      await fetch("/api/saveTokenInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokenInfo),
      });

      const twitterRes = await fetch("/api/twitterSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": walletAddress,
        },
        body: JSON.stringify({
          tokenAddress: token.address,
          pairCreatedAt: match.pairCreatedAt,
          tokenInfo,
          mode: "impact",
          window: shillerWindow,
          includeTicker,
          ...(shillerWindow === "custom" && {
            customStart,
            customEnd,
          }),
        }),
      });

      const twitterJson = await twitterRes.json();
      if (twitterJson.job_id) {
        setJobId(twitterJson.job_id);
        pollJob(twitterJson.job_id);
      }
    } catch (err) {
      console.error("Search error", err);
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
      onSearch(false);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center rounded-full border border-blue-400/30 backdrop-blur-md bg-gradient-to-br from-blue-900/50 to-blue-600/30 shadow px-4 py-2">
        <input
          type="text"
          placeholder="Enter Solana token address..."
          className="flex-1 px-5 py-3 bg-transparent text-white placeholder:text-white/50 focus:outline-none rounded-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !address.trim() || !walletAddress}
          className="px-5 py-3 ml-2 rounded-full font-semibold text-white backdrop-blur-lg bg-gradient-to-br from-blue-900/50 to-blue-600/30 border border-blue-400/30 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="mt-3 flex">
        <button
          onClick={() => setIncludeTicker(!includeTicker)}
          className={`px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-300 ${includeTicker ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md" : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"}`}
        >
          Include ticker
          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black">testing</span>
        </button>
      </div>
      {error && <p className="text-red-500 text-sm ml-2 mt-1">{error}</p>}
    </div>
  );
}
