/// pages/high-impact.jsx

import Head from "next/head";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function HighImpactCallerPage() {
  const [address, setAddress] = useState("");
  const [range, setRange] = useState("24h");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeTicker, setIncludeTicker] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!address) {
      alert("Please enter a token address");
      return;
    }

    let startTime, endTime;

    if (range === "custom") {
      if (!start || !end) {
        alert("Please select start and end for custom range");
        return;
      }
      // Date-only: set to midnight UTC
      startTime = new Date(start + "T00:00:00Z").toISOString();
      endTime = new Date(end + "T23:59:59Z").toISOString();
    } else {
      const now = new Date();
      endTime = now.toISOString();
      if (range === "24h") {
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      } else if (range === "7d") {
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/twitterSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress: address,
          startTime,
          endTime,
          includeTicker, // 👈 新增字段
        }),
      });
      const json = await res.json();
      if (json.tweets && Array.isArray(json.tweets)) {
        const enriched = await Promise.all(
          json.tweets.map(async (tweet) => {
            const ts = new Date(tweet.datetime).toISOString();
            try {
              const priceRes = await fetch("/api/historical-price", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mint: address,
                  timestamp: ts,
                }),
              });
              const priceJson = await priceRes.json();
              return { ...tweet, price: priceJson.price ?? null };
            } catch {
              return { ...tweet, price: null };
            }
          }),
        );
        setTweets(enriched);
      } else {
        alert("No tweets found");
      }
    } catch (err) {
      console.error(err);
      alert("Error searching tweets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>ctScreener - High Impact Callers</title>
      </Head>

      <div className="text-white px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.3)]">
          High Impact Callers
        </h1>
        <p className="text-lg text-purple-100/80 italic max-w-lg mb-6">
          Identify the Tweeters driving your coin’s price
        </p>

        <div className="flex flex-col gap-4 max-w-xl">
          <input
            type="text"
            placeholder="Enter Solana token address..."
            className="px-5 py-3 rounded-full bg-transparent text-white border border-purple-400/30 backdrop-blur-md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex gap-2">
            {["24h", "7d", "custom"].map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  range === option
                    ? "bg-gradient-to-br from-purple-500/50 to-pink-400/30 text-white shadow-md"
                    : "border border-purple-400/30 text-purple-100 hover:bg-purple-400/10 backdrop-blur-md"
                }`}
              >
                {option === "24h" ? "Last 24h" : option === "7d" ? "Last 7 days" : "Custom"}
              </button>
            ))}
          </div>

          {range === "custom" && (
            <div className="flex gap-4">
              <input
                type="date"
                className="flex-1 px-5 py-3 rounded-full bg-transparent text-white border border-purple-400/30 backdrop-blur-md"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              <input
                type="date"
                className="flex-1 px-5 py-3 rounded-full bg-transparent text-white border border-purple-400/30 backdrop-blur-md"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={() => setIncludeTicker(!includeTicker)}
            className={`
              px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-300
              ${includeTicker
                ? "bg-gradient-to-br from-purple-500/50 to-pink-400/30 text-white shadow-md"
                : "border border-purple-400/30 text-purple-100 hover:bg-purple-400/10 backdrop-blur-md"
              }
            `}
          >
            Include ticker
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-black">testing</span>
          </button>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-5 py-3 rounded-full font-semibold text-white bg-gradient-to-br from-purple-900/50 to-pink-600/30 border border-purple-400/30 shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {tweets.length > 0 && (
          <div className="mt-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Results:</h2>
            <ul className="space-y-4">
              {tweets.map((tweet, idx) => (
                <li
                  key={idx}
                  className="p-4 border border-purple-400/30 rounded-lg backdrop-blur-md"
                >
                  <p className="text-sm text-purple-100/80">
                    🕒 {tweet.datetime}
                  </p>
                  <p className="text-white mb-2">{tweet.content}</p>
                  <p className="text-green-400">
                    Swap Price:{" "}
                    {tweet.price ? `$${tweet.price.toFixed(6)}` : "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

