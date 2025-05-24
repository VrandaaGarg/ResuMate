import { enhanceBullet } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const result = await enhanceBullet(text);
    res.json({ result });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
}
