import Head from "next/head";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import TokenSearchBox from "@/components/TokenSearchBox";
import TokenInfoCard from "@/components/TokenInfoCard";
import TweetList from "@/components/TweetList";
import { usePrivy } from "@privy-io/react-auth";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { List, LayoutGrid } from "lucide-react";
import ViewModeToggle from "@/components/ViewModeToggle";

export default function HomePage() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [address, setAddress] = useState("");

  const [activeTab, setActiveTab] = useState("earliest");
  const [shillerWindow, setShillerWindow] = useState("24h");
  const [isLoading, setIsLoading] = useState(false);

  const [tokenInfo, setTokenInfo] = useState(null);

  const [earliestTweets, setEarliestTweets] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [scanningTweets, setScanningTweets] = useState(false);
  const [tweetCount, setTweetCount] = useState(0);

  const [viewMode, setViewMode] = useState("embed");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const shillerWindows = ["24h", "7d", "30d"];

  const pagedTweets = useMemo(() => {
    return [...tweets].slice((page - 1) * pageSize, page * pageSize);
  }, [tweets, page]);

  const [jobId, setJobId] = useState(null);

  return (
    <DashboardLayout>
      <Head>
        <title>ctScreener - Find Early Callers</title>
        <meta
          name="description"
          content="Discover earliest callers of top Solana tokens on Twitter."
        />
        <meta property="og:title" content="ctScreener" />
        <meta
          property="og:description"
          content="Provide Twitter data of Solana tokens."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/cover.png" />
      </Head>
      <div className="text-white px-4 py-8">
        <h1
          className="
          text-5xl font-extrabold mb-2
          bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500
          bg-clip-text text-transparent
          drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]
        "
        >
          Coin Analyst
        </h1>
        <p className="text-lg text-blue-100/80 italic animate-fadeInSlow max-w-lg mb-6">
          Discover early callers of winning coins on X.
        </p>

        <div className="flex items-center gap-4 max-w-xl">
          <TokenSearchBox
            address={address}
            setAddress={setAddress}
            walletAddress={walletAddress}
            onTokenInfo={setTokenInfo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onTweets={setTweets}
            onSearch={setScanningTweets}
            onTweetCount={setTweetCount}
            activeTab={activeTab}
            shillerWindow={shillerWindow}
            setJobId={setJobId}
          />
        </div>

        <TooltipProvider>
          <div>
            {/* === Option Buttons === */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setActiveTab("earliest")}
                className={`
          px-4 py-2 rounded-full font-medium transition-all duration-300
          ${
            activeTab === "earliest"
              ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
              : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"
          }
        `}
              >
                Early callers
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("shiller")}
                  className={`
            px-4 py-2 rounded-full font-medium transition-all duration-300
            ${
              activeTab === "shiller"
                ? "bg-gradient-to-br from-blue-500/50 to-blue-400/30 text-white shadow-md"
                : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"
            }
          `}
                >
                  Top shillers
                </button>

                {activeTab === "shiller" && (
                  <div className="flex items-center gap-2 ml-2">
                    {shillerWindows.map((w) => (
                      <button
                        key={w}
                        onClick={() => setShillerWindow(w)}
                        disabled={w === "30d"}
                        className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                  ${w === "30d" ? "opacity-50 cursor-not-allowed" : ""}
                  ${
                    shillerWindow === w
                      ? "bg-gradient-to-br from-blue-400/60 to-cyan-300/30 text-white shadow"
                      : "border border-blue-400/30 text-blue-100 hover:bg-blue-400/10 backdrop-blur-md"
                  }
                `}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* === View tweets as === */}
            <div className="mt-6">
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </TooltipProvider>

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
                <span className="text-blue-300">ctScreener</span> is scanning
                tweets...
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
            <TweetList
              tweets={pagedTweets}
              viewMode={viewMode}
              coinName={tokenInfo?.name || "Unknown"}
              ticker={tokenInfo?.symbol || ""}
              contractAddress={tokenInfo?.address || ""}
              mode={
                activeTab === "shiller"
                  ? `Top Shiller (${shillerWindow})`
                  : "Early Callers"
              }
              scannedAt={new Date().toISOString()}
              jobId={jobId}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * pageSize >= tweets.length}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
