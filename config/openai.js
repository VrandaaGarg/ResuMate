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
