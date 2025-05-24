const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Enhance a single bullet point
export async function enhance(text) {
  try {
    const res = await fetch(`${API_BASE}/enhance-bullet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    return data.result || "";
  } catch (err) {
    console.error("AI Enhance Error:", err);
    return "";
  }
}

export async function matchJD({ style, jobDescription, resume }) {
  try {
    const res = await fetch("/api/jd-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style, jobDescription, resume }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ matchJD error", err);
    return { error: "AI matching failed" };
  }
}

export async function atsScore(resume) {
  try {
    const res = await fetch("/api/ats-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch ATS score");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ ATS Score API Error:", err.message);
    return { error: err.message || "ATS scoring failed" };
  }
}
