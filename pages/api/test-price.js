// pages/api/test-price.js
import { autoFetchHistoricalPrice } from "@/lib/solana/autoFetchHistoricalPrice";
import { resolveRelatedAddress } from "@/lib/solana/resolveRelatedAddress.mjs";

export default async function handler(req, res) {
  try {
    const { mint, timestamp_iso } = req.body;
    const timestamp = Math.floor(new Date(timestamp_iso).getTime() / 1000);

    console.log("🔍 [Test-Price] Request received:", { mint, timestamp_iso });

    const resolved = await resolveRelatedAddress(mint);
    console.log("🔗 [Resolved] Address info:", resolved);

    const usd = await autoFetchHistoricalPrice(resolved, timestamp);

    console.log("✅ [Result] USD price:", usd);
    res.status(200).json({ usd });
  } catch (err) {
    console.error("❌ [Test-Price Error]:", err);
    res.status(500).json({
      error: err.message || "Unknown error",
      stack: err.stack,
    });
  }
}
