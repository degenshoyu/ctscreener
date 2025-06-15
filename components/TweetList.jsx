// components/TweetList.jsx
import React,{ useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Repeat, Heart, BarChart } from "lucide-react";

export default function TweetList({ tweets }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, [tweets]);
  console.log("🐦 TweetList received tweets:", tweets);

  if (!tweets || tweets.length === 0) {
    return <p className="text-zinc-400 text-sm">No tweets found.</p>;
  }

  const sortedTweets = [...tweets].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );

  return (
    <div className="grid gap-6 mt-6">
      {sortedTweets.map((tweet) => (
        <Card key={tweet.tweetId} className="rounded-2xl border border-zinc-800 bg-sidebar shadow-md transition-all duration-300 hover:shadow-lg hover:border-sidebarBorder">
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
