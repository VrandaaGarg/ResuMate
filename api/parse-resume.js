import { parseResumeFromFile } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileUrl } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const parsedResume = await parseResumeFromFile(fileUrl);
    return res.json({ success: true, data: parsedResume });
  } catch (err) {
    console.error("Resume Parsing Error:", err.message);
    return res.status(500).json({
      error: "Failed to parse resume",
      details: err.message,
    });
  }
}
