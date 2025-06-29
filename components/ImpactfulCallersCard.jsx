import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";

export default function ImpactfulCallersCard({ tweets }) {
  const [interval, setInterval] = useState("1h");

  const impactfulCallers = useMemo(() => {
    const priceField = {
      "15m": "price_15m",
      "30m": "price_30m",
      "1h": "price_1h",
      "3h": "price_3h",
    }[interval];

    return tweets
      .filter((t) => t.price != null && t[priceField] != null && t.price > 0)
      .map((t) => {
        const change = (t[priceField] - t.price) / t.price;
        return {
          tweeter: t.tweeter,
          tweetId: t.tweetId,
          change,
          price: t.price,
          priceLater: t[priceField],
          datetime: t.datetime,
        };
      })
      .sort((a, b) => b.change - a.change)
      .slice(0, 10);
  }, [tweets, interval]);

  const impactfulColumns = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => `#${row.index + 1}`,
    },
    {
      accessorKey: "tweeter",
      header: "Tweeter",
      cell: ({ row }) => (
        <a
          href={`https://twitter.com/${row.original.tweeter}`}
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          @{row.original.tweeter}
        </a>
      ),
    },
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
      accessorKey: "price",
      header: "Start Price",
      cell: ({ row }) => `$${row.original.price.toFixed(6)}`,
    },
    {
      accessorKey: "priceLater",
      header: `Price (${interval})`,
      cell: ({ row }) => `$${row.original.priceLater.toFixed(6)}`,
    },
    {
      accessorKey: "change",
      header: "Change %",
      cell: ({ row }) => {
        const change = row.original.change;
        const color =
          change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "";
        return <span className={color}>{(change * 100).toFixed(2)}%</span>;
      },
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">
          🔥 Most Impactful Callers ({interval} Change)
        </h3>
        <div className="flex gap-2">
          {["15m", "30m", "1h", "3h"].map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-2 py-1 rounded-full text-sm font-medium transition ${
                interval === i
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-700 text-blue-200 hover:bg-blue-600/30"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <DataTable columns={impactfulColumns} data={impactfulCallers} />
    </div>
  );
}
