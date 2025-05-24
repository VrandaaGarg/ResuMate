import { checkATSCompatibility } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resume = req.body;

  if (!resume) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const atsResult = await checkATSCompatibility(resume);
    return res.json(atsResult);
  } catch (err) {
    console.error("AI ATS Scoring Error:", err.message);
    return res.status(500).json({ error: "Failed to evaluate ATS score" });
  }
}
