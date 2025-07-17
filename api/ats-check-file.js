import { checkATSFromFile } from "../config/openai.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileUrl } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const atsResult = await checkATSFromFile(fileUrl);
    return res.json({ success: true, data: atsResult });
  } catch (err) {
    console.error("ATS File Analysis Error:", err.message);
    return res.status(500).json({
      error: "Failed to analyze ATS compatibility",
      details: err.message,
    });
  }
}
