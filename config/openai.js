// config/openai.js
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

export async function enhanceBullet(text) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Hey, I’m writing my resume and I’d love your help improving this line. 
Can you rewrite it using stronger action verbs and ATS friendly language 
and make it sound more professional and polished — but still concise?

Here’s what I wrote:
"${text}"

Please return only the improved version — no explanations, no extras. Also if html tags are present, please return the text in that format.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini-2025-04-14",
    temperature: 0.5,
    messages: [
      { role: "system", content: "You are a resume enhance assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export async function jobMatching(style, jobDescription, resume) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Safe string cleaner
  const sanitize = (s) =>
    typeof s === "string"
      ? s
          .replace(/[\n\r]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  // Extract and sanitize only needed fields
  const cleanResume = {
    description: sanitize(resume.description),
    skills: (resume.skills || [])
      .map((s) => {
        const domain = sanitize(s.domain);
        const langs = Array.isArray(s.languages)
          ? s.languages.map(sanitize).join(", ")
          : "";
        return `${domain}: ${langs}`;
      })
      .filter(Boolean),

    projects: (resume.projects || []).map((p) => ({
      name: sanitize(p.name),
      description: sanitize(p.description),
    })),
    experience: (resume.experience || []).map((e) => ({
      role: sanitize(e.role),
      company: sanitize(e.company),
      description: sanitize(e.description),
    })),
    achievements: (resume.achievements || [])
      .map((a) =>
        [sanitize(a.title), sanitize(a.description)].filter(Boolean).join(": ")
      )
      .filter(Boolean),
  };

  // Final prompt
  const prompt = `
You are an expert resume evaluator.

Your task is to critically evaluate how well the given resume aligns with the provided job description. Return a match score and structured feedback to help the candidate optimize their resume and career alignment.

🧠 Response Expectations:
- Be **highly specific** to the actual content in the resume and job description.
- DO NOT fabricate skills or numbers not mentioned in the resume.
- DO NOT output anything outside the JSON block.
- DO NOT use markdown, HTML, or any formatting.
- Highlight if any point in resume lacks **quantifiable impact** or **measurable achievements** (e.g., % growth, revenue impact, user growth).
- Include **examples** in each section (strengths, weaknesses, suggestions) to make your feedback practical and relatable.
-Add only the matched skills from the job description which genuinely are needed in the job not all skills in the resume.
-Also be straightforward about missing skills that are essential for the job.
-In the end give notes in a friendly manner to encourage user and tell him his strong points and what to focus on next

🎯 Your tone must be:
${
  sanitize(style) === "elaborative"
    ? "Highly elaborative, well-reasoned, descriptive, and backed by examples for clarity."
    : "Professional and descriptive. Avoid over-summarizing."
}

📦 Return ONLY a valid raw JSON object with the following structure:
{
  "score": 85,
  "strengths": [
    "Strong React-based frontend project: 'SmartShelf' demonstrates modern UI skills.",
    "Clear achievement: 'Improved API response time by 40% using caching'."
  ],
  "weaknesses": [
    "Lacks quantifiable metrics in most achievements (e.g., % increase, revenue impact).",
    "No mention of CI/CD or deployment tools which are expected in the job description."
  ],
  "suggestionsToAlignBetter": [
    "Add concrete metrics in projects and experience (e.g., user count, performance gain).",
    "Mention cloud tools or backend APIs if you’ve used them even slightly."
  ],
  "skillGapAnalysis": {
    "matchedSkills": ["React", "Tailwind", "Git"],
    "missingSkills": [
      "Docker and Kubernetes",
      "Unit testing frameworks like Jest or Mocha"
    ],
    "recommendations": [
      "Start with basic Docker usage in personal projects.",
      "Take a short course on automated testing and integrate with one project.",
      "Explore cloud deployment using Vercel, Netlify, or AWS for hands-on experience."
    ]
  },
  "notes":[
    "you have a solid foundation in React and frontend development.",
    "Focus on enhancing backend and deployment skills to match the job requirements.",
    "Consider contributing to open source to gain experience with CI/CD tools."
  ]
}

---

📝 Job Description:
${sanitize(jobDescription)}

📄 Resume:
Description: ${cleanResume.description}
Skills: ${cleanResume.skills.join(", ")}
Projects: ${cleanResume.projects
    .map((p) => `${p.name}: ${p.description}`)
    .join("; ")}
Experience: ${cleanResume.experience
    .map((e) => `${e.role} at ${e.company}: ${e.description}`)
    .join("; ")}
Achievements: ${cleanResume.achievements.join("; ")}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini-2025-04-14",
    temperature: 0.7,
    messages: [
      { role: "system", content: "You are an expert resume evaluator." },
      { role: "user", content: prompt },
    ],
    max_tokens: style === "elaborative" ? 1200 : 800,
  });

  const raw = response.choices[0]?.message?.content?.trim() || "";

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("❌ Invalid JSON from AI:\n", raw);
    throw new Error("Invalid JSON from AI");
  }
}

function sanitize(text) {
  return typeof text === "string" ? text.trim().replace(/\s+/g, " ") : "";
}

//func to check ATS score
export async function checkATSCompatibility(resume) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an expert in Applicant Tracking Systems (ATS).

Your job is to evaluate how well the given resume aligns with ATS best practices and return:

✅ JSON response in the EXACT structure:
{
  "atsScore": 87,
  "sectionWiseFeedback": {
    "description": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "skills": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "experience": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "projects": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    },
    "achievements": {
      "missing": [ ... ],
      "suggestions": [ ... ]
    }
  },
  "generalTips": [
    ...
  ]
}

📌 Instructions & Constraints:
- DO NOT fabricate content. Only work with the provided resume.
- DO NOT mention or suggest removing HTML tags (they are for formatting).
- DO NOT suggest adding new resume sections outside of: description, skills, experience, projects, achievements.
- DO NOT include sections that are already complete (omit them from feedback).
- DO NOT output anything outside the JSON block.
- Your job is to boost **ATS compatibility**, not visual design.
- In "description", focus on summarizing the user profile, not listing tech skills already present in "skills".
- If any skill is already mentioned in "skills", do not repeat it in skills section feedback.
-Give user examples of how to improve each section, not just general advice.
- Make all suggestions **actionable, realistic, and ATS-specific**.
- If a field is good, **don’t include it in \`sectionWiseFeedback\`**.
-Skill section contain both domain and languages, so according to that give suggestions
- If a section is missing, include it in \`sectionWiseFeedback\` with suggestions to add it.

Resume:
User Description: ${sanitize(resume.description)}

Skills: ${(resume.skills || []).map((s) => sanitize(s.domain || s)).join(", ")}

Projects: ${(resume.projects || [])
    .map((p) => `${sanitize(p.name)}: ${sanitize(p.description)}`)
    .join("; ")}

Experience: ${(resume.experience || [])
    .map(
      (e) =>
        `${sanitize(e.role)} at ${sanitize(e.company)}: ${sanitize(
          e.description
        )}`
    )
    .join("; ")}

Achievements: ${(resume.achievements || [])
    .map((a) =>
      [sanitize(a.title), sanitize(a.description)].filter(Boolean).join(": ")
    )
    .join("; ")}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini-2025-04-14",
    temperature: 0.5,
    messages: [
      { role: "system", content: "You are an expert ATS resume evaluator." },
      { role: "user", content: prompt },
    ],
    max_tokens: 800,
  });

  let raw = response.choices[0]?.message?.content?.trim() || "";

  // 🔧 Fix: Strip markdown formatting if present
  if (raw.startsWith("```json") || raw.startsWith("```")) {
    raw = raw.replace(/```json|```/g, "").trim();
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse ATS JSON:\n", raw);
    throw new Error("Invalid ATS JSON from AI");
  }
}
