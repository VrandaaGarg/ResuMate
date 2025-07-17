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
    const res = await fetch(`${API_BASE}/jd-match`, {
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
    const res = await fetch(`${API_BASE}/ats-score`, {
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

// Parse resume from uploaded file URL
export async function parseResumeFromUpload(fileUrl) {
  try {
    console.log("Parsing resume from URL:", fileUrl); // Debug log

    const res = await fetch(`${API_BASE}/parse-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });

    console.log("API Response status:", res.status); // Debug log

    const data = await res.json();
    console.log("API Response data:", data); // Debug log

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to parse resume");
    }

    return data.data;
  } catch (err) {
    console.error("Resume Parsing Error:", err);
    throw err;
  }
}

// Check ATS compatibility from uploaded file URL
export async function checkATSFromUpload(fileUrl) {
  try {
    console.log("Checking ATS compatibility from URL:", fileUrl); // Debug log

    const res = await fetch(`${API_BASE}/ats-check-file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });

    console.log("ATS Check API Response status:", res.status); // Debug log

    const data = await res.json();
    console.log("ATS Check API Response data:", data); // Debug log

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to check ATS compatibility");
    }

    return data.data;
  } catch (err) {
    console.error("ATS Check Error:", err);
    throw err;
  }
}
