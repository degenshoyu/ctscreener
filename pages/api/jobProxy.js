// pages/api/jobProxy.js

const BASE_URL = process.env.TWITTER_SCANNER_API_URL;

export default async function handler(req, res) {
  const { job_id } = req.query;

  console.log("📡 [API Proxy] jobProxy called with:", { job_id });

  if (!job_id) {
    console.warn("⚠️ Missing job_id in request");
    return res.status(400).json({ error: "Missing job_id" });
  }

  try {
    const upstreamRes = await fetch(`${BASE_URL}/job/${job_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_SCANNER_SECRET}`,
      },
    });

    const data = await upstreamRes.json();
    console.log("📦 jobProxy response:", data);

    res.status(200).json(data);
  } catch (err) {
    console.error("🔴 Job fetch error:", err);
    res.status(500).json({ error: "Failed to fetch job result" });
  }
}
