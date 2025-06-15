import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { job_id } = req.query;

  if (!job_id) {
    return res.status(400).json({ error: "Missing job_id" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("search_history").deleteOne({ job_id });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete search history:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

