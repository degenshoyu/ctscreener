// pages/api/user/search_history.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { wallet, job_id } = req.query;
  const client = await clientPromise;
  const db = client.db();

  if (job_id) {
    const doc = await db.collection("search_history").findOne({ job_id });
    return res.json(doc);
  }

  const history = await db
    .collection("search_history")
    .find({ wallet_address: wallet })
    .sort({ created_at: -1 })
    .limit(20)
    .toArray();
  res.json(history);
}
