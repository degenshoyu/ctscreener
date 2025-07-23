/// pages/high-impact.jsx

import Head from "next/head";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TokenSearchBoxImpact from "@/components/TokenSearchBoxImpact";
import TokenInfoCard from "@/components/TokenInfoCard";
import TweetListImpact from "@/components/TweetListImpact";
import ViewModeToggle from "@/components/ViewModeToggle";
import { usePrivy } from "@privy-io/react-auth";

export default function HighImpactPage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [address, setAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [tweetCount, setTweetCount] = useState(0);
  const [scanningTweets, setScanningTweets] = useState(false);
  const [viewMode, setViewMode] = useState("embed");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [jobId, setJobId] = useState(null);
  const [dateOption, setDateOption] = useState("24h");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const pagedTweets = useMemo(() => {
    return [...tweets].slice((page - 1) * pageSize, page * pageSize);
  }, [tweets, page]);

  const allTweets = tweets;

  return (
    <DashboardLayout>
      <Head>
        <title>ctScreener - High Impact Tweets</title>
        <meta
          name="description"
          content="Analyze high-impact tweets mentioning Solana tokens."
        />
      </Head>

      <div className="text-white px-4 py-8">
        <h1
          className="text-5xl font-extrabold mb-2 bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]"
        >
          High Impact
        </h1>
        <p className="text-lg text-blue-100/80 italic animate-fadeInSlow max-w-lg mb-6">
          Analyze token mentions that moved the market.
        </p>

        <div className="flex items-center gap-4 max-w-xl">
          <TokenSearchBoxImpact
            address={address}
            setAddress={setAddress}
            walletAddress={walletAddress}
            onTokenInfo={setTokenInfo}
            onTweets={setTweets}
            onSearch={setScanningTweets}
            onTweetCount={setTweetCount}
            shillerWindow={dateOption}
            setJobId={setJobId}
            customStart={customStart}
            customEnd={customEnd}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          {[
            { label: "Last 24h", value: "24h" },
            { label: "Last 7d", value: "7d" },
            { label: "Custom (≤10d)", value: "custom" },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDateOption(value)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all duration-300 ${
                dateOption === value
                  ? "bg-gradient-to-br from-blue-400/60 to-cyan-300/30 text-white shadow"
                  : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      {dateOption === "custom" && (
        <div className="flex gap-4 mt-3 max-w-xl">
          <div>
            <label className="block text-sm text-white/70 mb-1">Start Date</label>
            <input
              type="date"
              className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={customEnd || undefined}
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">End Date</label>
            <input
              type="date"
              className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              min={customStart || undefined}
            />
          </div>
        </div>
      )}
        <div className="mt-6">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {tokenInfo && (
          <div className="mt-6">
            <TokenInfoCard tokenInfo={tokenInfo} />
          </div>
        )}

        {scanningTweets && (
          <div className="mt-4 max-w-xl">
            <div className="flex items-center text-gray-400 mb-2">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="text-sm">
                <span className="text-blue-300">ctScreener</span> is scanning tweets...
              </span>
            </div>
            <div className="text-sm text-gray-300 ml-7">
              {tweetCount > 0
                ? `🔎 Collected ${tweetCount} tweet${tweetCount === 1 ? "" : "s"} so far.`
                : "🔎 Waiting for tweets to appear..."}
            </div>
          </div>
        )}

        {tweets.length > 0 && (
          <div className="mt-6 max-w-full">
            <TweetListImpact
              tweets={allTweets}
              viewMode={viewMode}
              coinName={tokenInfo?.name || "Unknown"}
              ticker={tokenInfo?.symbol || ""}
              contractAddress={tokenInfo?.address || ""}
              mode={`High Impact (${dateOption})`}
              scannedAt={new Date().toISOString()}
              jobId={jobId}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
