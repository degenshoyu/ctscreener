// components/TweetAnalyticsCard.jsx
import { useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/DataTable";
import domtoimage from "dom-to-image";

export default function TweetAnalyticsCard({ tweets, coinName, ticker, contractAddress, mode, scannedAt }) {
  const summaryRef = useRef();
  const [showRanking, setShowRanking] = useState(false);

  const totalTweets = tweets.length;
  const totalViews = tweets.reduce((sum, t) => sum + (t.views || 0), 0);
  const totalEngagements = tweets.reduce(
    (sum, t) => sum + (t.retweets || 0) + (t.likes || 0) + (t.replies || 0),
    0
  );
  const verifiedTweets = tweets.filter((t) => t.isVerified);
  const totalTweetsVerified = verifiedTweets.length;
  const totalViewsVerified = verifiedTweets.reduce((sum, t) => sum + (t.views || 0), 0);
  const totalEngagementsVerified = verifiedTweets.reduce(
    (sum, t) => sum + (t.retweets || 0) + (t.likes || 0) + (t.replies || 0),
    0
  );
  const engagementRate = totalViews > 0 ? totalEngagements / totalViews : 0;
  const engagementRateVerified = totalViewsVerified > 0 ? totalEngagementsVerified / totalViewsVerified : 0;

  const tweeterStats = {};
  tweets.forEach((t) => {
    const name = t.tweeter;
    if (!tweeterStats[name]) {
      tweeterStats[name] = {
        tweeter: name,
        tweets: 0,
        views: 0,
        engagement: 0,
        er: 0,
        score: 0,
      };
    }
    tweeterStats[name].tweets += 1;
    tweeterStats[name].views += t.views || 0;
    tweeterStats[name].engagement += (t.likes || 0) + (t.retweets || 0) + (t.replies || 0);
  });
  Object.values(tweeterStats).forEach((s) => {
    s.er = s.views > 0 ? s.engagement / s.views : 0;
    s.score = s.views * (1 + s.er) * Math.log(s.tweets + 1);
  });
  const tweeterRanking = Object.values(tweeterStats)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const rankingColumns = useMemo(() => [
    { accessorKey: "rank", header: "Rank", cell: ({ row }) => `#${row.index + 1}` },
    { accessorKey: "tweeter", header: "Tweeter", cell: ({ row }) => (
      <a href={`https://twitter.com/${row.original.tweeter}`} target="_blank" className="text-blue-400 hover:underline">
        @{row.original.tweeter}
      </a>) },
    { accessorKey: "tweets", header: "Tweets", cell: ({ row }) => row.original.tweets },
    { accessorKey: "views", header: "Views", cell: ({ row }) => row.original.views },
    { accessorKey: "engagement", header: "Engagement", cell: ({ row }) => row.original.engagement },
    { accessorKey: "er", header: "ER %", cell: ({ row }) => `${(row.original.er * 100).toFixed(2)}%` },
    { accessorKey: "score", header: "Score", cell: ({ row }) => row.original.score.toFixed(2) },
  ], []);

  return (
    <div ref={summaryRef} className="w-full max-w-3xl mb-6 p-6 rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-800/30 to-blue-700/20 shadow-2xl backdrop-blur-lg">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl font-bold">
            {showRanking ? "🏅 Tweeter Ranking" : "📊 Statistic Summary"}
          </h3>
          <button
            onClick={() => setShowRanking(!showRanking)}
            className={`relative inline-flex h-6 w-11 rounded-full transition ${
              showRanking ? "bg-green-500" : "bg-blue-500"
            }`}
          >
            <span
              className={`absolute top-0 bottom-0 my-auto h-5 w-5 rounded-full bg-white shadow transition ${
                showRanking ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="text-sm text-blue-200">
          🗂️ <strong>Mode:</strong> {mode} &nbsp; | &nbsp; ⏱️ <strong>Scanned:</strong>{" "}
          {new Date(scannedAt).toLocaleString(undefined, { timeZoneName: "short" })}
        </div>
      </div>

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

      {showRanking ? (
        <DataTable columns={rankingColumns} data={tweeterRanking} hideSearch />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-blue-400/10 rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
            <p className="text-blue-300 font-semibold mb-2">📌 Total Tweets</p>
            <p className="text-white text-2xl font-bold mb-2">{totalTweets}</p>
            <p className="text-blue-100">👀 {totalViews} Views</p>
            <p className="text-blue-100">💬 {totalEngagements} Engagements</p>
            <p className="text-blue-100">📈 ER: {(engagementRate * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-white/5 border border-green-400/10 rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.02] transition">
            <p className="text-green-300 font-semibold mb-2">✅ Verified Tweets</p>
            <p className="text-white text-2xl font-bold mb-2">{totalTweetsVerified}</p>
            <p className="text-green-100">👀 {totalViewsVerified} Views</p>
            <p className="text-green-100">💬 {totalEngagementsVerified} Engagements</p>
            <p className="text-green-100">📈 ER: {(engagementRateVerified * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}

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
            },
          })
            .then((dataUrl) => {
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "ctScreener_summary.png";
              link.click();
            })
            .catch((err) => {
              console.error("Failed to export image:", err);
            });
        }}
        className="mt-4 px-3 py-1.5 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
      >
        📸 Save as Image
      </button>
    </div>
  );
}
