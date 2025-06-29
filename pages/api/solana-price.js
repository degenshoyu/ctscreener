import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const { mint, timestamp, timestamp_iso, tweet_id } = req.body;

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
      `⏳ [solana-price] Fetching price from Node API for mint=${mint} tweet_id=${tweet_id}`,
    );

    const backendURL = process.env.TWITTER_SCANNER_API_URL;
    const token = process.env.TWITTER_SCANNER_SECRET;
    const response = await fetch(`${backendURL}/api/solana/price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mint, timestamp: timestampFinal, tweet_id }),
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.status}`);
    }

    const data = await response.json();

    const jobId = data.job_id;

    await db.collection("tweet_prices").updateOne(
      { tweet_id, token: mint },
      {
        $set: {
          tweet_timestamp: timestamp_iso,
          price: null,
          price_job_id: jobId,
          source: "scanner-api",
          fetched_at: new Date(),
        },
      },
      { upsert: true },
    );

    return res.status(200).json({ job_id: jobId });
  } catch (e) {
    console.error("❌ solana-price proxy error:", e);
    res.status(500).json({ error: e.message });
  }
}
