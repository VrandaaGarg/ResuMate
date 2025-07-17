import React, { useState, useEffect } from "react";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useLocation } from "react-router-dom";
import { atsScore } from "../utils/ai";
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
  FaRocket,
  FaSearch,
  FaThumbsUp,
  FaThumbsDown,
  FaSpinner,
} from "react-icons/fa";
import {
  FaArrowRotateRight,
  FaWandMagicSparkles,
  FaStar,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import showErrorToast from "../Components/showErrorToast";

ChartJS.register(ArcElement, Tooltip, Legend);

const FeedbackItem = ({ type, items, index = 0 }) => {
  if (!items || items.length === 0) return null;
  const isSuggestion = type === "suggestions";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`mt-1.5 md:mt-3 p-2 md:p-4 rounded-xs md:rounded-xl border transition-all duration-300 ${
        isSuggestion
          ? "bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-100/60"
          : "bg-red-50/80 border-red-200/60 hover:bg-red-100/60"
      }`}
    >
      <h5
        className={`font-semibold md:mb-2 flex items-center gap-2 text-xs md:text-md ${
          isSuggestion ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {isSuggestion ? <FaThumbsUp /> : <FaThumbsDown />}
        {isSuggestion ? "Our Suggestions" : "Areas to Improve"}
      </h5>
      <ul className="list-disc list-inside text-[12px] md:text-sm space-y-0.5 md:space-y-1.5 pl-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className={isSuggestion ? "text-emerald-600" : "text-red-600"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <motion.div
    key="loading-ats"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 max-w-xl mx-auto bg-white/60 backdrop-blur-md border border-white/40 shadow-xl p-10 md:p-12 rounded-3xl text-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
    >
      <FaRobot className="text-4xl text-white" />
    </motion.div>
    <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
      Checking ATS Compatibility...
    </h2>
    <p className="text-slate-600 mb-6">
      Our AI is analyzing your resume's ATS readiness. This might take a few
      moments.
    </p>
    <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 4, ease: "linear" }}
      />
    </div>
    <p className="text-sm text-slate-500 mt-4">
      Scanning for optimization opportunities...
    </p>
  </motion.div>
);

export default function ATSCompatibilityChecker() {
  const { resume } = useResumeData();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState("intro"); // "intro", "loading", "result"
  const [atsResult, setAtsResult] = useState(() => {
    // Check if ATS result was passed from upload page
    if (location.state?.atsResult) {
      return location.state.atsResult;
    }

    // Otherwise check localStorage
    const saved = localStorage.getItem("atsResult");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });
  const [uploadedFile, setUploadedFile] = useState(
    location.state?.uploadedFile || null
  );

  useEffect(() => {
    // If ATS result was passed from upload page, go directly to result
    if (location.state?.atsResult) {
      setCurrentStep("result");
      localStorage.setItem(
        "atsResult",
        JSON.stringify(location.state.atsResult)
      );
    } else if (atsResult) {
      localStorage.setItem("atsResult", JSON.stringify(atsResult));
      setCurrentStep("result");
    }
  }, [atsResult, location.state]);

  // Set initial step based on whether we have uploaded file data
  useEffect(() => {
    if (location.state?.atsResult && location.state?.uploadedFile) {
      setCurrentStep("result");
    }
  }, [location.state]);

  // Ensure currentStep is 'result' if atsResult exists on mount
  useEffect(() => {
    if (localStorage.getItem("atsResult")) {
      setCurrentStep("result");
    }
  }, []);

  const handleCheckATS = async () => {
    if (!resume || !resume.name) {
      showErrorToast("Please create or upload your resume first.");
      return;
    }
    setCurrentStep("loading");
    try {
      // Simulate API call delay for loading screen visibility
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await atsScore(resume);
      setAtsResult(result);
      // setCurrentStep will be updated by the useEffect watching atsResult
    } catch (error) {
      showErrorToast("Failed to check ATS compatibility. Please try again.");
      console.error("ATS Check Error:", error);
      setCurrentStep("intro"); // Go back to intro on error
    }
  };

  const handleReset = () => {
    setAtsResult(null);
    localStorage.removeItem("atsResult");
    setCurrentStep("intro");
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-6 md:px-20 py-8 md:py-16 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-r from-green-100/15 to-emerald-100/15 blur-3xl rounded-full z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <AnimatePresence mode="wait">
        {currentStep === "intro" && (
          <motion.div
            key="intro-ats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-center text-white relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-10 -right-10 w-32 h-32 border border-white/10 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                    <FaRobot className="text-2xl" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    ATS Compatibility Checker
                  </h1>
                  <p className="text-white/80 text-base">
                    Ensure your resume passes through Applicant Tracking Systems
                  </p>
                </motion.div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-slate-700 mb-6 text-center leading-relaxed text-sm">
                  Most companies use ATS to filter resumes. Our AI checker
                  analyzes your resume for ATS-friendliness, helping you
                  identify areas for improvement to increase your chances of
                  getting noticed by recruiters.
                </p>
                <motion.button
                  onClick={handleCheckATS}
                  disabled={!resume?.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaSearch />
                  Check My Resume
                </motion.button>
                {!resume?.name && (
                  <p className="text-xs text-red-500 mt-3 text-center">
                    Please create or upload a resume first to use this feature.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "loading" && <LoadingScreen />}

        {currentStep === "result" && atsResult && (
          <motion.div
            key="result-ats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-7xl mx-auto"
          >
            {/* Header for uploaded file analysis */}
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-2"
              >
                <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-full px-4 py-2 mb-3 shadow-lg">
                  <FaFileAlt className="text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">
                    Analysis from uploaded file: {uploadedFile.fileName}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-3 shadow-lg">
                <FaStar className="text-yellow-500" />
                <span className="text-xs font-medium text-slate-700">
                  ATS Report Ready
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                ATS Compatibility Report
              </h1>
              <p className="text-base text-slate-600 max-w-3xl mx-auto">
                Detailed analysis of your resume's ATS performance
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Score Panel */}
              <motion.div
                className="lg:col-span-1 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl space-y-4 sticky top-24"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-slate-800 text-center mb-1.5 md:mb-4">
                  Overall ATS Score
                </h2>
                <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto mb-4">
                  <Doughnut
                    data={{
                      datasets: [
                        {
                          data: [atsResult.atsScore, 100 - atsResult.atsScore],
                          backgroundColor: [
                            getScoreColor(atsResult.atsScore),
                            "#e2e8f0",
                          ],
                          borderColor: ["#ffffff", "#ffffff"],
                          borderWidth: 4,
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
                      className={`text-lg md:text-3xl font-bold ${getScoreTailwindColor(
                        atsResult.atsScore
                      )}`}
                    >
                      {atsResult.atsScore}%
                    </motion.span>
                    <span className="text-[9px] md:text-xs text-slate-500 font-medium mt-1">
                      ATS Friendliness
                    </span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`p-3 rounded-xl border text-xs ${
                    atsResult.atsScore >= 80
                      ? "bg-green-50/80 border-green-200/60"
                      : atsResult.atsScore >= 60
                      ? "bg-yellow-50/80 border-yellow-200/60"
                      : "bg-red-50/80 border-red-200/60"
                  }`}
                >
                  <p
                    className={`font-semibold ${getScoreTailwindColor(
                      atsResult.atsScore
                    )}`}
                  >
                    {atsResult.atsScore >= 80
                      ? "🎉 Excellent ATS Compatibility!"
                      : atsResult.atsScore >= 60
                      ? "👍 Good ATS Potential"
                      : "⚠️ Needs ATS Optimization"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {atsResult.atsScore >= 80
                      ? "Your resume is well-structured for ATS."
                      : atsResult.atsScore >= 60
                      ? "Some tweaks can improve ATS parsing."
                      : "Consider significant updates for better ATS performance."}
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs"
                >
                  <FaArrowRotateRight /> Recheck Resume
                </motion.button>
              </motion.div>

              {/* Right Column: Feedback Details */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Section-wise Feedback */}
                {atsResult.sectionWiseFeedback &&
                  Object.keys(atsResult.sectionWiseFeedback).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-200/60 rounded-xl p-4">
                        <h3 className="text-base md:text-lg font-semibold text-blue-700 mb-1.5 md:mb-4 flex items-center gap-2">
                          <div className="p-1.5 bg-blue-500 rounded-full">
                            <FaListAlt className="text-white" />
                          </div>
                          Section-wise Breakdown
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(atsResult.sectionWiseFeedback).map(
                            ([section, feedback], index) => (
                              <motion.div
                                key={section}
                                className="p-3 bg-white/80 border border-blue-100/60 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.1 * index,
                                }}
                              >
                                <h4 className="font-bold text-blue-800 capitalize mb-2 text-sm md:text-base">
                                  {section.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <FeedbackItem
                                  type="missing"
                                  items={feedback.missing}
                                  index={index}
                                />
                                <FeedbackItem
                                  type="suggestions"
                                  items={feedback.suggestions}
                                  index={index + 0.5}
                                />
                                {(!feedback.missing ||
                                  feedback.missing.length === 0) &&
                                  (!feedback.suggestions ||
                                    feedback.suggestions.length === 0) && (
                                    <p className="text-xs text-slate-500 italic mt-1">
                                      No specific feedback for this section.
                                      Looks good!
                                    </p>
                                  )}
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                {/* General Tips */}
                {atsResult.generalTips && atsResult.generalTips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 border border-emerald-200/60 rounded-xl p-4">
                      <h3 className="text-sm md:text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500 rounded-full">
                          <FaLightbulb className="text-white" />
                        </div>
                        General Pro Tips for ATS
                      </h3>
                      <ul className="space-y-2">
                        {atsResult.generalTips.map((tip, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-start gap-2 text-slate-700 leading-relaxed text-[12px] md:text-sm"
                          >
                            <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                            {tip}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {(!atsResult.sectionWiseFeedback ||
                  Object.keys(atsResult.sectionWiseFeedback).length === 0) &&
                  (!atsResult.generalTips ||
                    atsResult.generalTips.length === 0) && (
                    <motion.div
                      className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FaRobot
                        size={40}
                        className="text-slate-400 mx-auto mb-4"
                      />
                      <h3 className="text-base font-semibold text-slate-700 mb-1">
                        All Clear!
                      </h3>
                      <p className="text-slate-600 text-sm">
                        No specific feedback or tips available at the moment.
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Your resume appears to be well-optimized for ATS based
                        on general checks.
                      </p>
                    </motion.div>
                  )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
