// components/TweetListImpact.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { DataTable } from "@/components/DataTable";
import TweetAnalyticsCard from "@/components/TweetAnalyticsCard";
import { BarChart, Heart, MessageCircle, Repeat,Loader, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ImpactfulCallersCard from "@/components/ImpactfulCallersCard";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function Spinner({ className = "h-4 w-4 text-zinc-400" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
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
  );
}

function roundToMinute(date) {
  const newDate = new Date(date);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

const timeOffsets = [
  { key: "price", minutes: 0 },
  { key: "price_15m", minutes: 15 },
  { key: "price_30m", minutes: 30 },
  { key: "price_1h", minutes: 60 },
  { key: "price_3h", minutes: 180 },
];

async function fetchBatchPrices(baseTweets, contractAddress) {
  const timeOffsets = [
    { key: "price", minutes: 0 },
    { key: "price_15m", minutes: 15 },
    { key: "price_30m", minutes: 30 },
    { key: "price_1h", minutes: 60 },
    { key: "price_3h", minutes: 180 },
  ];

  const keys = [];
  for (const tweet of baseTweets) {
    const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
    if (!tweetId) continue;
    for (const { key } of timeOffsets) {
      keys.push({ tweetId, key });
    }
  }

  const res = await fetch("/api/solana-price-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keys,
      token: contractAddress,
    }),
  });

  const data = await res.json();
  return data.prices || {};
}

async function pollPriceJob(jobId, maxAttempts = 3, interval = 1500) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const res = await fetch(`/api/jobProxy?job_id=${jobId}`);
      const data = await res.json();
      console.log("🔁 Job polling result:", data);
      if (data?.result?.price != null || data?.price != null) {
        return data.result?.price ?? data.price;
      }
    } catch (e) {
      console.warn("Polling error:", e);
    }
    await sleep(interval);
    attempts++;
  }
  return null;
}

export default function TweetListImpact({
  tweets,
  viewMode = "embed",
  coinName,
  ticker,
  contractAddress,
  mode,
  scannedAt,
  jobId,
}) {
  const [fullTweets, setFullTweets] = useState([]);
  const [tweetsWithPrices, setTweetsWithPrices] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [priceMap, setPriceMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const baseTweets = tweets && tweets.length > 0 ? tweets : fullTweets;

  useEffect(() => {
    if (tweets && tweets.length > 0) {
      setTweetsWithPrices(tweets);
    }
  }, [tweets]);

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

  useEffect(() => {
    const fetchAllPrices = async () => {
      const realTweets = tweets && tweets.length > 0 ? tweets : fullTweets;
      if (!realTweets || realTweets.length === 0) return;
      setProgressText("Fetching cached prices...");
      const batch = await fetchBatchPrices(realTweets, contractAddress);
      setPriceMap(batch);

    const initialLoadingMap = {};
    const tempPriceMap = { ...batch };

    for (const tweet of realTweets) {
      const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
      for (const { key } of timeOffsets) {
        const priceKey = `${tweetId}-${key}`;
        if (!(priceKey in batch) || batch[priceKey] === null) {
          initialLoadingMap[priceKey] = true;
        }
      }
    }
    setLoadingMap(initialLoadingMap);

    for (const tweet of realTweets) {
      const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
      const tweetTime = new Date(tweet.datetime);

      for (const { key, minutes } of timeOffsets) {
        const priceKey = `${tweetId}-${key}`;
        if (!(priceKey in batch) || batch[priceKey] === null) {
          console.log("🌀 Fallback triggered for", priceKey);
          setLoadingMap((prev) => ({ ...prev, [priceKey]: true }));

          try {
            const time = roundToMinute(new Date(tweetTime.getTime() + minutes * 60000));
            const res = await fetch("/api/solana-price", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mint: contractAddress,
                timestamp_iso: time.toISOString(),
                tweet_id: priceKey,
              }),
            });
            const data = await res.json();

            if (data.job_id) {
              const jobId = data.job_id;
              console.log("📦 Received job_id:", jobId);

              const result = await pollPriceJob(jobId);
              console.log("✅ Price ready from job:", result);

              setPriceMap((prev) => ({ ...prev, [priceKey]: result ?? null }));

              setTweetsWithPrices((prev) =>
                prev.map((t) => {
                  const id = t.tweetId || t.tweet_id || t.id;
                  if (`${id}-${key}` === priceKey) {
                    return {
                      ...t,
                      [key]: result ?? null,
                    };
                  }
                  return t;
                })
              );
            } else {
              setPriceMap((prev) => ({ ...prev, [priceKey]: null }));
            }
            setLoadingMap((prev) => ({ ...prev, [priceKey]: false }));
          } catch (err) {
              console.error("❌ Fallback fetch error", err);
          }
        }
      }
    }
    const finalUpdated = realTweets.map((tweet) => {
      const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
      return {
        ...tweet,
        price: priceMap[`${tweetId}-price`] ?? null,
        price_15m: priceMap[`${tweetId}-price_15m`] ?? null,
        price_30m: priceMap[`${tweetId}-price_30m`] ?? null,
        price_1h: priceMap[`${tweetId}-price_1h`] ?? null,
        price_3h: priceMap[`${tweetId}-price_3h`] ?? null,
      };
    });
    setTweetsWithPrices(finalUpdated);
    setProgressText("");
  };

  fetchAllPrices();
}, [tweets, fullTweets, contractAddress]);

  useEffect(() => {
    const realTweets = tweets && tweets.length > 0 ? tweets : fullTweets;
    if (!realTweets || realTweets.length === 0) return;

    const updated = realTweets.map((tweet) => {
      const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
      return {
        ...tweet,
        price: priceMap[`${tweetId}-price`] ?? null,
        price_15m: priceMap[`${tweetId}-price_15m`] ?? null,
        price_30m: priceMap[`${tweetId}-price_30m`] ?? null,
        price_1h: priceMap[`${tweetId}-price_1h`] ?? null,
        price_3h: priceMap[`${tweetId}-price_3h`] ?? null,
      };
    });

    setTweetsWithPrices(updated);
  }, [priceMap]);

  const priceColumns = useMemo(() => [
    {
      accessorKey: "tweeter",
      header: "Tweeter",
      cell: ({ row }) => (
      <div className="text-sm text-blue-300 pt-2 flex items-center gap-1">
        <a
          href={`https://twitter.com/${row.original.tweeter}`}
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          @{row.original.tweeter}
        </a>
        {row.original.isVerified && <BadgeCheck className="w-4 h-4 text-sky-400" />}
      </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price (USD)",
      cell: ({ row }) => {
        const tweetId = row.original.tweetId || row.original.tweet_id || row.original.id;
        const price = row.original.price;
        const loading = loadingMap[`${tweetId}-price`];

        if (loading) {
          return <Spinner />;
        } else if (price != null) {
          return `$${price.toFixed(6)}`;
        } else {
          return <span className="text-zinc-500">-</span>;
        }
      },
    },
  ...["15m", "30m", "1h", "3h"].map((t) => ({
  accessorKey: `price_${t}`,
  header: `Impact ${t}`,
  cell: ({ row }) => {
    const p0 = row.original.price;
    const pt = row.original[`price_${t}`];

    if (p0 == null || pt == null || p0 === 0) return "-";

    const change = (pt - p0) / p0;
    const color =
      change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "";

    return(
      <span className={color}>
        {(change * 100).toFixed(2)}%
      </span>
    );
  },
})),
    {
      accessorKey: "tweetId",
      header: "Tweet",
      cell: ({ row }) => (
        <a
          href={`https://twitter.com/${row.original.tweeter}/status/${row.original.tweetId}`}
          target="_blank"
          className="text-green-400 hover:underline"
        >
          {row.original.tweetId.slice(0, 5)}...{row.original.tweetId.slice(-4)}
        </a>
      ),
    },
    {
      accessorKey: "datetime",
      header: "Date",
      cell: ({ row }) => new Date(row.original.datetime).toLocaleString(),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => row.original.views ?? 0,
    },
    {
      accessorKey: "likes",
      header: "Likes",
      cell: ({ row }) => row.original.likes ?? 0,
    },
    {
      accessorKey: "retweets",
      header: "Retweets",
      cell: ({ row }) => row.original.retweets ?? 0,
    },
  ], [priceMap, loadingMap]);

  const paged = useMemo(() => {
    return tweetsWithPrices.slice((page - 1) * pageSize, page * pageSize).map((tweet) => {
      const tweetId = tweet.tweetId || tweet.tweet_id || tweet.id;
      return {
        ...tweet,
        price: priceMap[`${tweetId}-price`] ?? tweet.price ?? null,
        price_15m: priceMap[`${tweetId}-price_15m`] ?? tweet.price_15m ?? null,
        price_30m: priceMap[`${tweetId}-price_30m`] ?? tweet.price_30m ?? null,
        price_1h: priceMap[`${tweetId}-price_1h`] ?? tweet.price_1h ?? null,
        price_3h: priceMap[`${tweetId}-price_3h`] ?? tweet.price_3h ?? null,
      };
    });
  }, [tweetsWithPrices, priceMap, page]);

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
}, [paged, viewMode]);

if (loading) {
  return (
    <div className="text-blue-300 text-sm italic animate-pulse mt-4">
      {progressText || "Loading tweets..."}
    </div>
  );
}

  if (!tweetsWithPrices || tweetsWithPrices.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

  if (viewMode === "list") {
    return (
      <>
        <TweetAnalyticsCard
          tweets={tweetsWithPrices}
          coinName={coinName}
          ticker={ticker}
          contractAddress={contractAddress}
          mode={mode}
          scannedAt={scannedAt}
        />

        <ImpactfulCallersCard tweets={tweetsWithPrices} />
        
        <div className="mt-4">
          <DataTable columns={priceColumns} data={paged} />
        </div>
            <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-1 rounded bg-zinc-700 text-white disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-zinc-400 mt-1">Page {page}</span>
        <button
          onClick={() =>
            setPage((p) =>
              p < Math.ceil(tweetsWithPrices.length / pageSize) ? p + 1 : p
            )
          }
          disabled={page >= Math.ceil(tweetsWithPrices.length / pageSize)}
          className="px-4 py-1 rounded bg-zinc-700 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </>
    );
  }

  return (
    <>
    <div className="flex flex-col gap-6 mt-6 items-left">
      {paged.map((tweet) => (
        <Card key={tweet.tweetId} className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-sidebar shadow-md">
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
              <div className="flex items-center gap-1">
                <MessageCircle size={14} /> {tweet.replies ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <Repeat size={16} /> {tweet.retweets ?? 0}
              </div>
            </div>

            {tweet.price != null && (
              <div className="text-sm text-blue-300 pt-1">
                {loadingMap[`${tweet.tweetId}-price`] ? (
                  <span className="inline-flex items-center gap-2 text-zinc-400 animate-pulse">
                    <Spinner /> Loading price...
                  </span>
                ) : priceMap[`${tweet.tweetId}-price`] != null ? (
                  <>Price when posted: ${priceMap[`${tweet.tweetId}-price`].toFixed(6)}</>
                ) : (
                  <>Price: N/A</>
                )}
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
    href={`https://x.com/${tweet.tweeter}/status/${tweet.tweetId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-right text-blue-400 hover:underline text-sm"
  >
    View Tweet →
  </a>
</div>

              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-4 py-1 rounded bg-zinc-700 text-white disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm text-zinc-400 mt-1">Page {page}</span>
      <button
        onClick={() =>
          setPage((p) =>
            p < Math.ceil(tweetsWithPrices.length / pageSize) ? p + 1 : p
          )
        }
        disabled={page >= Math.ceil(tweetsWithPrices.length / pageSize)}
        className="px-4 py-1 rounded bg-zinc-700 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </>
);
}
