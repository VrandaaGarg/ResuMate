// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiZap,
  FiShield,
  FiEdit,
  FiBarChart2,
  FiUpload,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import {
  FaChevronDown,
  FaPaintBrush,
  FaUserAlt,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Marquee from "../Components/Marquee";
import { FaRocket, FaUpload } from "react-icons/fa";
import StatsSection from "../Components/StatsSection";
import { useState } from "react";

const features = [
  {
    title: "Step-by-Step Resume Builder",
    desc: "Enter your personal info, education, work experience, skills, and certifications with guided form inputs.",
  },
  {
    title: "Live Preview & Editor",
    desc: "Edit your resume in real-time with formatting options like fonts, colors, bold/italic, and hyperlink support.",
  },
  {
    title: "Template & Theme Customization",
    desc: "Choose from modern templates and color palettes to match your professional style.",
  },
  {
    title: "AI-Powered Enhancer & Optimization",
    desc: "Use Gemini AI to enhance bullet points and tailor your resume for specific job roles and descriptions.",
  },
  {
    title: "Resume Upload & Review",
    desc: "Upload existing resumes for AI-powered analysis of structure, content quality, and improvement suggestions.",
  },
  {
    title: "ATS Compatibility & Job Match Scoring",
    desc: "Check how your resume performs with ATS and get match scores against job descriptions with improvement tips.",
  },
  {
    title: "Version History & Feedback Reports",
    desc: "Track resume changes over time and receive concise feedback reports highlighting strengths and areas to improve.",
  },
  {
    title: "Secure Profiles & PDF Export",
    desc: "Your data is securely stored, and you can download polished, hyperlink-enabled PDFs anytime.",
  },
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
    id: 1,
    heading: "Create Account",
    text: "Create an account or log in to your existing account.",
  },
  {
    id: 2,
    heading: "Choose Template",
    text: "Pick a professional template and start entering your details.",
  },
  {
    id: 3,
    heading: "Enhance with AI",
    text: "Use the AI-powered suggestions to make your resume shine.",
  },
  {
    id: 4,
    heading: "Preview & Edit",
    text: "Check your resume in real time and make any adjustments.",
  },
  {
    id: 5,
    heading: "Download & Share",
    text: "Download as a polished PDF or share it online instantly.",
  },
];

const Template = [
  {
    id: 1,
    name: "Modern Template",
    image: "/resume.png",
    description: "A clean and modern template for a professional look.",
  },
  {
    id: 2,
    name: "Classic Template",
    image: "/resume.png",
    description: "A classic design that is timeless and effective.",
  },
  {
    id: 3,
    name: "Creative Template",
    image: "/resume.png",
    description: "A creative layout that stands out from the crowd.",
  },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    image: "user1.jpeg",
    feedback:
      "ResuMate helped me land my first internship. The AI suggestions were incredibly smart and on-point!",
  },
  {
    name: "Simran Kaur",
    image: "user2.jpeg",
    feedback:
      "Building my resume felt effortless and modern. Loved the templates and the ATS scoring feature!",
  },
  {
    name: "Rahul Sharma",
    image: "user3.jpeg",
    feedback:
      "It’s the best resume builder I’ve used — simple, elegant, and very effective with job matching tools.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const faqs = [
    {
      q: "Is ResuMate free to use?",
      a: "Yes! Our core features including resume creation and AI enhancements are completely free.",
    },
    {
      q: "Can I download my resume?",
      a: "Absolutely. You can export your resume in PDF format with all styling and links preserved.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, ResuMate uses secure storage and never shares your information with third parties.",
    },
    {
      q: "Can I customize fonts and colors?",
      a: "Yes! Our live editor lets you tweak fonts, sizes, colors, and templates in real-time.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90lvh] px-6 md:px-20 py-9 flex flex-col items-center justify-center text-center gap-8 bg-gray-100 ">
        {/* Gradient Background Blobs */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-blue-300 opacity-40 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-28 -right-32 w-96 h-96 bg-green-200 opacity-20 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-700 opacity-10 blur-2xl rounded-full z-0" />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl mb-4 [font-family:'Lilita_One',cursive] leading-tight">
            Craft a Winning Resume with <br />
            <span className="text-6xl text-black font-extrabold">
              Resu<span className="text-sky-700">Mate</span>
            </span>
          </h1>
          <p className="text-lg mb-6 text-gray-800">
            AI-powered platform that helps users build, optimize, and perfect
            their resumes to stand out in today’s competitive job market. With a
            live editor, customizable formatting, and Gemini AI integration,
            users can create professional, ATS-friendly resumes while receiving
            real-time feedback and suggestions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-sky-700 text-white px-6 py-3.5 rounded-4xl hover:bg-sky-800 transition-shadow shadow-md"
            >
              <FaRocket /> Create Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-4xl hover:bg-opacity-90 transition-shadow shadow-md "
            >
              <FaUpload /> Upload Resume
            </motion.button>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 md:px-20 bg-gray-100 relative ">
        {/* Background Gradient Accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full z-0" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-200 opacity-10 blur-3xl rounded-full z-0" />

        <h2 className="text-4xl font-semibold text-center text-black mb-14 relative z-10 [font-family:'Lilita_One',cursive]">
          Why Use ResuMate?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 place-items-center relative z-10">
          {features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-start gap-4 w-full h-full max-w-sm"
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  className="p-3 bg-[#1271ba]/10 rounded-full text-[#1271ba]"
                >
                  <Icon size={24} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Steps Section */}
      <section className="py-28 px-6 md:px-20 bg-background">
        <h4 className="text-center text-sm uppercase tracking-wider text-sky-700 font-semibold mb-2">
          Step-by-step journey
        </h4>
        <h2 className="text-4xl mb-12 text-center [font-family:'Lilita_One',cursive]">
          How It Works
        </h2>

        <div className="grid md:grid-cols-5 gap-6 text-center">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white border-2  hover:border-sky-700/30 border-sky-600/20 rounded-xl p-6 pt-14 shadow-md group"
            >
              <div className="absolute -top-6 left-0  w-12 h-12 bg-sky-700 text-white text-xl font-bold rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition">
                {step.id}
              </div>
              <h3 className="text-base font-semibold text-sky-700 mb-2">
                {step.heading}
              </h3>
              <p className="text-sm text-gray-700">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Templates */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <h2 className="text-4xl mb-4 text-center [font-family:'Lilita_One',cursive]">
          Popular Templates
        </h2>

        <p className="text-center max-w-2xl mx-auto text-gray-600 mb-10 text-xl">
          Choose from beautifully crafted templates designed for maximum impact.
          Each template is fully customizable — change fonts, colors, layout,
          and structure as you go. Build a professional resume in minutes.
        </p>

        <div className="grid px-40 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {Template.map((temp) => (
            <motion.div
              key={temp.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative  overflow-hidden  "
            >
              {/* Icon */}
              <div className="absolute top-3 right-3 bg-sky-700/10 text-sky-700 p-2 rounded-full">
                <FaPaintBrush size={18} />
              </div>

              {/* Image */}
              <div className="w-full h-[400px]  overflow-hidden">
                <img
                  src={temp.image}
                  alt={`Template ${temp.id}`}
                  className="object-cover w-full h-full rounded-tr-2xl rounded-bl-2xl"
                  loading="lazy"
                />
              </div>

              {/* Caption */}
              <div className="p-4">
                <p className="text-center text-sky-700 font-medium">
                  {temp.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video */}
      <div className="relative mb-36">
        {/* Gradient Background Blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-sky-300 opacity-20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-300 opacity-10 rounded-full blur-3xl z-0"></div>

        {/* Main Section */}
        <section className="relative z-10 bg-sky-700 mx-4 md:mx-44 rounded-3xl my-11 py-12 px-6 md:px-20 ">
          {/* Decorative Comma Icons */}
          <FaQuoteLeft className="absolute -top-2 left-6 text-black text-4xl z-0" />
          <FaQuoteRight className="absolute -bottom-2 right-6 text-black text-4xl z-0" />

          <motion.div
            className="flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Left: Video */}
            <div className="w-full md:w-3/5">
              <div className="relative w-full h-64 md:h-60 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="ResuMate Demo Video"
                  allowFullScreen
                  loading="lazy"
                  rel="noopener"
                />
              </div>
            </div>

            {/* Right: Text */}
            <div className="w-full md:w-2/5 text-white">
              <h2 className="text-2xl md:text-4xl [font-family:'Lilita_One',cursive] mb-4">
                Watch How It Works
              </h2>
              <p className="text-white/85 text-sm leading-relaxed">
                See how ResuMate helps you create, edit, and optimize your
                resume step-by-step with our intuitive editor and AI-powered
                enhancements. In under 2 minutes, you’ll understand how to build
                a standout resume that gets noticed by recruiters and applicant
                tracking systems (ATS).
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Companies */}
      <Marquee />

      {/* Testimonials */}
      <section className="relative py-20 px-6 md:px-20 bg-[#f0f4f8] overflow-hidden">
        {/* Gradient Overlay Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-300 opacity-10 rounded-full blur-3xl z-0"></div>

        <h2 className="text-4xl mb-12 text-center [font-family:'Lilita_One',cursive] z-10 relative">
          What Users Say
        </h2>

        <div className="grid px-44 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative"
            >
              <p className="text-lg italic mb-6 text-gray-700">{`"${user.feedback}"`}</p>

              <div className="flex items-center gap-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 md:px-20 bg-background">
        <h2 className="text-4xl  mb-10 text-center [font-family:'Lilita_One',cursive]">
          FAQs
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 overflow-hidden rounded-lg transition-all duration-200 ease-in-out"
            >
              <button
                onClick={() => toggleFAQ(i)}
                className={`w-full px-5 py-4 flex justify-between items-center text-left  transition ${
                  openIndex === i ? "bg-sky-700/10" : ""
                }`}
              >
                <span className="font-medium text-[#0f172a]">{faq.q}</span>
                <FaChevronDown
                  className={`ml-4 text-gray-500 transform transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i
                    ? "max-h-40 opacity-100 py-2"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <p className="text-sm text-gray-600 py-2">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 md:px-20 bg-gray-100 font-spree">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl text-center text-[#0f172a] mb-10 [font-family:'Lilita_One',cursive]"
        >
          Get in Touch
        </motion.h2>

        <form
          action="https://formspree.io/f/YOUR_FORM_ID" // 🔁 Replace with your actual Formspree endpoint
          method="POST"
          className="max-w-xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md space-y-6"
        >
          <div className="relative">
            <FaUserAlt className="absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 transition"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 transition"
              required
            />
          </div>

          <div className="relative">
            <FaCommentDots className="absolute left-4 top-3 text-gray-400" />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 transition"
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-sky-700 text-white py-2 flex items-center justify-center gap-2 rounded-md shadow hover:bg-sky-800 transition"
          >
            <FaPaperPlane /> Send
          </motion.button>
        </form>
      </section>
    </div>
  );
};

export default Home;
