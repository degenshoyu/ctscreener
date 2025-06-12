// components/TokenInfoCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function TokenInfoCard({ tokenInfo }) {
  if (!tokenInfo) return null;

  const {
    name,
    symbol,
    address,
    priceUsd,
    marketCap,
    fdv,
    pairUrl,
    liquidityUsd,
    txns,
    volume,
    priceChange,
    pairCreatedAt,
    imageUrl,
  } = tokenInfo;

  const formatUsd = (n) =>
    n ? `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "-";

  const formatChange = (n) => (n > 0 ? `+${n}%` : `${n}%`);

  return (
    <Card className="mt-6 bg-[#202232] border border-[#414670]">
      <CardContent className="p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          {imageUrl && (
            <img src={imageUrl} alt={symbol} className="w-10 h-10 rounded-full" />
          )}
          <div>
            <div className="text-xl font-semibold text-white">{name}</div>
            <div className="text-sm text-gray-400">{symbol} · {address.slice(0, 4)}...{address.slice(-4)}</div>
          </div>
        </div>

        {/* Price + Market Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-white">
          <div><span className="text-gray-400">Price:</span> {formatUsd(priceUsd)}</div>
          <div><span className="text-gray-400">Market Cap:</span> {formatUsd(marketCap)}</div>
          <div><span className="text-gray-400">FDV:</span> {formatUsd(fdv)}</div>
          <div><span className="text-gray-400">Liquidity:</span> {formatUsd(liquidityUsd)}</div>
          <div><span className="text-gray-400">24h Volume:</span> {formatUsd(volume?.h24)}</div>
          <div>
            <span className="text-gray-400">24h Change:</span>{" "}
            <span className={priceChange?.h24 > 0 ? "text-green-400" : "text-red-400"}>
              {formatChange(priceChange?.h24)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <div>
            Created: {pairCreatedAt ? format(new Date(pairCreatedAt), "yyyy-MM-dd HH:mm") : "-"}
          </div>
          <a
            href={pairUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View on Dexscreener →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

