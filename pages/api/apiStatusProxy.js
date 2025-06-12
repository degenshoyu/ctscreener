export default async function handler(req, res) {
  try {
    const apiUrl = process.env.TWITTER_SCANNER_API_URL || "http://157.180.95.110:3000";
    const token = process.env.TWITTER_SCANNER_SECRET;

    const [statusRes, poolRes] = await Promise.all([
      fetch(`${apiUrl}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${apiUrl}/pool/status`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]);

    res.status(200).json({
      container: "scanner-api",
      status: statusRes.status,
      pool: poolRes.status?.status || [],
    });
  } catch (err) {
    console.error("❌ API statusProxy failed:", err);
    res.status(500).json({ error: "Failed to fetch status" });
  }
}
