// api/enhance.js
import express from "express";
import { enhanceBullet } from "../config/openai.js";
import { jobMatching } from "../config/openai.js";
import { checkATSCompatibility } from "../config/openai.js";
import { parseResumeFromFile } from "../config/openai.js";
import { checkATSFromFile } from "../config/openai.js";
import { jobMatchingFromFile } from "../config/openai.js";

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

router.post("/jd-match", async (req, res) => {
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
});

router.post("/jd-match-file", async (req, res) => {
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
});

router.post("/ats-score", async (req, res) => {
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
});

router.post("/parse-resume", async (req, res) => {
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
});

router.post("/ats-check-file", async (req, res) => {
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
});

export default router;
