// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiZap, FiShield, FiEdit, FiBarChart2, FiUpload, FiFileText, FiLayers } from 'react-icons/fi';

const features = [
  {
    title: "Step-by-Step Resume Builder",
    desc: "Enter your personal info, education, work experience, skills, and certifications with guided form inputs."
  },
  {
    title: "Live Preview & Editor",
    desc: "Edit your resume in real-time with formatting options like fonts, colors, bold/italic, and hyperlink support."
  },
  {
    title: "Template & Theme Customization",
    desc: "Choose from modern templates and color palettes to match your professional style."
  },
  {
    title: "AI-Powered Enhancer & Optimization",
    desc: "Use Gemini AI to enhance bullet points and tailor your resume for specific job roles and descriptions."
  },
  {
    title: "Resume Upload & Review",
    desc: "Upload existing resumes for AI-powered analysis of structure, content quality, and improvement suggestions."
  },
  {
    title: "ATS Compatibility & Job Match Scoring",
    desc: "Check how your resume performs with ATS and get match scores against job descriptions with improvement tips."
  },
  {
    title: "Version History & Feedback Reports",
    desc: "Track resume changes over time and receive concise feedback reports highlighting strengths and areas to improve."
  },
  {
    title: "Secure Profiles & PDF Export",
    desc: "Your data is securely stored, and you can download polished, hyperlink-enabled PDFs anytime."
  }
];

const icons = [
  FiEdit,
  FiLayers,
  FiFileText,
  FiZap,
  FiUpload,
  FiBarChart2,
  FiCheckCircle,
  FiShield,
];

const steps = [
  {
    id:1,
    text: "Create an account or log in to your existing account."
  },{
    id:2,
    text: "Choose a template and start filling in your details."
  },
  {
    id:3,
    text: "Use the AI-powered features to enhance your resume."
  },
  {
    id:4,
    text: "Preview your resume and make any final adjustments."
  },
  {
    id:5,
    text: "Download your resume in PDF format or share it online."
  }]

const Home = () => {


  return (
    <div className="bg-gray-100 text-primary">

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Craft a Winning Resume with <br />
            <span className="text-6xl text-black font-extrabold">Resu<span className="text-sky-700">Mate</span></span>
          </h1>
          <p className="text-lg mb-6">Build ATS-friendly, professional resumes in minutes — powered by AI.</p>
          <div className="flex gap-4">
            <Link to="/signup" className="bg-sky-700 text-white px-6 py-2 rounded hover:bg-opacity-90">Create Resume</Link>
            <Link to="/login" className="bg-black text-white px-6 py-2 rounded hover:bg-opacity-90">Upload Resume</Link>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="/resume.png"
            alt="Resume preview"
            className="w-full h-auto max-w-[500px] mx-auto"
            loading="lazy"
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-semibold mb-10 text-center">Why Use ResuMate?</h2>
        <div className="grid md:grid-cols-3 gap-8 place-items-center place-content-center">
          {features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-start gap-4"
              >
                <div className="p-3 bg-sky-700/10 rounded-full text-sky-700">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-black">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-sky-800/10 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Helping Careers Take Off 🚀</h2>
        <p className="text-xl mb-6">
          More than <span className="text-sky-700 font-bold">12,000+</span> resumes built, <span className="text-green-600 font-bold">3,000+</span> users hired!
        </p>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6 md:px-20 bg-background">
        <h2 className="text-3xl font-semibold mb-10 text-center">How It Works</h2>
        <div className="grid md:grid-cols-5 gap-6 text-center">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-md transition-all duration-300"
            >
              <div className="absolute -top-3 -left-1 bg-bluePrimary text-sky-700  flex items-center justify-center rounded-full text-5xl font-extrabold ">
                {step.id}
              </div>
              <p className="mt-6 font-medium text-gray-800">{step.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Popular Templates */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">Popular Templates</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 place-content-center">
          {[1, 2, 3].map((temp) => (
            <div key={temp} className="border w-fit p-4 flex justify-center flex-col rounded shadow bg-white">
              <img
                src="/resume.png"
                alt={`Template ${temp}`}
                className="h-[300px] w-fit mb-3"
                loading="lazy"
              />
              <p className="text-center font-medium">Modern Template {temp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-16 bg-white text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">Watch How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <iframe
            className="w-full h-64 md:h-96 rounded shadow"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Demo Video"
            allowFullScreen
          />
        </div>
      </section>

      {/* Companies */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-8">Our Resumes Got Users Into</h2>
        <div className="flex flex-wrap justify-center gap-6 text-bluePrimary font-medium">
          {['Google', 'Amazon', 'Microsoft', 'TCS', 'Wipro'].map((company, i) => (
            <div key={i}>{company}</div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 md:px-20 bg-[#f0f4f8] text-center">
        <h2 className="text-3xl font-semibold mb-8">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-white p-6 rounded shadow">
              <p className="text-sm italic mb-2">"This platform helped me land my dream job!"</p>
              <p className="text-sm font-bold">User {id}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold mb-8 text-center">FAQs</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: "Is ResuMate free to use?", a: "Yes! Our core features are completely free." },
            { q: "Can I download my resume?", a: "Absolutely. You can export as PDF with styling intact." },
          ].map((faq, i) => (
            <details key={i} className="border p-4 rounded bg-white">
              <summary className="font-medium cursor-pointer">{faq.q}</summary>
              <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">Get in Touch</h2>
        <form className="max-w-xl mx-auto space-y-4">
          <input type="text" placeholder="Name" className="w-full px-4 py-2 border rounded" required />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" required />
          <textarea placeholder="Your message..." rows="4" className="w-full px-4 py-2 border rounded" required></textarea>
          <button type="submit" className="bg-bluePrimary text-white px-6 py-2 rounded hover:bg-opacity-90">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
