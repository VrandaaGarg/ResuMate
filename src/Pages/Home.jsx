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
  FaUserAlt,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Marquee from "../Components/Home/Marquee";
import { FaRocket, FaUpload } from "react-icons/fa";
import StatsSection from "../Components/Home/StatsSection";

import { getAuth } from "firebase/auth";
import Steps from "../Components/Home/Steps";
import Testimonials from "../Components/Home/Testimonials";
import TemplateCarousel from "../Components/Home/TemplateCarousel";
import FAQ from "../Components/Home/FAQ";

const features = [
  {
    title: "Step-by-Step Resume Builder",
    desc: "Enter your personal info, education, work experience, skills, and certifications with guided form inputs.",
    gradient: "from-sky-500 to-cyan-400",
    bgGradient: "from-sky-50 to-cyan-50",
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
    gradient: "from-blue-500 to-pink-400",
    bgGradient: "from-blue-50 to-pink-50",
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
    gradient: "from-violet-500 to-blue-400",
    bgGradient: "from-violet-50 to-blue-50",
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

  return (
    <div className="bg-gradient-to-br from-white via-sky-50 to-sky-50 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className=" relative px-6 md:px-12 lg:px-20 pt-24 flex items-center max-w-7xl mx-auto">
        {/* Background Elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl z-0" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-3 h-3 bg-sky-400 rounded-full opacity-40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-40 w-4 h-4 bg-sky-400 rounded-full opacity-30"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Static UI Elements - Left Side */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute left-12 top-3/4 hidden lg:block"
        >
          <div className="bg-sky-50 backdrop-blur-sm border border-zinc-400 rounded-2xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiZap className="text-sky-500 text-sm" />
              <span className="text-sm font-bold text-gray-800">
                AI-Powered
              </span>
            </div>
          </div>
        </motion.div>

        {/* Static UI Elements - Right Side */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="absolute right-12 top-1/2 hidden lg:block"
        >
          <div className="bg-sky-50 backdrop-blur-sm border border-zinc-400 rounded-2xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-orange-500 text-sm" />
              <span className="text-sm font-bold text-gray-800">
                Professional
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          className="absolute right-6 bottom-1/4 hidden lg:block"
        >
          <div className="bg-sky-50 backdrop-blur-sm border border-zinc-400 rounded-2xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FaStar className="text-emerald-500 text-sm" />
              <span className="text-sm font-bold text-gray-800">
                5-Star Rated
              </span>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col">
          {/* Top Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center mb-8 flex-shrink-0"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
              className="inline-flex lg:hidden items-center gap-2 bg-white/90 backdrop-blur-sm border border-sky-200 rounded-full px-5 py-2 mb-3 shadow-sm"
            >
              <FaStar className="text-sky-500 text-sm" />
              <span className="text-sm font-medium text-gray-800">
                AI-Powered Resume Builder
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight"
            >
              Craft Your Perfect Resume with{" "}
              <span className="text-sky-600">ResuMate</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto"
            >
              AI-powered platform that helps you build, optimize, and perfect
              your resume to stand out in today's competitive job market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateClick}
                className="group flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
                Create Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUploadClick}
                className="group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <FaUpload className="group-hover:translate-y-[-1px] transition-transform duration-300" />
                Upload Resume
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Spacer to push image to bottom */}
          {/* <div className="flex-grow"></div> */}

          {/* Bottom Image - Stuck to bottom */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex flex-grow justify-center"
          >
            <div className="relative h-full">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                src="/homepage.png"
                alt="ResuMate Dashboard"
                className="h-full w-max object-contain"
              />
              <div className="absolute -inset-6 bg-gradient-to-r from-sky-200/20 to-sky-200/20 rounded-3xl blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 px-6 md:px-12 lg:px-20 relative bg-white">
        {/* Background Elements */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-sky-100/40 blur-3xl rounded-full z-0" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-100/30 blur-3xl rounded-full z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-6 py-2 mb-4">
            <FiStar className="text-sky-600" />
            <span className="text-sm font-medium text-gray-800">
              Premium Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose ResuMate?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the power of AI-driven resume optimization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 max-w-7xl mx-auto">
          {features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="p-3 bg-sky-50 rounded-lg text-sky-600 mb-4 inline-block group-hover:bg-sky-100 transition-colors duration-300">
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
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
      <section className="pt-20 md:pt-24 bg-sky-50">
        <div className="px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Templates
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from beautifully crafted templates designed for maximum
              impact. Each template is fully customizable.
            </p>
          </motion.div>
        </div>

        <TemplateCarousel />
      </section>

      {/* Demo Video Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-800">
              See It In Action
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Watch ResuMate Demo
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            See how easy it is to create a professional resume in minutes with
            our intuitive platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/W-VnbrM6jG8?si=mWpFPfrLuIxbPZyK"
                title="ResuMate Demo Video"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQs */}
      <FAQ />
    </div>
  );
};

export default Home;
