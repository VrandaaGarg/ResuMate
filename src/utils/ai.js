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
