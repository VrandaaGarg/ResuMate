// api/enhance.js
import express from "express";
import { enhanceBullet } from "../config/openai.js";

const router = express.Router();

router.post("/enhance-bullet", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const result = await enhanceBullet(text);
    res.json({ result });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
