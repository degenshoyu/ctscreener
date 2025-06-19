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

  const pagedTweets = useMemo(() => {
    return [...tweets].slice((page - 1) * pageSize, page * pageSize);
  }, [tweets, page]);

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
        <h1 className="text-3xl font-bold mb-2">Coin Analyst</h1>
        <p className="text-gray-400 mb-6">
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
          />
        </div>

        <div className="mt-6 max-w-xl">
          <RadioGroup
            value={activeTab}
            onValueChange={(val) => setActiveTab(val)}
            className="flex items-center gap-8"
          >
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="earliest" id="r1" />
                <label htmlFor="r1" className="text-sm text-gray-300">
                  Early callers
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shiller" id="r2" />
                <label htmlFor="r2" className="text-sm text-gray-300">
                  Top shillers
                </label>

                {activeTab === "shiller" && (
                  <Select.Root
                    value={shillerWindow}
                    onValueChange={setShillerWindow}
                  >
                    <Select.Trigger className="inline-flex items-center justify-between px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600">
                      <Select.Value />
                      <Select.Icon className="ml-1">
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Content className="bg-gray-800 text-white text-sm border border-gray-600 rounded shadow">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value="24h"
                          className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer"
                        >
                          <Select.ItemText>Last 24h</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="7d"
                          className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer"
                        >
                          <Select.ItemText>Last 7d</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="30d"
                          className="px-3 py-1 rounded cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent hover:bg-gray-700"
                          disabled
                        >
                          <Select.ItemText>Last 30d</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="significant" id="r3" disabled />
                    <label htmlFor="r3" className="text-sm text-gray-500">
                      High-impact callers
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-sm font-semibold bg-yellow-500 text-black px-3 py-2 rounded-md shadow-lg"
                >
                  🚧 Coming soon
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RadioGroup>

          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm text-gray-400">View tweets as</label>
            <button
              onClick={() => setViewMode("embed")}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded ${viewMode === "embed" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              <LayoutGrid size={16} /> Embed Card
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              <List size={16} /> Tweet List
            </button>
          </div>
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
            <TweetList tweets={pagedTweets} viewMode={viewMode} />
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
