import { useEffect, useState } from "react";
import axios from "axios";

export default function TokenSearchBox({ address, setAddress, isLoading, setIsLoading, onTokenInfo, onTweets, onSearch }) {
  console.log("🧩 TokenSearchBox mounted");
  const [error, setError] = useState("");
  const [earliestTweets, setEarliestTweets] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [loadingTweets, setLoadingTweets] = useState(false);

  const pollJobResult = async (jobId, retries = 50) => {
    if (retries <= 0) {
      console.warn("🛑 Max retries reached.");
      return;
    }

    try {
      const jobRes = await fetch(`/api/jobProxy?job_id=${jobId}`);
      const jobJson = await jobRes.json();
      console.log("🔁 Job polling result:", jobJson);

      if (jobJson.status === "completed" && Array.isArray(jobJson.tweets)) {
        setEarliestTweets(jobJson.tweets.slice(0, 5));
        onTweets(jobJson.tweets.slice(0, 5));
        console.log("✅ Fetched earliest tweets:", jobJson.tweets.slice(0, 5));
        setLoadingTweets(false);
      } else if (jobJson.status === "processing") {
        console.log("⏳ Job still processing, retrying...");
        setTimeout(() => pollJobResult(jobId, retries - 1), 3000);
      } else {
        console.warn("⚠️ Unexpected job status:", jobJson);
        setLoadingTweets(false);
      }
    } catch (err) {
      console.error("❌ Failed to poll job:", err);
    }
  };

  const handleSearch = async () => {
    console.log("🧪 handleSearch triggered");
    console.log("🔍 Starting token search for:", address);
    setIsLoading(true);
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
      const twitterRes = await fetch("/api/twitterSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress: token.address,
          pairCreatedAt: match.pairCreatedAt,
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
    {/* 🔄 加载动画 */}
    {loadingTweets && (
      <div className="flex items-center text-gray-400 mb-2 animate-pulse">
        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Scanning tweets related to this token... This may take up to a minute.</span>
      </div>
    )}

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
