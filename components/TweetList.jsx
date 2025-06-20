// components/TweetList.jsx
import React,{ useEffect, useState,useMemo,useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Repeat, Heart, BarChart, BadgeCheck } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { DataTable } from "@/components/DataTable";
import linkify from 'linkifyjs';
import Linkify from 'linkify-react';
import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';
import domtoimage from "dom-to-image";

const linkifyOptions = {
  target: '_blank',
  rel: 'noopener',
  className: 'text-blue-400 underline break-all',
  formatHref: {
    hashtag: (href) => `https://twitter.com/hashtag/${href.substring(1)}`,
    mention: (href) => `https://twitter.com/${href.substring(1)}`,
  },
};

export default function TweetList({ tweets, viewMode = "embed", coinName, ticker, contractAddress, mode, scannedAt, jobId }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateRunning = useRef(false);
  const tableRef = useRef();
  const summaryRef = useRef();

  const [fullTweets, setFullTweets] = useState([]);

  useEffect(() => {
    if (jobId) {
      fetch(`/api/jobProxy?job_id=${jobId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.tweets)) {
            setFullTweets(data.tweets);
          }
        })
        .catch(err => {
          console.error("❌ Failed to fetch full tweets:", err);
        });
    }
  }, [jobId]);

  const baseTweets = fullTweets.length > 0 ? fullTweets : tweets;

  const totalTweets = baseTweets.length;
  const totalViews = baseTweets.reduce((sum, t) => sum + (t.views || 0), 0);
  const totalEngagements = baseTweets.reduce(
    (sum, t) => sum + (t.retweets || 0) + (t.likes || 0) + (t.replies || 0),
      0
    );
  const verifiedTweets = baseTweets.filter((t) => t.isVerified);
  const totalTweetsVerified = verifiedTweets.length;
  const totalViewsVerified = verifiedTweets.reduce((sum, t) => sum + (t.views || 0), 0);
  const totalEngagementsVerified = verifiedTweets.reduce(
    (sum, t) => sum + (t.retweets || 0) + (t.likes || 0) + (t.replies || 0),
      0
    );

  const [loadingUsers, setLoadingUsers] = useState({});
  const [followersCache, setFollowersCache] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("followersCache");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [scanTimestamps, setScanTimestamps] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("scanTimestamps");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [userJobs, setUserJobs] = useState({});
  const userLocks = useRef({});

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";
    return num;
  };

  const updateScanTimestamp = (username, now) => {
    setScanTimestamps(prev => {
      const updated = { ...prev, [username]: now };
      localStorage.setItem("scanTimestamps", JSON.stringify(updated));
      return updated;
    });
  };

  const updateFollowersCache = (username, count) => {
    setFollowersCache(prev => {
      const updated = { ...prev, [username]: count };
      localStorage.setItem("followersCache", JSON.stringify(updated));
      return updated;
    });
  };

  const singleScan = async ( username) => {
    if (userLocks.current[username]) {
      console.log(`⏳ Already scanning ${username}, skip`);
      return;
    }

    userLocks.current[username] = true;
    setLoadingUsers(prev => ({ ...prev, [username]: true }));

    const now = Date.now();
    updateScanTimestamp(username, now);

    let job_id = userJobs[username];
    if (!job_id) {
      const res = await fetch("/api/fetchUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
        job_id = data.user_job_id;
        setUserJobs((prev) => ({ ...prev, [username]: job_id }));
    }

      const pollJob = async (jobId, retries = 200, retryZero = 3) => {
        if (retries <= 0) return;
        const res = await fetch(`/api/jobProxy?job_id=${jobId}`);
        const job = await res.json();
        if (job.status === "completed") {
          const newFollowers = job.user?.followers || 0;
          if (newFollowers === 0 && retryZero > 0) {
            console.log(`🔁 Retry because followers = 0, left: ${retryZero}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return pollJob(jobId, retries - 1, retryZero - 1);
          }
          updateFollowersCache(username, newFollowers);
          setScanTimestamps(prev => ({ ...prev, [username]: now }));
        } else if (job.status === "processing") {
          await new Promise(resolve => setTimeout(resolve, 3000));
          return pollJob(jobId, retries - 1);
        }
      };

    await pollJob(job_id);

    userLocks.current[username] = false;

    setLoadingUsers(prev => {
      const updated = { ...prev };
      delete updated[username];
      return updated;
    });
  };

const handleUpdate = async () => {
  if (isUpdating) {
    console.log("⏳ Update already running, skip new click.");
    return;
  }

  setIsUpdating(true);

  const now = Date.now();

  const currentPageRows = tableRef.current?.getRowModel().rows ?? [];
  const visibleTweets = currentPageRows.map(r => r.original);
  const uniqueUsers = [...new Set(visibleTweets.map(t => t.tweeter))];

  console.log("🔍 Will update:", uniqueUsers);

  for (const username of uniqueUsers) {
    const lastScan = scanTimestamps[username];
    const followers = followersCache[username];
    const now = Date.now();
    const needsUpdate = !lastScan || now - lastScan > 24 * 60 * 60 * 1000 || (followers ?? 0) === 0;

    if (!needsUpdate) {
      console.log(`✅ Skip scan for ${username}, already up to date.`);
      continue;
    }
    await singleScan(username);
  }

  console.log("✅ All done!");
  setIsUpdating(false);
};

  useEffect(() => {
    if (viewMode === "embed" && typeof window !== "undefined") {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          window.twttr && window.twttr.widgets.load();
        };
        document.body.appendChild(script);
      }
    }
  }, [tweets, viewMode]);
  console.log("🐦 TweetList received tweets:", tweets);

  if (!tweets || tweets.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

 const columns = useMemo(() => [
    {
      accessorKey: "tweeter",
      header: "Tweeter",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
        <a
          href={`https://twitter.com/${row.original.tweeter}`}
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          @{row.original.tweeter}
        </a>
          {row.original.isVerified && (
              <BadgeCheck className="w-4 h-4 text-sky-400" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "followers",
      header: () => (
        <div className="flex items-center gap-2">
          Followers
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-2 py-0.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const username = row.original.tweeter;
        const isLoading = !!loadingUsers[username];
        const followers = formatNumber(followersCache[username] ?? row.original.followers ?? 0);
        const now = Date.now();
        const lastScan = scanTimestamps[username];
        const needsUpdate = !lastScan || now - lastScan > 60 * 60 * 1000 || (followersCache[username] ?? 0) === 0;

          return (
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-1">
              <span className="text-base">{followers}</span>
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-blue-400"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
            </div>

            {!isLoading && !needsUpdate && (
              <span
                className="
                  bg-green-600
                  text-white
                  text-[10px]
                  px-1.5
                  py-0.5
                  rounded-full
                  leading-none
                  whitespace-nowrap
                "
                title="Up to date"
              >
                Up to date
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tweetId",
      header: "Tweet ID",
      cell: ({ row }) => (
        <a
          href={`https://twitter.com/${row.original.tweeter}/status/${row.original.tweetId}`}
          target="_blank"
          className="text-green-400 hover:underline"
        >
          {row.original.tweetId.slice(0, 3) + "..." + row.original.tweetId.slice(-4)}
        </a>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => formatNumber(row.original.views ?? 0),
    },
    {
      accessorKey: "retweets",
      header: "Rtws",
      cell: ({ row }) => formatNumber(row.original.retweets ?? 0),
    },
    {
      accessorKey: "likes",
      header: "Likes",
      cell: ({ row }) => formatNumber(row.original.likes ?? 0),
    },
    {
      accessorKey: "replies",
      header: "Replies",
      cell: ({ row }) => formatNumber(row.original.replies ?? 0),
    },
    {
      accessorKey: "datetime",
      header: "Publish Date",
      cell: ({ row }) => new Date(row.original.datetime).toLocaleString(),
    },
    {
      accessorKey: "textContent",
      header: "Text",
      cell: ({ row }) => (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="text-blue-400 hover:underline">
              View
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#202232] p-6 shadow-lg">
              <Dialog.Title className="text-lg font-semibold mb-4 text-white">
                Tweet Full Text
              </Dialog.Title>
              <div className="text-gray-300 whitespace-pre-line break-all">
                <Linkify options={linkifyOptions}>
                  {row.original.textContent || "No text"}
                </Linkify>
              </div>
              <Dialog.Close asChild>
                <button className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
    },
  ], [scanTimestamps, followersCache, loadingUsers]);

  if (!tweets || tweets.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

  if (viewMode === "list") {
    return (
      <>
      <div ref={summaryRef} className="w-full max-w-3xl mb-6 p-6 rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-800/30 to-blue-700/20 shadow-2xl backdrop-blur-lg">
<div className="mb-4">
  <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
    📊 Statistic Summary
  </h3>
  <div className="text-sm text-blue-200">
    🗂️ <strong>Mode:</strong> {mode} &nbsp; | &nbsp; ⏱️ <strong>Scanned:</strong>{" "}
    {new Date(scannedAt).toLocaleString(undefined, { timeZoneName: "short" })}
  </div>
</div>

  {/* === Top: Coin & Contract === */}
  <div className="space-y-2 mb-6">
    <p className="text-blue-100/80">
      🪙 <span className="font-semibold text-white">Coin:</span>{" "}
      <span className="font-bold text-blue-200">{coinName}</span>{" "}
      <span className="text-blue-300">({ticker})</span>
    </p>
    <p className="text-blue-100/80 break-all">
      🔗 <span className="font-semibold text-white">Contract:</span>{" "}
      <span className="text-blue-300">{contractAddress || "N/A"}</span>
    </p>
  </div>

  {/* === Bottom: Two Small Cards === */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Card */}
    <div className="bg-white/5 border border-blue-400/10 rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
      <p className="text-blue-300 font-semibold mb-2">📌 Total Tweets</p>
      <p className="text-white text-2xl font-bold mb-2">{totalTweets}</p>
      <p className="text-blue-100">👀 {formatNumber(totalViews)} Views</p>
      <p className="text-blue-100">💬 {formatNumber(totalEngagements)} Engagements</p>
    </div>

    {/* Right Card */}
    <div className="bg-white/5 border border-green-400/10 rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
      <p className="text-green-300 font-semibold mb-2">✅ Verified Tweets</p>
      <p className="text-white text-2xl font-bold mb-2">{totalTweetsVerified}</p>
      <p className="text-green-100">👀 {formatNumber(totalViewsVerified)} Views</p>
      <p className="text-green-100">💬 {formatNumber(totalEngagementsVerified)} Engagements</p>
    </div>
  </div>
</div>
  <button
    onClick={async () => {
      const node = summaryRef.current;
      const scale = 2;
      domtoimage.toPng(node, {
        width: node.offsetWidth * scale,
        height: node.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: "#0f172a",
        }
      })
  .then(dataUrl => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "ctScreener_summary.png";
    link.click();
  })
  .catch(err => {
    console.error("Failed to export image:", err);
  });
    }}
    className="px-3 py-1.5 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
  >
    📸 Save as Image
  </button>

        <DataTable columns={columns} data={tweets} ref={tableRef} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-6 items-left">
      {tweets.map((tweet) => (
        <Card
          key={tweet.tweetId}
          className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-sidebar shadow-md transition-all duration-300 hover:shadow-lg hover:border-sidebarBorder"
        >
          <CardContent className="p-5 space-y-3">
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={`https://twitter.com/${tweet.tweeter}/status/${tweet.tweetId}`} />
            </blockquote>

            <div className="flex justify-between text-sm text-zinc-500 pt-2">
              <div className="flex items-center gap-1">
                <BarChart size={16} /> {tweet.views ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} /> {tweet.likes ?? 0}
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} /> {tweet.replies ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <Repeat size={16} /> {tweet.retweets ?? 0}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2 px-2 text-sm text-zinc-400">
              <a
                href={`https://x.com/intent/like?tweet_id=${tweet.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 flex items-center gap-1"
              >
                <Heart size={14} /> Like
              </a>

              <a
                href={`https://x.com/intent/retweet?tweet_id=${tweet.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 flex items-center gap-1"
              >
                <Repeat size={14} /> Retweet
              </a>

              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                `Check this out: https://x.com/${tweet.tweeter}/status/${tweet.tweetId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 flex items-center gap-1"
              >
                <MessageCircle size={14} /> Quote
              </a>

              <a
                href={tweet.statusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-right text-blue-400 hover:underline text-sm"
              >
                View Tweet →
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
