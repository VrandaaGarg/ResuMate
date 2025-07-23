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
  FiStar,
} from "react-icons/fi";
import {
  FaChevronDown,
  FaPaintBrush,
  FaUserAlt,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaStar,
  FaGem,
} from "react-icons/fa";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Marquee from "../Components/Marquee";
import { FaRocket, FaUpload } from "react-icons/fa";
import StatsSection from "../Components/StatsSection";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import Steps from "../Components/Home/Steps";

const features = [
  {
    title: "Step-by-Step Resume Builder",
    desc: "Enter your personal info, education, work experience, skills, and certifications with guided form inputs.",
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    title: "Resume Upload & creation",
    desc: "Upload your existing resume, and you can create, edit, and optimize it further.",
    gradient: "from-yellow-500 to-amber-400",
    bgGradient: "from-yellow-50 to-amber-50",
  },
  {
    title: "Upload and check ATS compatibility and job matching",
    desc: "Check ATS compatibility and job matching for your uploaded resume instantly after uploading.",
    gradient: "from-orange-500 to-red-400",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    title: "Live Preview & Editor",
    desc: "Edit your resume in real-time with formatting options like fonts, colors, bold/italic, and hyperlink support.",
    gradient: "from-purple-500 to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    title: "Template & Theme Customization",
    desc: "Choose from modern templates and color palettes to match your professional style.",
    gradient: "from-green-500 to-emerald-400",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    title: "AI-Powered Enhancer & Optimization",
    desc: "Use Gemini AI to enhance bullet points and tailor your resume for specific job roles and descriptions.",
    gradient: "from-orange-500 to-red-400",
    bgGradient: "from-orange-50 to-red-50",
  },

  {
    title: "ATS Compatibility & Job Match Scoring",
    desc: "Check how your resume performs with ATS and get match scores against job descriptions with improvement tips.",
    gradient: "from-teal-500 to-green-400",
    bgGradient: "from-teal-50 to-green-50",
  },

  {
    title: "Secure Profiles & PDF Export",
    desc: "Your data is securely stored, and you can download polished, hyperlink-enabled PDFs anytime.",
    gradient: "from-violet-500 to-purple-400",
    bgGradient: "from-violet-50 to-purple-50",
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

const Template = [
  {
    id: 1,
    name: "Sidebar Template",
    image: "/sidebar.jpg",
    description: "A clean and modern template for a professional look.",
    badge: "Popular",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Classic Template",
    image: "/classic.jpg",
    description: "A classic design that is timeless and effective.",
    badge: "Timeless",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-400",
  },
  {
    id: 3,
    name: "Standard Template",
    image: "/standard.jpg",
    description: "A Standard layout that stands out from the crowd.",
    badge: "Standard",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-400",
  },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    image: "user1.jpeg",
    feedback:
      "ResuMate helped me land my first internship. The AI suggestions were incredibly smart and on-point!",
    role: "Software Developer",
    company: "Tech Corp",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    image: "user2.jpeg",
    feedback:
      "Building my resume felt effortless and modern. Loved the templates and the ATS scoring feature!",
    role: "Marketing Manager",
    company: "Digital Agency",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    image: "user3.jpeg",
    feedback:
      "It's the best resume builder I've used — simple, elegant, and very effective with job matching tools.",
    role: "Data Analyst",
    company: "Analytics Inc",
    rating: 5,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleCreateClick = () => {
    const user = auth.currentUser;
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleUploadClick = () => {
    const user = auth.currentUser;
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[95lvh] px-6 md:px-20 py-9 flex flex-col items-center justify-center text-center gap-8 overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-pink-300 opacity-15 rounded-full blur-3xl z-0 animate-pulse" />
        {/* <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400 to-emerald-300 opacity-10 blur-3xl rounded-full z-0 animate-pulse" /> */}

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full opacity-60"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-32 w-6 h-6 bg-purple-500 rounded-full opacity-40"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6 shadow-lg"
          >
            <FaStar className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              AI-Powered Resume Builder
            </span>
            <FaGem className="text-purple-500" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl mb-6 [font-family:'Poppins',sans-serif] leading-tight">
            Craft a Winning Resume with <br />
            <span className="text-5xl md:text-8xl [font-family:'Lilita_One',cursive] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent font-extrabold">
              ResuMate
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-powered platform that helps users build, optimize, and perfect
            their resumes to stand out in today's competitive job market. Create
            professional, ATS-friendly resumes with real-time feedback.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateClick}
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
            >
              <FaRocket className="group-hover:rotate-12 transition-transform duration-300" />
              Create Resume
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadClick}
              className="group flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg border border-gray-600"
            >
              <FaUpload className="group-hover:translate-y-[-2px] transition-transform duration-300" />
              Upload Resume
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 px-6 md:px-20 relative">
        {/* Background Elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-200 opacity-20 blur-3xl rounded-full z-0" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-200 opacity-15 blur-3xl rounded-full z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-4">
            <FiStar className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Premium Features
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
            Why Use ResuMate?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the power of AI-driven resume optimization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className={`relative z-10 p-4 bg-gradient-to-r ${feature.gradient} rounded-xl text-white mb-4 inline-block shadow-lg`}
                >
                  <Icon size={28} />
                </motion.div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.desc}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Steps Section */}
      <Steps />

      {/* Templates Section */}
      <section className="py-20 md:py-32 px-6 md:px-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
            Popular Templates
          </h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from beautifully crafted templates designed for maximum
            impact. Each template is fully customizable with modern design
            principles.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 md:px-20">
          {Template.map((temp, index) => (
            <motion.div
              key={temp.id}
              whileHover={{ scale: 1.03, y: -10 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Badge */}
              <div
                className={`absolute top-4 right-4 ${temp.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10`}
              >
                {temp.badge}
              </div>

              {/* Template Image */}
              <div className="relative overflow-hidden rounded-xl mb-4 group-hover:transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src={temp.image}
                  alt={temp.name}
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {temp.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {temp.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r " />

        <section className="relative z-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 mx-4 md:mx-20 rounded-3xl py-16 px-8 md:px-20 shadow-2xl">
          <FaQuoteLeft className="absolute -top-4 left-8 text-white/20 text-6xl" />
          <FaQuoteRight className="absolute -bottom-4 right-8 text-white/20 text-6xl" />

          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-full lg:w-3/5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/W-VnbrM6jG8?si=mWpFPfrLuIxbPZyK"
                  title="ResuMate Demo Video"
                  allowFullScreen
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </motion.div>
            </div>

            <div className="w-full lg:w-2/5 text-black">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <FaStar className="text-yellow-300" />
                <span className="text-sm ">Watch Demo</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6 [font-family:'Poppins',sans-serif]">
                Watch How It Works
              </h2>
              <p className="text-black/90 text-sm md:text-xl leading-relaxed">
                See how ResuMate helps you create, edit, and optimize your
                resume step-by-step with our intuitive editor and AI-powered
                enhancements.
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Marquee */}
      <Marquee />

      {/* Testimonials */}
      <section className="relative py-20 md:py-32 px-6 md:px-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 opacity-10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
            What Users Say
          </h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10 md:px-20">
          {testimonials.map((user, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -10 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-500"
            >
              {/* Quote Icon */}
              <FaQuoteLeft className="absolute top-4 left-4 text-blue-200 text-2xl" />

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(user.rating)].map((_, index) => (
                  <FiStar
                    key={index}
                    className="text-yellow-400 fill-current"
                    size={16}
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-6 leading-relaxed text-xs md:text-lg relative z-10">
                "{user.feedback}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="md:w-14 md:h-14 w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs md:text-lg">
                    {user.name}
                  </p>
                  <p className="text-[14px] md:text-sm text-blue-600 font-medium">
                    {user.role}
                  </p>
                  <p className="text-[12px] md:text-xs text-gray-500">
                    {user.company}
                  </p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-100 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-32 px-6 md:px-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about ResuMate
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 overflow-hidden rounded-lg md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(i)}
                className={`w-full md:px-8 md:py-6 px-3 py-2 flex justify-between items-center text-left transition-all duration-300 ${
                  openIndex === i
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-sm md:text-lg font-semibold text-gray-900">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-1 md:p-2 rounded-full bg-blue-100"
                >
                  <FaChevronDown className="text-blue-600 text-sm md:text-base" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50"
              >
                <div className="md:px-8 md:py-6 px-3 py-2">
                  <p className="text-gray-700 leading-relaxed text-xs md:text-lg">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-32 px-6 md:px-20 bg-gradient-to-br from-slate-100 to-blue-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-200 opacity-20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-200 opacity-15 blur-3xl rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 [font-family:'Poppins',sans-serif]">
            Get in Touch
          </h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          action="https://formspree.io/f/movdekvl"
          method="POST"
          className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-5 md:p-12 rounded-3xl shadow-2xl border border-white/20 space-y-8 relative z-10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group">
              <FaUserAlt className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80"
                required
              />
            </div>

            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <FaCommentDots className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 resize-none"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 flex items-center justify-center gap-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            <FaPaperPlane /> Send Message
          </motion.button>
        </motion.form>
      </section>
    </div>
  );
};

export default Home;
