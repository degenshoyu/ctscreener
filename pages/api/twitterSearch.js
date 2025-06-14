// pages/api/twitterSearch.js

const BASE_URL = process.env.TWITTER_SCANNER_API_URL;

import { logApiCall } from "@/lib/apiLogger";
import { getLatestCompletedJobByKeyword } from "@/lib/jobUtils";

export default async function handler(req, res) {
  console.log("🚀 API /api/twitterSearch hit");

  if (req.method !== "POST") return res.status(405).end();

  const { tokenAddress, pairCreatedAt } = req.body;
  const bearerToken = process.env.TWITTER_SCANNER_SECRET;
  console.log("📥 Received params:", { tokenAddress, pairCreatedAt });

  const now = Date.now();
  const tokenAge = now - pairCreatedAt;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (tokenAge > oneDayMs) {
    const recentJob = await getLatestCompletedJobByKeyword(tokenAddress);
    if (recentJob && recentJob.job_id) {
      console.log("♻️ Using cached job_id:", recentJob.job_id);
      return res.status(200).json({ job_id: recentJob.job_id, reused: true });
    }
  }

  const until = new Date(pairCreatedAt + oneDayMs).toISOString().split("T")[0];
  const body = {
    keyword: tokenAddress,
    end_date: until,
    start_date: "",
  };

  console.log("📤 Sending body to scanner:", body);

  try {
    const response = await fetch(`${BASE_URL}/search/early`, {
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
    res.status(200).json({ job_id: data.job_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to forward search request." });
  }
}
