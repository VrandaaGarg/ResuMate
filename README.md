# ResuMate – AI-Powered Resume Builder and Optimizer

ResuMate is an intelligent, AI-powered platform that helps users build, optimize, and perfect their resumes to stand out in today’s competitive job market.

With a live editor, customizable formatting, and Gemini AI integration, users can create professional, ATS-friendly resumes while receiving real-time feedback and suggestions.

Whether building a first resume or refining a seasoned one, ResuMate empowers users to craft resumes that truly showcase their skills and maximize career opportunities.

---

## 🚀 Features

- **Build Resume from Scratch**  
  Step-by-step form collects essential information like Personal Info, Work Experience, Education, Projects, Skills, Certifications.

- **Live Resume Preview with Formatting**  
  Real-time editable preview where users can modify font sizes, text colors, bold/italic/underline styling, and insert hyperlinks (e.g., LinkedIn, GitHub).

- **Theme and Template Selection**  
  Choose from different color palettes and modern resume templates for personal styling.

- **Three Professional Templates**

  - **Classic:** A timeless, formal layout for professional roles
  - **Sidebar:** A modern split-layout with a colored sidebar
  - **Standard:** A clean, simple design for broad applications

- **AI-Powered Bullet Point Enhancer**  
  OpenAI suggests improved phrasing, action verbs, and quantifications for achievements and responsibilities.

- **Role-Specific Optimization**  
  Optimize your resume for specific job roles (e.g., "Software Engineer at Google") for better alignment with job requirements.

- **ATS Compatibility Checker**  
  AI analyzes your resume and provides a score (out of 100) indicating how well it will perform with Applicant Tracking Systems (ATS).

- **Job Description Matching**  
  Paste a job description and get a matching score with suggestions to improve your resume for the target role.

- **Resume Feedback Report**  
  After generating or uploading a resume, receive a feedback report highlighting strengths, weaknesses, and actionable recommendations.

- **Download Resume as PDF**  
  Download your finalized resume as a polished PDF, preserving all formatting and embedded hyperlinks.

- **Secure User Profiles**  
  User authentication and resume storage are managed securely via Firebase services.

---

## 🖼️ Templates Included

- **Classic Template:**  
  Traditional and formal, suitable for all industries.

- **Sidebar Template:**  
  Stylish left-sidebar layout with color accent, perfect for modern resumes.

- **Standard Template:**  
  Clean and minimal for broad, professional applications.

Switch between templates anytime with instant live preview!

---

## 🛠️ Tech Stack

| Layer              | Technology                                                          |
| ------------------ | ------------------------------------------------------------------- |
| Frontend Framework | [React.js (Vite Setup)](https://vitejs.dev/)                        |
| Styling            | [TailwindCSS](https://tailwindcss.com/)                             |
| Animations         | [Framer Motion](https://www.framer.com/motion/)                     |
| Authentication     | [Firebase Auth](https://firebase.google.com/products/auth)          |
| Database           | [Firebase Database](https://firebase.google.com/products/firestore) |
| State Management   | React Context API                                                   |
| AI Engine          | OpenAI API (for resume optimization,ATS check & feedback)           |
| PDF Download       | [react-to-print](https://www.npmjs.com/package/react-to-print)      |
| Color Picker       | react-color (optional for user theme customization)                 |
| Hosting            | [Vercel](https://vercel.com/)                                       |

---

## 🔒 Security

- API keys managed securely through environment variables (`.env`)
- User authentication and resume data fully secured via Firebase
- Proper CORS handling and client-side access protection
- Only public and non-sensitive info handled on the frontend

---

## 🎯 Project Mission

> "To empower job seekers with smarter, AI-enhanced resume building tools, enabling them to craft personalized, professional, and impactful resumes that maximize career opportunities."

---

## 📦 Getting Started

Clone the repo, install dependencies, and run locally:

```bash
git clone https://github.com/VrandaaGarg/resumate.git
cd resumate
npm install
npm run dev
```
