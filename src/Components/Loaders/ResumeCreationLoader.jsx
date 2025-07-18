// src/Components/Loaders/ResumeCreationLoader.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileAlt,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";

const ResumeCreationLoader = ({ isVisible }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      id: 1,
      icon: FaFileAlt,
      title: "Analyzing Document",
      description: "Reading and extracting content from your resume",
      duration: 3000,
    },
    {
      id: 2,
      icon: FaUser,
      title: "Extracting Personal Info",
      description: "Identifying contact details and personal information",
      duration: 2000,
    },
    {
      id: 3,
      icon: FaBriefcase,
      title: "Processing Experience",
      description: "Analyzing work experience and skills",
      duration: 2500,
    },
    {
      id: 4,
      icon: FaGraduationCap,
      title: "Organizing Education",
      description: "Organizing educational background and achievements",
      duration: 2000,
    },
    {
      id: 5,
      icon: FaCheckCircle,
      title: "Finalizing Resume",
      description: "Creating your professional resume format",
      duration: 1500,
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/95 backdrop-blur-md max-h-[90vh] overflow-y-auto rounded-xl md:rounded-2xl p-4 md:p-8 max-w-md w-full mx-auto border border-white/30 shadow-2xl relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0  bg-gradient-to-br from-blue-50/80 via-white/50 to-cyan-50/80 rounded-2xl" />
          {/* Header */}
          <div className="text-center mb-2 md:mb-4 relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 md:w-14 md:h-14 border-4 border-blue-200/50 border-t-blue-500 rounded-full mx-auto mb-1.5 md:mb-3 shadow-lg"
            />
            <h2 className="text-sm md:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent md:mb-1">
              Creating Your Resume
            </h2>
            <p className="text-slate-600 text-xs md:text-sm">
              AI is processing your document...
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-1 md:space-y-2.5 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStepIndex === index && !isCompleted;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-1.5 md:gap-3 p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                    isCompleted
                      ? "bg-green-50/80 border border-green-200/60 shadow-md"
                      : isCurrent
                      ? "bg-blue-50/80 border border-blue-200/60 shadow-md"
                      : "bg-white/40 border border-slate-200/40"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`md:w-8 md:h-8 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : isCurrent
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheckCircle size={12} />
                    ) : (
                      <step.icon size={12} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-xs md:text-sm transition-colors ${
                        isCompleted
                          ? "text-green-600"
                          : isCurrent
                          ? "text-blue-600"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="md:w-6 md:h-6 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm"
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
                        className="md:w-6 md:h-6 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 md:mt-6 relative z-10">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Progress</span>
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 md:h-2 rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center  mt-2 md:mt-6 space-x-1 relative z-10">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`resume-loader-dot-${i}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="md:w-2 md:h-2 h-1 w-1 bg-blue-500 rounded-full shadow-sm"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeCreationLoader;
