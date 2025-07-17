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
    max_tokens: 1200,
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

// Function to parse uploaded resume and format according to ResuMate template
export async function parseResumeFromFile(fileUrl) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // Step 1: Download the file from the URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    // Step 2: Get file content as buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Step 3: Extract filename and ensure it has proper extension
    let fileName = fileUrl.split("/").pop() || "resume.pdf";
    const contentType =
      fileResponse.headers.get("content-type") || "application/pdf";

    // Ensure filename has proper extension based on content type
    if (!fileName.includes(".")) {
      if (contentType.includes("pdf")) {
        fileName += ".pdf";
      } else if (contentType.includes("msword")) {
        fileName += ".doc";
      } else if (contentType.includes("wordprocessingml")) {
        fileName += ".docx";
      } else if (contentType.includes("text/plain")) {
        fileName += ".txt";
      } else {
        fileName += ".pdf"; // default fallback
      }
    }

    console.log("Processing file:", fileName, "Content-Type:", contentType);

    // Step 4: Create a File object from the buffer
    const file = new File([fileBuffer], fileName, {
      type: contentType,
    });

    // Step 4: Upload file to OpenAI for user_data purpose
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "user_data",
    });

    console.log("✅ File uploaded to OpenAI:", uploadedFile.id);
    console.log("📄 Processing file:", fileName);
    console.log("🤖 Starting AI resume parsing...");

    // Step 5: Use the /v1/responses endpoint with input_file
    const prompt = `You are an expert resume parser. Analyze the uploaded resume file and extract ONLY the actual information present in the document.

IMPORTANT: Do NOT provide sample or placeholder data. Only extract real information from the uploaded resume file.

Extract and structure the information in this exact JSON format:

{
  "name": "Full Name",
 "description": "Professional summary or objective statement",
  "contact": {
    "email": "email@gmail.com",
    "phone": "1234567890 any 10 digit number",
    "location": "City, State/Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "websiteURL": "https://portfolio.com or any with personal website domain"
  },
  "skills": [{
    "domain": "Skill Category (e.g., Programming, Design,frontend,backend, etc.)",
    "languages": ["Language 1", "Language 2" ...]
  }],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "technologies": "Technologies used",
      "years": "Duration of employment",
      "description": "Job description and responsibilities"
      }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description with technologies used and achievements",
     "github": "https://github.com/username/project",
      "demo": "https://project-demo.com"
    }
  ],
  "education": 
    {
  "college": "College Name",
      "degree": "Degree Name",
      "specialization": "Specialization Area if any",
      "location": "City, State/Country",
      "startYear": "Start Year",
      "endYear": "End Year",
      "cgpa": "CGPA if mentioned",
      "school": "School Name if different from college",
      "tenth": "10th Percentage",
      "twelfth": "12th Percentage",
 }
  ,
  "achievements": [
    {
      "title": "Achievement Title",
      "description": "Description of the achievement"
    "year": "Year of Achievement",
      "month": "Month of Achievement"
      }
  ],
  
}

Return ONLY the JSON object with actual data from the resume, no additional text or formatting. If information is not available in the resume, use empty strings "" or empty arrays [].`;

    // Make request to /v1/responses endpoint
    console.log("🔄 Sending request to OpenAI /v1/responses endpoint...");
    console.log("📋 Request payload:", {
      model: "gpt-4.1",
      file_id: uploadedFile.id,
      prompt_length: prompt.length,
    });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_file",
                file_id: uploadedFile.id,
              },
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      console.log("❌ OpenAI API Error - Status:", response.status);
      const errorData = await response.json();
      console.log("❌ Error details:", errorData);
      throw new Error(
        `OpenAI API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    console.log("✅ Received response from OpenAI");
    console.log("🔍 Parsing response data...");

    const responseData = await response.json();
    console.log(
      "📊 Full response data:",
      JSON.stringify(responseData, null, 2)
    );
    console.log("📊 Response structure:", {
      hasOutput: !!responseData.output,
      outputLength: responseData.output?.length || 0,
      hasContent: !!responseData.output?.[0]?.content?.[0]?.text,
      status: responseData.status,
      responseStructure: responseData.output?.[0]
        ? Object.keys(responseData.output[0])
        : "no output",
    });

    // Extract text from the /v1/responses format
    const responseText =
      responseData.output?.[0]?.content?.[0]?.text?.trim() || "";

    console.log("📝 Raw response length:", responseText.length);
    console.log("📄 Full raw response:", responseText);

    if (!responseText || responseText.length === 0) {
      console.log("❌ Empty response from OpenAI");
      throw new Error("Empty response from OpenAI API");
    }

    // Clean up the response
    console.log("🧹 Cleaning response format...");
    let cleanedResponse = responseText;
    if (cleanedResponse.startsWith("```json")) {
      console.log("🔍 Detected markdown code block, removing...");
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }

    console.log("🔄 Parsing JSON response...");

    try {
      const parsedData = JSON.parse(cleanedResponse);
      console.log("✅ Successfully parsed JSON response");
      console.log("📊 Parsed data structure:", {
        hasName: !!parsedData.name,
        hasContact: !!parsedData.contact,
        skillsCount: parsedData.skills?.length || 0,
        experienceCount: parsedData.experience?.length || 0,
        educationCount: parsedData.education?.length || 0,
        projectsCount: parsedData.projects?.length || 0,
      });

      // Cleanup: Delete the uploaded file
      console.log("🧹 Cleaning up - deleting uploaded file:", uploadedFile.id);
      await openai.files.del(uploadedFile.id);
      console.log("✅ File deleted successfully");

      console.log("🎉 Resume parsing complete!");
      return parsedData;
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      console.log(
        "📄 Raw response that failed parsing:",
        cleanedResponse.substring(0, 500) + "..."
      );
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("❌ Resume parsing error:", error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}

// Function to check ATS compatibility directly from uploaded file
export async function checkATSFromFile(fileUrl) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    console.log("🔍 Starting ATS analysis from uploaded file...");

    // Step 1: Download the file from the URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    // Step 2: Get file content as buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Step 3: Extract filename and ensure it has proper extension
    let fileName = fileUrl.split("/").pop() || "resume.pdf";
    const contentType =
      fileResponse.headers.get("content-type") || "application/pdf";

    // Ensure filename has proper extension based on content type
    if (!fileName.includes(".")) {
      if (contentType.includes("pdf")) {
        fileName += ".pdf";
      } else if (contentType.includes("msword")) {
        fileName += ".doc";
      } else if (contentType.includes("wordprocessingml")) {
        fileName += ".docx";
      } else if (contentType.includes("text/plain")) {
        fileName += ".txt";
      } else {
        fileName += ".pdf"; // default fallback
      }
    }

    console.log("📄 Processing file for ATS analysis:", fileName);

    // Step 4: Create a File object from the buffer
    const file = new File([fileBuffer], fileName, {
      type: contentType,
    });

    // Step 5: Upload file to OpenAI for user_data purpose
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "user_data",
    });

    console.log(
      "✅ File uploaded to OpenAI for ATS analysis:",
      uploadedFile.id
    );

    // Step 6: ATS analysis prompt
    const atsPrompt = `You are an expert in Applicant Tracking Systems (ATS) analysis.

Analyze the uploaded resume file and evaluate how well it aligns with ATS best practices.

Return a JSON response in this EXACT structure:

{
  "atsScore": 87,
  "sectionWiseFeedback": {
    "description": {
      "missing": ["Professional summary missing", "No quantifiable achievements"],
      "suggestions": ["Add a compelling professional summary", "Include measurable results"]
    },
    "skills": {
      "missing": ["Technical skills not clearly listed", "Missing industry keywords"],
      "suggestions": ["Create a dedicated skills section", "Include relevant technical keywords"]
    },
    "experience": {
      "missing": ["Job descriptions lack keywords", "No quantifiable achievements"],
      "suggestions": ["Use action verbs and industry keywords", "Add metrics and results"]
    },
    "projects": {
      "missing": ["Projects not clearly described", "Missing technical details"],
      "suggestions": ["Describe projects with technical details", "Include technologies used"]
    },
    "achievements": {
      "missing": ["No quantifiable achievements", "Missing awards or recognition"],
      "suggestions": ["Add measurable accomplishments", "Include relevant certifications"]
    }
  },
  "generalTips": [
    "Use standard section headings like 'Experience', 'Education', 'Skills'",
    "Include relevant keywords from job descriptions",
    "Use bullet points for better readability",
    "Ensure consistent formatting throughout"
  ]
}

IMPORTANT:
- Only analyze the actual content in the uploaded resume
- Do NOT suggest adding sections that don't exist if they're not relevant
- Focus on ATS optimization, not visual design
- If a section is well-formatted, don't include it in sectionWiseFeedback
- Provide actionable, specific suggestions
- Return ONLY the JSON object, no additional text`;

    // Step 7: Make request to /v1/responses endpoint
    console.log("🤖 Analyzing resume for ATS compatibility...");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_file",
                file_id: uploadedFile.id,
              },
              {
                type: "input_text",
                text: atsPrompt,
              },
            ],
          },
        ],
      }),
    });

    console.log(
      "📡 ATS Analysis response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      console.log("❌ OpenAI API Error - Status:", response.status);
      const errorData = await response.json();
      console.log("❌ Error details:", errorData);
      throw new Error(
        `OpenAI API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    console.log("✅ Received ATS analysis from OpenAI");

    const responseData = await response.json();

    // Extract text from the /v1/responses format
    const responseText =
      responseData.output?.[0]?.content?.[0]?.text?.trim() || "";

    console.log("📝 ATS analysis response length:", responseText.length);
    console.log("📄 ATS analysis response:", responseText);

    if (!responseText || responseText.length === 0) {
      console.log("❌ Empty ATS analysis response from OpenAI");
      throw new Error("Empty ATS analysis response from OpenAI API");
    }

    // Clean up the response
    console.log("🧹 Cleaning ATS analysis response format...");
    let cleanedResponse = responseText;
    if (cleanedResponse.startsWith("```json")) {
      console.log("🔍 Detected markdown code block, removing...");
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }

    console.log("🔄 Parsing ATS analysis JSON response...");

    try {
      const atsData = JSON.parse(cleanedResponse);
      console.log("✅ Successfully parsed ATS analysis JSON response");
      console.log("📊 ATS Score:", atsData.atsScore);

      // Cleanup: Delete the uploaded file
      console.log("🧹 Cleaning up - deleting uploaded file:", uploadedFile.id);
      await openai.files.del(uploadedFile.id);
      console.log("✅ File deleted successfully");

      console.log("🎉 ATS analysis complete!");
      return atsData;
    } catch (parseError) {
      console.error(
        "❌ Failed to parse ATS analysis JSON response:",
        parseError
      );
      console.log(
        "📄 Raw response that failed parsing:",
        cleanedResponse.substring(0, 500) + "..."
      );
      throw new Error("Invalid JSON response from ATS analysis");
    }
  } catch (error) {
    console.error("❌ ATS analysis error:", error);
    throw new Error(`Failed to analyze ATS compatibility: ${error.message}`);
  }
}
