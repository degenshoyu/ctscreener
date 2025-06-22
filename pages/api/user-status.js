export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const backendUrl = `${process.env.TWITTER_SCANNER_API_URL}/api/user-status`;
    console.log("Proxying to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": req.headers.authorization || "",
      },
    });

    const data = await response.json();
    console.log("Proxy result:", data);

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal Proxy Error" });
  }
}

