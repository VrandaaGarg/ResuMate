// src/Components/Loaders/JobMatchingLoader.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaSearch,
  FaBalanceScale,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

const JobMatchingLoader = ({ isVisible }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      id: 1,
      icon: FaSearch,
      title: "Analyzing Job Description",
      description: "Extracting key requirements and skills from job posting",
      duration: 2400,
    },
    {
      id: 2,
      icon: FaBriefcase,
      title: "Processing Resume",
      description: "Identifying your skills, experience, and qualifications",
      duration: 3000,
    },
    {
      id: 3,
      icon: FaBalanceScale,
      title: "Matching Analysis",
      description: "Comparing your profile with job requirements",
      duration: 4000,
    },
    {
      id: 4,
      icon: FaLightbulb,
      title: "Generating Insights",
      description: "Creating personalized recommendations and gap analysis",
      duration: 2400,
    },
    {
      id: 5,
      icon: FaCheckCircle,
      title: "Finalizing Report",
      description: "Preparing your comprehensive job fit analysis",
      duration: 1400,
    },
  ];

  useEffect(() => {
    if (!isVisible) {
      setCompletedSteps([]);
      setCurrentStepIndex(0);
      return;
    }

    let stepTimer;
    const processSteps = () => {
      if (currentStepIndex < steps.length) {
        stepTimer = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, steps[currentStepIndex].id]);
          setCurrentStepIndex((prev) => prev + 1);
        }, steps[currentStepIndex]?.duration || 2000);
      }
    };

    processSteps();

    return () => {
      if (stepTimer) clearTimeout(stepTimer);
    };
  }, [currentStepIndex, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/95 backdrop-blur-md max-h-[90vh] overflow-y-auto rounded-xl md:rounded-2xl p-3 md:p-6 max-w-md w-full mx-auto border border-white/30 shadow-2xl relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 via-white/50 to-sky-50/80 rounded-2xl" />
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 relative z-10">
            <motion.div
              animate={{
                rotate: [0, 360],
                borderRadius: ["50%", "25%", "50%"],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                borderRadius: { duration: 2, repeat: Infinity },
              }}
              className="w-8 h-8 md:w-14 md:h-14 border-4 border-sky-200/50 border-t-sky-400 border-r-sky-400 rounded-full mx-auto mb-2 md:mb-4 shadow-lg"
            />
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-500 bg-clip-text text-transparent mb-2">
              Job Fit Analysis
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Matching your profile with job requirements...
            </p>
          </div>

          {/* Steps */}
          <div className=" space-y-2 md:space-y-3 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStepIndex === index && !isCompleted;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center md:gap-3  gap-1.5 p-2 rounded-md md:rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    isCompleted
                      ? "bg-green-50/80 border border-green-200/60 shadow-md"
                      : isCurrent
                      ? "bg-sky-50/80 border border-sky-200/60 shadow-md"
                      : "bg-white/40 border border-slate-200/40"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`md:w-10 md:h-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                        : isCurrent
                        ? "bg-gradient-to-r from-sky-400 to-sky-400 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle size={16} />
                    ) : (
                      <step.icon size={16} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-xs md:text-sm transition-colors ${
                        isCompleted
                          ? "text-green-500"
                          : isCurrent
                          ? "text-sky-500"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs  text-slate-400 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="md:w-6 md:h-6 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-sm"
                      >
                        <FaCheckCircle size={12} className="text-white" />
                      </motion.div>
                    )}
                    {isCurrent && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="md:w-6 md:h-6 w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-3 md:mt-6 relative z-10">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Job Matching Progress</span>
              <span>
                {Math.round((completedSteps.length / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200/60 rounded-full h-2 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedSteps.length / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-sky-400 to-sky-400 h-1 md:h-2 rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center mt-6 space-x-1 relative z-10">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`job-match-loader-dot-${i}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="md:w-2 md:h-2 w-1 h-1 bg-sky-400 rounded-full shadow-sm"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobMatchingLoader;
