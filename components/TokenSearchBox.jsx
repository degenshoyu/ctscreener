import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function TokenSearchBox({ address, setAddress, walletAddress, isLoading, setIsLoading, onTokenInfo, onTweets, onSearch,onTweetCount, activeTab, shillerWindow }) {
  console.log("🧩 TokenSearchBox mounted");
  const [error, setError] = useState("");
  const [earliestTweets, setEarliestTweets] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (activeTab === "shiller" && !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet and hold at least 10,000 $ctS to use Top Shillers.",
        variant: "destructive",
        duration: 999999,
      });
    }
  }, [activeTab, walletAddress]);

  const pollJobResult = async (jobId, retries = 1500) => {
    if (retries <= 0) {
      console.warn("🛑 Max retries reached.");
      onSearch(false);
      setError("Tweet scan timed out – this token may have too many related posts.");
      setIsSearching(false);
      return;
    }

    try {
      const jobRes = await fetch(`/api/jobProxy?job_id=${jobId}`);
      const jobJson = await jobRes.json();
      console.log("🔁 Job polling result:", jobJson);

      if (jobJson.status === "completed" && Array.isArray(jobJson.tweets)) {
        let selectedTweets = [];

        if (activeTab === "earliest") {
          selectedTweets = [...jobJson.tweets]
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .slice(0, 5);
        } else if (activeTab === "shiller") {
          selectedTweets = (jobJson.scored_tweets || []).slice(0, 10);
  } else {
    selectedTweets = jobJson.tweets.slice(0, 5);
        }

        setEarliestTweets(selectedTweets);
        onTweets(selectedTweets);

        console.log("✅ Fetched earliest tweets:", selectedTweets);
        onSearch(false);
        setIsSearching(false);
      } else if (jobJson.status === "processing") {
        console.log("⏳ Job still processing, retrying...");
        if (onTweetCount && typeof jobJson.tweets_count === "number") {
          onTweetCount(jobJson.tweets_count);
          setEarliestTweets([{ tweet_id: null, content: `🧪 Scanning tweets... ${jobJson.tweets_count} Tweets collected via ctScreener Twitter API.` }]);
        }
        setTimeout(() => pollJobResult(jobId, retries - 1), 3000);
      } else {
        console.warn("⚠️ Unexpected job status:", jobJson);
        onSearch(false);
        setIsSearching(false);
      }
    } catch (err) {
      console.error("❌ Failed to poll job:", err);
      onSearch(false);
      setError("Polling failed.")
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    console.log("🧪 handleSearch triggered");
    console.log("🔍 Starting token search for:", address);

    if (isSearching) {
      console.log("⏳ Already loading, skip click");
      return;
    }

    if (activeTab === "shiller" && !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet and hold at least 10,000 $ctS to use Top Shillers.",
        variant: "destructive",
        duration: 999999,
      });
      return;
    }

    setIsSearching(true);

    try {

    if (activeTab === "shiller") {
      console.log("🔑 Checking $ctS balance for wallet:", walletAddress);
      const balanceRes = await fetch(`/api/checkBalance?wallet=${walletAddress}`);
      const { balance } = await balanceRes.json();
      console.log("💰 Wallet $ctS balance:", balance);

    if (balance < 10_000) {
      toast({
        title: "Insufficient $ctS",
        description: "You need at least 10,000 $ctS to use Top Shillers.",
        variant: "destructive",
        duration: 999999,
      });

      setTimeout(() => {
        setIsSearching(false);
      }, 5000);

      return;
    }
  }

      onSearch(true);

      const url = `https://api.dexscreener.com/tokens/v1/solana/${address.trim()}`;
      console.log("🌐 Fetching token data from:", url);
      const res = await axios.get(url);
      const pairs = res.data;
      console.log("📦 Received pairs:", pairs);

      if (!Array.isArray(pairs) || pairs.length === 0) {
        toast({
          title: "Token not found",
          description: "Could not find the token on DexScreener.",
          variant: "destructive",
          duration: 999999,
        });
        onSearch(false);
        setIsSearching(false);
        return;
      }

      const match = pairs.find(pair =>
        pair.baseToken.address === address.trim() || pair.quoteToken.address === address.trim()
      );

      if (!match) {
        toast({
        title: "Pair not found",
        description: "Token found, but no matching pair.",
        variant: "destructive",
        duration: 999999,
      });
      onSearch(false);
      setIsSearching(false);
      return;
      }

      const token = match.baseToken.address === address.trim() ? match.baseToken : match.quoteToken;
      console.log("🎯 Matched token:", token);

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
      console.log("💾 Saving token info:", tokenInfo);

      onTokenInfo(tokenInfo);

      await fetch("/api/saveTokenInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });

      console.log("📨 Triggering Twitter search...");

      console.log("Using walletAddress:", walletAddress);

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
          mode: activeTab,
          window: activeTab === "shiller" ? shillerWindow : null
        }),
      });

      const twitterJson = await twitterRes.json();
      console.log("🧾 Twitter response:", twitterJson);

      if (twitterJson.job_id) {
        console.log("Twitter scan started. Job ID:", twitterJson.job_id);
        setLoadingTweets(true);
        pollJobResult(twitterJson.job_id);
    }
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to fetch token info.",
      variant: "destructive",
      duration: 999999,
    });
    onTokenInfo(null);
  } finally {
  }
};

  return (
    <div className="w-full mb-6">

    {/* 原始输入框 + 搜索按钮区域 */}
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Enter Solana token address..."
        className="px-4 py-2 border border-gray-600 bg-[#191B2A] text-white w-full rounded-md"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        onClick={() => {
          console.log("🖱️ Button clicked");
          handleSearch();
        }}
        disabled={
          isSearching || !address.trim() ||
          (activeTab === "shiller" && !walletAddress)
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
    </div>
);
}
