import { useEffect, useState } from "react";
import axios from "axios";

export default function TokenSearchBox({ address, setAddress, walletAddress, isLoading, setIsLoading, onTokenInfo, onTweets, onSearch,onTweetCount }) {
  console.log("🧩 TokenSearchBox mounted");
  const [error, setError] = useState("");
  const [earliestTweets, setEarliestTweets] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [loadingTweets, setLoadingTweets] = useState(false);

  const pollJobResult = async (jobId, retries = 1500) => {
    if (retries <= 0) {
      console.warn("🛑 Max retries reached.");
      onSearch(false);
      setError("Tweet scan timed out – this token may have too many related posts.");
      return;
    }

    try {
      const jobRes = await fetch(`/api/jobProxy?job_id=${jobId}`);
      const jobJson = await jobRes.json();
      console.log("🔁 Job polling result:", jobJson);

      if (jobJson.status === "completed" && Array.isArray(jobJson.tweets)) {
        const sorted = [...jobJson.tweets].sort(
          (a, b) => new Date(a.datetime) - new Date(b.datetime)
        );
        const earliestFive = sorted.slice(0, 5);

        setEarliestTweets(earliestFive);
        onTweets(earliestFive);

        console.log("✅ Fetched earliest tweets:", jobJson.tweets.slice(0, 5));
        onSearch(false);
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
      }
    } catch (err) {
      console.error("❌ Failed to poll job:", err);
      onSearch(false);
      setError("Polling failed.")
    }
  };

  const handleSearch = async () => {
    console.log("🧪 handleSearch triggered");
    console.log("🔍 Starting token search for:", address);
    onSearch(true);
    setError("");
    try {
      const url = `https://api.dexscreener.com/tokens/v1/solana/${address.trim()}`;
      console.log("🌐 Fetching token data from:", url);
      const res = await axios.get(url);
      const pairs = res.data;
      console.log("📦 Received pairs:", pairs);

      if (!Array.isArray(pairs) || pairs.length === 0) {
        setError("Token not found.");
        onTokenInfo(null);
        return;
      }

      const match = pairs.find(pair =>
        pair.baseToken.address === address.trim() || pair.quoteToken.address === address.trim()
      );

      if (!match) {
        setError("Token found, but no matching pair.");
        onTokenInfo(null);
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
          tokenInfo
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
    setError("Failed to fetch token info.");
    onTokenInfo(null);
  } finally {
    setIsLoading(false);
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
        disabled={isLoading || !address.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
    </div>
);
}
