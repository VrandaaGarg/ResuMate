import React, { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { matchJD } from "../utils/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import showErrorToast from "../Components/showErrorToast";
import { FaArrowRotateRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ImCross } from "react-icons/im";
import { FaSmileBeam } from "react-icons/fa";
import { ImSad2 } from "react-icons/im";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function JobFitAnalyzer() {
  const { resume } = useResumeData();
  const [step, setStep] = useState("intro");
  const [jobDesc, setJobDesc] = useState("");
  const [style, setStyle] = useState("concise");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(() => {
    const saved = localStorage.getItem("jobFitResult");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (aiResult) {
      localStorage.setItem("jobFitResult", JSON.stringify(aiResult));
      setStep("result");
    }
  }, [aiResult]);

  const handleAskAI = async () => {
    if (!jobDesc) return;

    const relevantResume = {
      description: resume.description,
      skills: resume.skills,
      projects: resume.projects,
      experience: resume.experience,
      achievements: resume.achievements,
    };

    setLoading(true);

    const result = await matchJD({
      style,
      jobDescription: jobDesc,
      resume: relevantResume,
    });

    console.log({ style });

    setAiResult(result);
    setLoading(false);
  };

  const handleAskAgain = () => {
    localStorage.removeItem("jobFitResult");
    setAiResult(null);
    setJobDesc("");
    setStep("input");
  };

  return (
    <div className="min-h-[67lvh]  px-6 md:px-20 py-16 bg-gradient-to-br from-white via-sky-50 to-white">
      {/* Step 1: Intro */}
      {step === "intro" && !aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto bg-white shadow-lg p-10 rounded-xl text-center"
        >
          <div className="flex py-5 justify-center items-center gap-3 text-sky-700 text-2xl font-bold ">
            <FaRobot className="text-3xl" />
            Let’s Check Your Resume Fit!
          </div>

          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
            Instantly analyze how well your resume matches the job you're
            applying for — and get personalized suggestions to improve it!
          </p>

          <button
            onClick={() => {
              if (!resume?.name) {
                showErrorToast(
                  "Please complete your basic resume details first."
                );
                return;
              }
              setStep("input");
            }}
            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Check Now
          </button>
        </motion.div>
      )}

      {/* Step 2: Input */}
      {step === "input" && !aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto bg-white shadow-lg p-10 rounded-xl text-center"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={6}
              className="w-full border rounded p-3 text-sm"
              placeholder="e.g. Frontend engineer with React, Tailwind, and AI experience..."
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Response Style:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="concise">Concise</option>
              <option value="elaborative">Elaborative</option>
            </select>

            <button
              onClick={() => {
                if (!jobDesc) {
                  showErrorToast("Please enter the job description first.");
                  return;
                }
                handleAskAI();
              }}
              className="ml-auto bg-gradient-to-r from-sky-500 to-sky-700 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaArrowRotateRight className="animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Ask AI"
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Result */}
      {aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white border border-sky-200 space-y-4 shadow-lg p-10 rounded-xl "
        >
          {/* Match Score Chart */}
          {aiResult?.score !== null && (
            <div className="text-center my-7">
              <h1 className="text-sky-600 font-bold text-3xl">
                Resume Feedback Report
              </h1>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Match Score
              </h3>
              <div className="w-40 h-40 mx-auto relative">
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: [aiResult.score, 100 - aiResult.score],
                        backgroundColor: ["#00a2d4", "#f3f4f6"], // purple + light gray
                        borderWidth: 0,
                        cutout: "70%", // for donut effect
                      },
                    ],
                  }}
                  options={{
                    cutout: "70%",
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                  }}
                />
                {/* Centered Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold text-sky-700">
                    {aiResult.score}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sky-700 mb-1">💪 Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {aiResult.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-yellow-700 mb-1">
                ⚠️ Weaknesses
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {aiResult.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-emerald-700 mb-1">
                🛠 Suggestions to Align Better
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {aiResult.suggestionsToAlignBetter?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Skill Gap Highlight Section */}
            <div className="">
              <h4 className="text-md font-semibold text-gray-700 my-3.5">
                🔍 Skill Gap Analysis
              </h4>

              <div className="grid md:grid-cols-2 text-center gap-6 mt-6">
                {/* Matched Skills */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <FaSmileBeam className="text-lg" />
                    <p className="text-sm font-semibold">Matched Skills</p>
                  </div>
                  <div className="flex md:flex-col flex-wrap gap-2">
                    {aiResult.skillGapAnalysis?.matchedSkills?.length > 0 ? (
                      aiResult.skillGapAnalysis.matchedSkills.map(
                        (skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No matched skills found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <ImSad2 className="text-lg" />
                    <p className="text-sm font-semibold">Missing Skills</p>
                  </div>
                  <div className="flex flex-wrap md:flex-col gap-2">
                    {aiResult.skillGapAnalysis?.missingSkills?.length > 0 ? (
                      aiResult.skillGapAnalysis.missingSkills.map(
                        (skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No major skill gaps detected.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-blue-700 mb-1">
                  📈 Recommendations
                </h4>
                <ul className="list-disc text-sm text-gray-800 list-inside">
                  {aiResult.skillGapAnalysis?.recommendations?.map(
                    (rec, idx) => (
                      <li key={idx}>{rec}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-yellow-700 mb-1">⚠️ Notes</h4>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {aiResult.notes?.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ask Again */}
          <div className="text-right my-6 ">
            <button
              onClick={handleAskAgain}
              className="text-sm px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white hover:scale-110 transition transform rounded"
            >
              Ask Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
