import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const info = req.body;

    console.log("💾 [API] saveTokenInfo called with:", {
      address: info?.address,
    });

    if (!info || !info.address) {
      console.warn("⚠️ Invalid token info payload:", req.body);
      return res.status(400).json({ error: "Invalid token info" });
    }

    const client = await clientPromise;
    const db = client.db();

    await db
      .collection("tokens")
      .updateOne(
        { address: info.address },
        { $set: { ...info, savedAt: new Date() } },
        { upsert: true },
      );

    console.log("✅ Token info saved:", info.address);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Mongo] Save token info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
