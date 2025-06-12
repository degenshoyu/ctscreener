// components/TweetList.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Repeat, Heart, BarChart } from "lucide-react";

export default function TweetList({ tweets }) {
  console.log("🐦 TweetList received tweets:", tweets);
  if (!tweets || tweets.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

  const sortedTweets = [...tweets].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );

  return (
    <div className="grid gap-6 mt-6">
      {tweets.map((tweet) => (
        <Card key={tweet.tweetId} className="rounded-2xl border border-zinc-800 bg-sidebar shadow-md transition-all duration-300 hover:shadow-lg hover:border-zinc-700">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <a
                href={`https://x.com/${tweet.tweeter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-400 hover:underline"
              >
                @{tweet.tweeter}
              </a>
              <div className="text-xs text-zinc-500">
                {new Date(tweet.datetime).toLocaleString()}
              </div>
            </div>

            <div className="text-base whitespace-pre-wrap leading-relaxed text-zinc-100">{tweet.textContent}</div>

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

            <a
              href={tweet.statusLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-right text-blue-400 hover:underline text-sm"
            >
              View Tweet →
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
