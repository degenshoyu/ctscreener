// pages/api/user/update.js

import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { wallet_address, username, avatarStyle } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { wallet_address },
      {
        $set: {
          username,
          avatarStyle,
        },
      },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
}

