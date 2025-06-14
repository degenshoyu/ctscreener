// pages/api/user/get.js

import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const wallet = req.query.wallet;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ wallet_address: wallet });

    res.status(200).json({
      username: user?.username || wallet.slice(0, 5) + "..." + wallet.slice(-4),
      avatarStyle: user?.avatarStyle || "bottts",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
}

