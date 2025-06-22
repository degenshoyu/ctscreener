export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : await req.json();

    console.log("🔑 Proxy incoming body:", body);

    if (!body.wallet) {
      console.warn("❌ Missing wallet in body!");
      return res.status(400).json({ error: "Missing wallet address" });
    }

    const backendUrl = `${process.env.TWITTER_SCANNER_API_URL}/api/request-key`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("✅ Proxy result:", data);

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal Proxy Error" });
  }
}

