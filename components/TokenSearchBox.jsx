import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function TokenSearchBox({ address, setAddress, walletAddress, isLoading, setIsLoading, onTokenInfo, onTweets, onSearch,onTweetCount, activeTab, shillerWindow, setJobId }) {
  console.log("🧩 TokenSearchBox mounted");
  const [error, setError] = useState("");
  const [earliestTweets, setEarliestTweets] = useState([]);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [includeTicker, setIncludeTicker] = useState(false);

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
            .slice(0, 20);
        } else if (activeTab === "shiller") {
          selectedTweets = (jobJson.scored_tweets || []).slice(0, 10);
  } else {
    selectedTweets = jobJson.tweets.slice(0, 20);
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
          window: activeTab === "shiller" ? shillerWindow : null,
          includeTicker,
        }),
      });

      const twitterJson = await twitterRes.json();
      console.log("🧾 Twitter response:", twitterJson);

      if (twitterJson.job_id) {
        console.log("Twitter scan started. Job ID:", twitterJson.job_id);
        setLoadingTweets(true);
        setJobId(twitterJson.job_id);
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

    <div className="
      flex items-center
      rounded-full
      border border-blue-400/30
      backdrop-blur-md
      bg-gradient-to-br from-blue-900/50 to-blue-600/30
      shadow-[0_0_20px_rgba(96,165,250,0.1)]
      px-4 py-2
    ">
      <input
        type="text"
        placeholder="Enter Solana token address..."
        className="
         flex-1 px-5 py-3
         bg-transparent text-white
         placeholder:text-white/50
         focus:outline-none
        rounded-full
        "
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
        className="
         px-5 py-3 ml-2
         rounded-full
         font-semibold text-white
         backdrop-blur-lg
         bg-gradient-to-br from-blue-900/50 to-blue-600/30
         border border-blue-400/30 shadow-xl
         transition-all duration-300
         hover:scale-105 hover:shadow-2xl disabled:opacity-50
        "
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </div>

<div className="mt-3 flex">
  <button
    onClick={() => setIncludeTicker(!includeTicker)}
    className={`
      px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-300
      ${includeTicker
        ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
        : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"
      }
    `}
  >
    Include ticker
    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black">testing</span>
  </button>
</div>
        {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
);
}
