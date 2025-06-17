// pages/api/fetchUsers.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const apiUrl = process.env.TWITTER_SCANNER_API_URL || "http://localhost:3000";
    const token = process.env.TWITTER_SCANNER_SECRET;

    // Call your custom server
    const resp = await fetch(`${apiUrl}/user/by-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ screen_name: username }),
    });

    const data = await resp.json();

    res.status(resp.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
