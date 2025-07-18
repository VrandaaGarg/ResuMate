import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaSyncAlt,
  FaFileAlt,
  FaBullseye,
  FaChartBar,
  FaListAlt,
  FaBrain,
  FaDownload,
  FaShare,
  FaTrophy,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaRocket,
  FaEyeSlash,
} from "react-icons/fa";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { matchJD } from "../utils/ai";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import showErrorToast from "../Components/showErrorToast";
import {
  FaArrowRotateRight,
  FaWandMagicSparkles,
  FaStar,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { ImCross } from "react-icons/im";
import { FaSmileBeam } from "react-icons/fa";
import { ImSad2 } from "react-icons/im";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ScoreCriteria = ({ label, score, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center justify-between py-2 group hover:bg-white/30 px-2 rounded-md transition-all duration-300"
  >
    <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        className="text-xs font-semibold text-slate-700 min-w-[30px]"
      >
        {score}%
      </motion.span>
    </div>
  </motion.div>
);

// LoadingStep component - smaller size
const LoadingStep = ({ step, isActive, isComplete }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 border ${
      isActive
        ? "bg-blue-50/80 border-blue-200/60 shadow-sm"
        : isComplete
        ? "bg-green-50/80 border-green-200/60 shadow-sm"
        : "bg-white/40 border-slate-200/50"
    }`}
  >
    <motion.div
      animate={isActive ? { rotate: 360 } : {}}
      transition={
        isActive ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
      }
      className={`p-1.5 rounded-full transition-colors ${
        isActive
          ? "bg-blue-500 text-white"
          : isComplete
          ? "bg-green-500 text-white"
          : "bg-slate-300 text-slate-500"
      }`}
    >
      {isComplete ? <FaCheckCircle size={12} /> : <step.icon size={12} />}
    </motion.div>
    <div>
      <p
        className={`text-sm font-medium transition-colors ${
          isActive
            ? "text-blue-700"
            : isComplete
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {step.text}
      </p>
      {isActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-blue-600"
        >
          Processing...
        </motion.p>
      )}
    </div>
  </motion.div>
);

// SkillTag component - smaller size
const SkillTag = ({ skill, type, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
      type === "matched"
        ? "bg-green-50/80 text-green-700 border-green-200/60 hover:bg-green-100/80"
        : "bg-red-50/80 text-red-700 border-red-200/60 hover:bg-red-100/80"
    }`}
  >
    {type === "matched" ? <FaThumbsUp size={10} /> : <FaThumbsDown size={10} />}
    {skill}
  </motion.span>
);

export default function JobFitAnalyzer() {
  const { resume } = useResumeData();
  const location = useLocation();
  const [step, setStep] = useState("intro");
  const [jobDesc, setJobDesc] = useState("");
  const [style, setStyle] = useState("concise");
  const [loading, setLoading] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [showFullReport, setShowFullReport] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (location.state?.aiResult) {
      setAiResult(location.state.aiResult);
      setStep("result");
    }
    if (location.state?.uploadedFile) {
      setUploadedFile(location.state.uploadedFile);
    }
  }, [location.state]);

  const handleAskAI = async () => {
    if (!jobDesc) {
      showErrorToast("Please paste the job description first.");
      return;
    }
    if (!resume || !resume.name) {
      showErrorToast("Please create or upload your resume first.");
      return;
    }

    const relevantResume = {
      name: resume.name,
      description: resume.description,
      skills: resume.skills,
      projects: resume.projects,
      experience: resume.experience,
      achievements: resume.achievements,
      contact: resume.contact,
    };

    setLoading(true);
    setStep("loading");
    setCurrentLoadingStep(0);
    setShowFullReport(false);

    // Simulate loading steps
    const stepDurations = [2000, 1500, 2000, 1000];
    for (let i = 0; i < stepDurations.length; i++) {
      setTimeout(
        () => setCurrentLoadingStep(i),
        stepDurations.slice(0, i).reduce((a, b) => a + b, 0)
      );
    }

    try {
      const result = await matchJD({
        style,
        jobDescription: jobDesc,
        resume: relevantResume,
      });

      // Add some delay for better UX
      setTimeout(() => {
        setAiResult(result);
        setStep("result");
        setLoading(false);
      }, 7000); // Total simulated loading time, adjust if needed
    } catch (error) {
      showErrorToast("Failed to analyze. Please try again.");
      console.error("AI Analysis Error:", error);
      setStep("input");
      setLoading(false);
    }
  };

  const handleAskAgain = () => {
    setAiResult(null);
    setJobDesc("");
    setStep("intro");
    setShowFullReport(false);
    setUploadedFile(null);
  };

  const analysisSteps = [
    { text: "Parsing your resume", icon: FaFileAlt },
    { text: "Analyzing job description", icon: FaChartBar },
    { text: "Extracting key skills", icon: FaListAlt },
    { text: "Generating recommendations", icon: FaBrain },
  ];

  const criteriaScores = aiResult
    ? [
        {
          label: "Keywords Match",
          score: aiResult.score > 30 ? Math.min(95, aiResult.score + 15) : 40,
        },
        {
          label: "Experience Relevance",
          score: aiResult.score > 40 ? Math.min(90, aiResult.score + 10) : 50,
        },
        {
          label: "Skills Coverage",
          score: aiResult.score > 50 ? Math.min(92, aiResult.score + 20) : 60,
        },
        { label: "ATS Friendliness", score: 75 },
        { label: "Overall Clarity", score: 80 },
      ]
    : [];

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const getScoreTailwindColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-400";
    if (score >= 60) return "from-yellow-500 to-orange-400";
    return "from-red-500 to-pink-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-4 md:px-12 py-10 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-r from-green-100/15 to-emerald-100/15 blur-3xl rounded-full z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <AnimatePresence mode="wait">
        {/* Step 1: Enhanced Intro */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-xl overflow-hidden">
              {/* Header - smaller text */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-center text-white relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-10 -right-10 w-40 h-40 border border-white/10 rounded-full"
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                    <FaRobot className="text-xl" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    AI Job Fit Analyzer
                  </h1>
                  <p className="text-white/80 text-sm">
                    Discover how well your resume matches job requirements
                  </p>
                </motion.div>
              </div>

              {/* Content - reduced text */}
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <FaWandMagicSparkles className="text-blue-600" />
                      What You'll Get
                    </h3>
                    <ul className="space-y-2 text-slate-700 text-sm">
                      {[
                        "Detailed compatibility score",
                        "Skill gap identification",
                        "ATS optimization tips",
                        "Personalized recommendations",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 p-4 rounded-xl border border-blue-100/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FaTrophy className="text-lg text-yellow-500" />
                      <h3 className="text-base font-semibold text-slate-900">
                        Success Stories
                      </h3>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      "Increased my interview rate by 300% after optimizing my
                      resume with these insights!"
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        Priya S., Software Engineer
                      </span>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!resume?.name) {
                      showErrorToast(
                        "Please complete your resume details first."
                      );
                      return;
                    }
                    setStep("input");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRocket size={14} />
                  Start Analysis
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Input - made smaller */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Job Description Analysis
                </h2>
                <p className="text-slate-600 text-sm">
                  Paste the job description and let our AI analyze the fit
                </p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <FaFileAlt className="text-blue-600 text-xs" />
                    Job Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      rows={8}
                      className="w-full p-4 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm text-slate-800 transition-all duration-300 resize-none placeholder-slate-400 text-xs"
                      placeholder="Paste the complete job description here...

Example:
We are looking for a skilled React Developer to join our team. The ideal candidate should have experience with:
- React.js and modern JavaScript
- State management (Redux/Context API)
- REST APIs and GraphQL..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                      {jobDesc.length} characters
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <FaWandMagicSparkles className="text-purple-600 text-xs" />
                      Analysis Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full p-3 border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm text-slate-800 transition-all duration-300 text-xs"
                    >
                      <option value="concise">🎯 Concise & Focused</option>
                      <option value="elaborative">
                        📋 Detailed & Comprehensive
                      </option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <motion.button
                      onClick={handleAskAI}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading || !jobDesc.trim()}
                      className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? (
                        <>
                          <FaArrowRotateRight className="animate-spin text-xs" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FaWandMagicSparkles size={12} />
                          Analyze with AI
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Tips section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-4 rounded-xl border border-blue-100/50"
                >
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                    <FaLightbulb className="text-yellow-500 text-xs" />
                    Pro Tips for Better Results
                  </h3>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>
                      • Include the complete job description with requirements
                      and responsibilities
                    </li>
                    <li>
                      • Make sure your resume is up-to-date with your latest
                      experience
                    </li>
                    <li>
                      • The more detailed the job description, the better the
                      analysis
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2.5: Loading State - smaller size */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-lg mx-auto bg-white/60 backdrop-blur-md border border-white/40 shadow-xl p-6 md:p-8 rounded-xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 mx-auto mb-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <FaRobot className="text-2xl text-white" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3">
              Analyzing Your Fit...
            </h2>
            <p className="text-slate-600 mb-5 text-sm">
              Our AI is examining your resume against the job requirements
            </p>
            <div className="space-y-2">
              {analysisSteps.map((analysisStep, index) => (
                <LoadingStep
                  key={index}
                  step={analysisStep}
                  isActive={currentLoadingStep === index}
                  isComplete={currentLoadingStep > index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Result - smaller size */}
        {step === "result" && aiResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-2"
                >
                  <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-full px-4 py-2 mb-3 shadow-lg">
                    <FaFileAlt className="text-blue-600" />
                    <span className="text-blue-800 font-medium text-xs md:text-sm">
                      Analysis from uploaded file: {uploadedFile.fileName}
                    </span>
                  </div>
                </motion.div>
              )}
              <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 mb-3 shadow-lg">
                <FaStar className="text-yellow-500 text-xs" />
                <span className="text-xs font-medium text-slate-700">
                  Analysis Complete
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                Your Job Fit Report
              </h1>

              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                Detailed analysis of your resume's compatibility with this role
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Score Panel - reduced size */}
              <motion.div
                className="lg:col-span-1 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-xl space-y-4 sticky top-24"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-slate-800 text-center mb-4">
                  Overall Score
                </h2>
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <Doughnut
                    data={{
                      datasets: [
                        {
                          data: [aiResult.score, 100 - aiResult.score],
                          backgroundColor: [
                            getScoreColor(aiResult.score),
                            "#e2e8f0",
                          ],
                          borderColor: ["#ffffff", "#ffffff"],
                          borderWidth: 3,
                          circumference: 270,
                          rotation: -135,
                          cutout: "75%",
                        },
                      ],
                    }}
                    options={{
                      cutout: "75%",
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      aspectRatio: 1,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className={`text-3xl font-bold ${getScoreTailwindColor(
                        aiResult.score
                      )}`}
                    >
                      {aiResult.score}%
                    </motion.span>
                    <span className="text-xs text-slate-500 font-medium">
                      Match Score
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  {criteriaScores.map((criterion, index) => (
                    <ScoreCriteria
                      key={criterion.label}
                      label={criterion.label}
                      score={criterion.score}
                      delay={index * 0.1}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAskAgain}
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
                >
                  <FaArrowRotateRight size={12} /> Analyze Another
                </motion.button>
              </motion.div>

              {/* Right Column: Analysis Details - reduced size */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  {!showFullReport && (
                    <motion.div
                      key="minimal-report"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-md">
                        <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                          <FaLightbulb className="text-yellow-500 text-sm" />
                          Quick Overview
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Your overall match score is{" "}
                          <strong className={getScoreColor(aiResult.score)}>
                            {aiResult.score}%
                          </strong>
                          .
                          {aiResult.score >= 80
                            ? " This indicates an excellent alignment with the job requirements!"
                            : aiResult.score >= 60
                            ? " This shows good potential for the role."
                            : " There are several areas to improve for a better fit."}
                        </p>
                        <p className="text-xs text-slate-600 mt-1.5">
                          Below are some key highlights. Click "Show Full
                          Report" for detailed analysis.
                        </p>
                      </div>

                      {aiResult.strengths?.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-md">
                          <h3 className="text-sm font-semibold text-green-700 mb-1.5 flex items-center gap-1.5">
                            <FaCheckCircle size={12} /> Top Strengths
                          </h3>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                            {aiResult.strengths.slice(0, 2).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                            {aiResult.strengths.length > 2 && (
                              <li className="italic text-slate-500">
                                ... and {aiResult.strengths.length - 2} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {aiResult.weaknesses?.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-md">
                          <h3 className="text-sm font-semibold text-red-700 mb-1.5 flex items-center gap-1.5">
                            <FaExclamationTriangle size={12} /> Key Areas for
                            Improvement
                          </h3>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                            {aiResult.weaknesses.slice(0, 2).map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                            {aiResult.weaknesses.length > 2 && (
                              <li className="italic text-slate-500">
                                ... and {aiResult.weaknesses.length - 2} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <motion.button
                        onClick={() => setShowFullReport(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
                      >
                        <FaEye size={12} /> Show Full Report
                      </motion.button>
                    </motion.div>
                  )}

                  {showFullReport && (
                    <motion.div
                      key="full-report"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {/* Strengths - smaller layout */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-green-500 rounded-full">
                              <FaCheckCircle className="text-white text-xs" />
                            </div>
                            Your Strengths
                          </h3>
                          <ul className="space-y-2">
                            {aiResult.strengths?.map((strength, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="flex items-start gap-2 text-gray-700 leading-relaxed text-xs"
                              >
                                <FaThumbsUp className="text-green-600 mt-0.5 flex-shrink-0 text-xs" />
                                {strength}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>

                      {/* Areas for Improvement */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-red-500 rounded-full">
                              <FaExclamationTriangle className="text-white text-xs" />
                            </div>
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-2">
                            {aiResult.weaknesses?.map((weakness, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                className="flex items-start gap-2 text-gray-700 leading-relaxed text-xs"
                              >
                                <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0 text-xs" />
                                {weakness}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>

                      {/* AI Recommendations */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                          <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500 rounded-full">
                              <FaLightbulb className="text-white text-xs" />
                            </div>
                            AI Recommendations
                          </h3>
                          <ul className="space-y-2">
                            {aiResult.suggestionsToAlignBetter?.map(
                              (suggestion, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + i * 0.05 }}
                                  className="flex items-start gap-2 text-gray-700 leading-relaxed text-xs"
                                >
                                  <FaWandMagicSparkles className="text-blue-600 mt-0.5 flex-shrink-0 text-xs" />
                                  {suggestion}
                                </motion.li>
                              )
                            )}
                          </ul>
                        </div>
                      </motion.div>

                      {/* Enhanced Skill Gap Analysis */}
                      {aiResult.skillGapAnalysis && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                              <div className="p-1.5 bg-purple-500 rounded-full">
                                <FaBullseye className="text-white text-xs" />
                              </div>
                              Skill Gap Analysis
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8 mb-4">
                              <div>
                                <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2 text-sm">
                                  <FaSmileBeam size={14} /> Matched Skills (
                                  {aiResult.skillGapAnalysis.matchedSkills
                                    ?.length || 0}
                                  )
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {aiResult.skillGapAnalysis.matchedSkills
                                    ?.length > 0 ? (
                                    aiResult.skillGapAnalysis.matchedSkills.map(
                                      (skill, idx) => (
                                        <SkillTag
                                          key={idx}
                                          skill={skill}
                                          type="matched"
                                          index={idx}
                                        />
                                      )
                                    )
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">
                                      No explicitly matched skills found.
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2 text-sm">
                                  <ImSad2 size={14} /> Missing Skills (
                                  {aiResult.skillGapAnalysis.missingSkills
                                    ?.length || 0}
                                  )
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {aiResult.skillGapAnalysis.missingSkills
                                    ?.length > 0 ? (
                                    aiResult.skillGapAnalysis.missingSkills.map(
                                      (skill, idx) => (
                                        <SkillTag
                                          key={idx}
                                          skill={skill}
                                          type="missing"
                                          index={idx}
                                        />
                                      )
                                    )
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">
                                      No critical skills missing.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {aiResult.skillGapAnalysis.recommendations?.length >
                              0 && (
                              <div className="border-t border-purple-200 pt-4">
                                <h4 className="font-semibold text-indigo-600 mb-2 flex items-center gap-2 text-sm">
                                  <FaRocket size={14} /> Priority Actions
                                </h4>
                                <ul className="space-y-2">
                                  {aiResult.skillGapAnalysis.recommendations.map(
                                    (rec, idx) => (
                                      <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                        className="flex items-start gap-2 text-gray-700 leading-relaxed text-xs"
                                      >
                                        <FaCheckCircle className="text-indigo-600 mt-0.5 flex-shrink-0 text-xs" />
                                        {rec}
                                      </motion.li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Additional Notes */}
                      {aiResult.notes?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-0 shadow-md"
                        >
                          <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
                            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <FaEye className="text-gray-500 text-sm" />
                              Additional Insights
                            </h3>
                            <ul className="space-y-2">
                              {aiResult.notes.map((note, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + i * 0.05 }}
                                  className="flex items-start gap-3 text-gray-600 leading-relaxed text-xs"
                                >
                                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                  {note}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}

                      <motion.button
                        onClick={() => setShowFullReport(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
                      >
                        <FaEyeSlash size={12} /> Show Less
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* "Analyze Another Job" button - common to both views */}
                <div className="text-center mt-6 border-t border-gray-200/70 pt-6">
                  <motion.button
                    onClick={handleAskAgain}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 6px 15px rgba(59, 130, 246, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-sm mx-auto"
                  >
                    <FaSyncAlt size={12} /> Analyze Another Job
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
