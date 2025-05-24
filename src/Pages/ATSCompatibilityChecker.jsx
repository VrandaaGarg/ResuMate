import React, { useState } from "react";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { atsScore } from "../utils/ai";
import { FaRobot } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function ATSCompatibilityChecker() {
  const { resume } = useResumeData();
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(() => {
    const saved = localStorage.getItem("atsResult");
    return saved ? JSON.parse(saved) : null;
  });

  const handleCheckATS = async () => {
    setLoading(true);
    const result = await atsScore(resume);
    setAtsResult(result);
    localStorage.setItem("atsResult", JSON.stringify(result));
    setLoading(false);
  };

  const handleReset = () => {
    setAtsResult(null);
    localStorage.removeItem("atsResult");
  };

  return (
    <div className="min-h-[70lvh] px-6 md:px-20 py-16 bg-gradient-to-br from-white via-sky-50 to-white">
      {/* Step 1: Intro */}
      {!atsResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto bg-white shadow-lg p-10 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-3 text-sky-700 text-2xl font-bold">
            <FaRobot className="text-3xl" />
            ATS Compatibility Checker
          </div>

          <p className="text-sm md:text-base text-gray-600 mt-3">
            ATS (Applicant Tracking System) is used by recruiters to scan
            resumes. Let’s see how your resume performs and get tips to boost
            your chances!
          </p>

          <button
            onClick={handleCheckATS}
            disabled={loading}
            className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold shadow hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <FaArrowRotateRight className="animate-spin" />
                Checking...
              </span>
            ) : (
              "Check Now"
            )}
          </button>
        </motion.div>
      )}

      {/* Step 2: Result */}
      {atsResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white shadow-lg p-10 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-sky-700 text-center mb-4">
            ATS Compatibility Report
          </h2>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">ATS Score</p>
            <p className="text-4xl font-bold text-sky-600">
              {atsResult.atsScore}%
            </p>
          </div>

          {/* Section Feedback */}
          {atsResult.sectionWiseFeedback && (
            <div className="space-y-4 mb-6">
              {Object.entries(atsResult.sectionWiseFeedback).map(
                ([section, feedback]) => (
                  <div key={section} className="mb-4">
                    <h4 className="font-semibold text-sky-700 capitalize">
                      {section}
                    </h4>

                    {/* Missing items */}
                    {feedback.missing?.length > 0 && (
                      <div className="text-sm text-red-600 mb-1">
                        <strong>Missing:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {feedback.missing.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {feedback.suggestions?.length > 0 && (
                      <div className="text-sm text-emerald-700">
                        <strong>Suggestions:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {feedback.suggestions.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* General Tips */}
          {atsResult.generalTips && (
            <div>
              <h4 className="font-semibold text-emerald-700 mb-1">
                📈 General Pro Tips
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {atsResult.generalTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-right mt-6">
            <button
              onClick={handleReset}
              className="text-sm px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white hover:scale-105 transition transform rounded"
            >
              Recheck
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
