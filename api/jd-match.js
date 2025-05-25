import { jobMatching } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { style, jobDescription, resume } = req.body;

  if (!jobDescription || !resume) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const result = await jobMatching(
      style || "concise",
      jobDescription,
      resume
    );

    res.json(result);
  } catch (error) {
    console.error("AI JD Match Error:", error.message);
    res.status(500).json({ error: "AI matching failed" });
  }
}
