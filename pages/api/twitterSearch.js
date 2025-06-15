// pages/api/twitterSearch.js
import clientPromise from "@/lib/mongodb";

const BASE_URL = process.env.TWITTER_SCANNER_API_URL;

import { logApiCall } from "@/lib/apiLogger";
import { getLatestCompletedJobByKeyword } from "@/lib/jobUtils";

export default async function handler(req, res) {
  console.log("🚀 API /api/twitterSearch hit");

  if (req.method !== "POST") return res.status(405).end();

  const { tokenAddress, pairCreatedAt, tokenInfo, mode, window } = req.body;
  const bearerToken = process.env.TWITTER_SCANNER_SECRET;
  console.log("📥 Received params:", {
    tokenAddress,
    pairCreatedAt,
    mode,
    window,
  });

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const end_date = tomorrow.toISOString().split("T")[0];

  let apiPath = "";
  let body = {};

  if (mode === "shiller") {
    apiPath = "/search";

    let daysAgo = 1;
    if (window === "24h") daysAgo = 1;
    else if (window === "7d") daysAgo = 7;
    else if (window === "30d") daysAgo = 30;

    const start = new Date();
    start.setDate(tomorrow.getDate() - (daysAgo + 1));
    const start_date = start.toISOString().split("T")[0];

    body = {
      keyword: tokenAddress,
      start_date,
      end_date,
    };
  } else {
    apiPath = "/search/early";
    const until = new Date(pairCreatedAt + oneDayMs)
      .toISOString()
      .split("T")[0];
    body = {
      keyword: tokenAddress,
      end_date: until,
      start_date: "",
    };
  }

  console.log("📤 Sending to scanner:", { apiPath, body });

  try {
    const response = await fetch(`${BASE_URL}${apiPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("📨 Scanner response data:", data);

    if (!data.success)
      return res.status(500).json({ error: "Scanner error", data });

    console.log("✅ Scanner job_id:", data.job_id);

    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("search_history").insertOne({
        wallet_address: req.headers["x-wallet-address"] || null,
        token_address: tokenAddress,
        token_info: tokenInfo || null,
        mode,
        window: mode === "shiller" ? window : null,
        job_id: data.job_id,
        created_at: new Date(),
      });
    } catch (err) {
      console.error("❌ Failed to save search history:", err);
    }

    res.status(200).json({ job_id: data.job_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to forward search request." });
  }
}
