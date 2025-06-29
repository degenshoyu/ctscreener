// lib/solana/autoFetchHistoricalPrice.js

import { fetchWithRetry } from "./fetchWithRetry";

export async function autoFetchHistoricalPrice(resolved, timestamp) {
  const { pairAddress } = resolved;

  const targetTime =
    typeof timestamp === "string"
      ? new Date(timestamp).getTime() / 1000
      : timestamp;
  const unixTime = Math.floor(targetTime);

  console.log(`🔍 [AutoFetch] Using GeckoTerminal for ${pairAddress}`);
  console.log(
    `   ↳ Timestamp: ${new Date(unixTime * 1000).toISOString()} (${unixTime})`,
  );

  const url = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${pairAddress}/ohlcv/minute?aggregate=1&limit=1&before_timestamp=${unixTime}`;

  const res = await fetchWithRetry(url, {}, 3, 10000);
  const json = await res.json();

  const ohlcv = json?.data?.attributes?.ohlcv_list?.[0];
  if (!ohlcv || ohlcv.length < 5) {
    throw new Error("❌ GeckoTerminal response missing OHLCV data");
  }

  const closePrice = Number(ohlcv[4]); // close price
  console.log(`✅ [GeckoTerminal] Price @ ${ohlcv[0]} = ${closePrice} USD`);

  return closePrice;
}
