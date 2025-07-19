# ResuMate – Your AI-Powered Resume Sidekick 🚀

Tired of sending your resume into the black hole of job applications? Feeling like your resume has less personality than a rock? **ResuMate is here to save the day!**

ResuMate is an intelligent, AI-powered platform that helps you build, optimize, and perfect your resume to stand out in today’s competitive job market. Think of it as your personal career coach, but without the hourly fee and with more GIFs. 😉

![ResuMate](/public/home.png)

With a live editor and customizable formatting, you can create professional, ATS-friendly resumes while receiving real-time feedback and suggestions. Whether you're crafting your very first resume or polishing a seasoned one, ResuMate empowers you to create a document that truly showcases your skills and maximizes your career opportunities.

---

## ✨ What's New?

We've been busy cooking up some awesome new features to make your job hunt even easier:

- **📄 Upload & Analyze:** Got an existing resume? Don't let it go to waste! Upload your resume (PDF or DOCX) and instantly get:
  - **ATS Compatibility Score:** Find out if your resume can get past those pesky robot gatekeepers.
  - **Job Fit Analysis:** See how well your resume stacks up against a specific job description.
- **📝 Create from Upload:** Love your old resume but want to give it a makeover? Upload it and we'll automagically populate our templates with your information. From there, you can edit, optimize, and give it a fresh new look.

---

## 🚀 Core Features

- **Build From Scratch:** Step-by-step form to guide you through all the essential sections: Personal Info, Work Experience, Education, Projects, Skills, and Certifications.
- **Live Resume Preview:** See your changes in real-time. Tweak fonts, colors, and styles until it's _just right_.
- **Stunning Templates:** Choose from a variety of modern, professional templates. Because looks do matter.
  - **Classic:** Timeless and formal. For when you need to be extra fancy.
  - **Sidebar:** A modern split-layout with a pop of color.
  - **Standard:** Clean, simple, and gets the job done.
- **AI Bullet Point Enhancer:** Turn your boring bullet points into powerful, action-oriented statements that scream "HIRE ME!"
- **Role-Specific Optimization:** Tailor your resume for a specific role (e.g., "Software Engineer at Google") to align with what recruiters are looking for.
- **ATS Compatibility Checker:** Our AI gives your resume a score (out of 100) on its ATS-friendliness.
- **Job Description Matching:** Paste a job description and get a match score, along with suggestions to improve your resume for that specific role.
- **Download as PDF:** Get a pixel-perfect PDF of your masterpiece, ready to be sent out into the world.
- **Secure User Profiles:** Your data is safe with us, thanks to Firebase.

---

## 🖼️ Templates Included

- **Classic Template:** Traditional and formal, suitable for all industries.
- **Sidebar Template:** Stylish left-sidebar layout with color accent, perfect for modern resumes.
- **Standard Template:** Clean and minimal for broad, professional applications.

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
| File Storage       | [Appwrite](https://appwrite.io/)                                    |
| State Management   | React Context API                                                   |
| AI Engine          | OpenAI API (for resume optimization,ATS check & feedback)           |
| PDF Download       | [react-to-print](https://www.npmjs.com/package/react-to-print)      |
| Color Picker       | react-color (optional for user theme customization)                 |
| Hosting            | [Vercel](https://vercel.com/)                                       |

---

## 🔒 Security

- API keys managed securely through environment variables (`.env`).
- User authentication and resume data fully secured via Firebase.
- Proper CORS handling and client-side access protection.
- Only public and non-sensitive info handled on the frontend.

---

## 🎯 Our Mission

> "To empower job seekers with smarter, AI-enhanced resume building tools, enabling them to craft personalized, professional, and impactful resumes that maximize career opportunities."

Basically, we want to help you get that bread. 🍞

![Success GIF](https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif)

---

## 📦 Getting Started

Ready to build the resume of your dreams?

```bash
git clone https://github.com/VrandaaGarg/resumate.git
cd resumate
npm install
npm run dev
```

Now go get 'em! 💼

<!-- /////////////resumate is done -->
