import { resolveRelatedAddress } from "@/lib/solana/resolveRelatedAddress.mjs";
import { autoFetchHistoricalPrice } from "@/lib/solana/autoFetchHistoricalPrice";
import clientPromise from "@/lib/mongodb";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default async function handler(req, res) {
  try {
    const { mint, timestamp, timestamp_iso, tweet_id, pair_address } = req.body;

    const timestampFinal = timestamp
      ? Number(timestamp)
      : timestamp_iso
        ? Math.floor(new Date(timestamp_iso).getTime() / 1000)
        : null;

    if (!mint || !timestampFinal) {
      return res.status(400).json({ error: "Missing mint or timestamp" });
    }

    const client = await clientPromise;
    const db = client.db("ctScreener");

    const existing = await db.collection("tweet_prices").findOne({
      tweet_id,
      token: mint,
      price: { $ne: null },
    });

    if (existing) {
      console.log(
        `✅ [solana-price] Cache hit for tweet_id=${tweet_id} mint=${mint}`,
      );
      return res.status(200).json({ price: existing.price, cached: true });
    }

    console.log(
      `⏳ [solana-price] No cache found, fetching from GeckoTerminal for tweet_id=${tweet_id} mint=${mint}`,
    );
    await sleep(Math.random() * 150 + 50);
    const resolved = await resolveRelatedAddress(mint);
    const price = await autoFetchHistoricalPrice(resolved, timestampFinal);

    try {
      const client = await clientPromise;
      const db = client.db("ctScreener");
      await db.collection("tweet_prices").updateOne(
        { tweet_id, token: mint, price: { $ne: null } },
        {
          $setOnInsert: {
            tweet_timestamp: timestamp_iso,
            price,
            pair_address: pair_address || resolved.pairAddress,
            source: "geckoterminal",
            fetched_at: new Date(),
          },
        },
        { upsert: true },
      );
    } catch (mongoError) {
      console.warn("⚠️ Failed to write to MongoDB:", mongoError);
    }

    res.status(200).json({ price });
  } catch (e) {
    console.error("❌ solana-price error:", e);
    res.status(500).json({ error: e.message });
  }
}
