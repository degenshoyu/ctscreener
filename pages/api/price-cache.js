// /pages/api/price-cache.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { tweet_id, token } = req.body;
  if (!tweet_id || !token) return res.status(400).json({ error: "Missing fields" });

  const client = await clientPromise;
  const db = client.db("ctScreener");

  const doc = await db.collection("tweet_prices").findOne({ tweet_id, token });
  if (doc) return res.status(200).json({ price: doc.price });
  else return res.status(404).json({ error: "Not found" });
}

