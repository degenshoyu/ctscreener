// pages/api/ai-analyze.js

import aiInsightPrompt from "@/lib/prompts/aiInsightPrompt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid input text" });
  }

  const prompt = aiInsightPrompt(text);

  try {
    const agentId = process.env.DGENAI_AGENT_ID;
    const apiKey = process.env.DGENAI_API_KEY;

    if (!agentId || !apiKey) {
      throw new Error("Missing DGENAI environment variables");
    }

    const aiRes = await fetch(
      `https://api.dgenai.io/api/Public/agents/${agentId}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({ input: prompt }),
      },
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("❌ AI API failed:", aiRes.status, errText);
      return res
        .status(aiRes.status)
        .json({ error: "AI API failed", details: errText });
    }

    const resultText = await aiRes.text();
    res.status(200).send(resultText);
  } catch (error) {
    console.error("❌ AI endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
