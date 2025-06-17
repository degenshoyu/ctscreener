// components/TweetList.jsx
import React,{ useEffect, useState,useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Repeat, Heart, BarChart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { DataTable } from "@/components/DataTable";

export default function TweetList({ tweets, viewMode = "embed" }) {
  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";
    return num;
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
        <a
          href={`https://twitter.com/${row.original.tweeter}`}
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          {row.original.tweeter}
        </a>
      ),
    },
    {
      accessorKey: "followers",
      header: "Followers",
      cell: ({ row }) => formatNumber(row.original.followers ?? 0),
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
              <div className="text-gray-300 whitespace-pre-line">
                {row.original.textContent || "No text"}
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
  ], []);

  if (!tweets || tweets.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

  if (viewMode === "list") {
    return <DataTable columns={columns} data={tweets} />;
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
