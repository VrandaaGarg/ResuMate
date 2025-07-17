import { jobMatchingFromFile } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileUrl, jobDescription, style } = req.body;

  if (!fileUrl || !jobDescription) {
    return res.status(400).json({ error: "File URL and Job Description are required" });
  }

  try {
    const result = await jobMatchingFromFile(
      fileUrl,
      jobDescription,
      style || "concise"
    );

    res.json(result);
  } catch (error) {
    console.error("AI JD Match from File Error:", error.message);
    res.status(500).json({ error: "AI matching from file failed" });
  }
}
