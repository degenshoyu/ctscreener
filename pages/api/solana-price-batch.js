// pages/api/solana-price-batch.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { keys, token } = req.body;
  if (!Array.isArray(keys) || !token) {
    return res.status(400).json({ error: "Missing keys or token" });
  }

  const priceKeys = keys.map(k => `${k.tweetId}-${k.key}`);
  const client = await clientPromise;
  const db = client.db("ctScreener");

  const docs = await db.collection("tweet_prices")
    .find({ tweet_id: { $in: priceKeys }, token })
    .toArray();

  const priceMap = {};
  for (const doc of docs) {
    priceMap[doc.tweet_id] = doc.price;
  }

  return res.status(200).json({ prices: priceMap });
}

