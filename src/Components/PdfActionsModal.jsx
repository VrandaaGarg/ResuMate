// src/Components/PdfActionsModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaSpinner,
  FaRobot,
  FaBriefcase,
  FaUpload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { createResume } from "../db/database";
import {
  parseResumeFromUpload,
  checkATSFromUpload,
  matchJDFromFile,
} from "../utils/ai";
import { useResumeData } from "../Contexts/ResumeDataContext";
import ResumeCreationLoader from "./Loaders/ResumeCreationLoader";
import ATSCheckingLoader from "./Loaders/ATSCheckingLoader";
import JobMatchingLoader from "./Loaders/JobMatchingLoader";

// Transform OpenAI parsed data to match the expected resume structure
const transformParsedDataToResumeFormat = (parsedData) => {
  return {
    name: parsedData.name || "",
    description: parsedData.description || "",
    contact: {
      email: parsedData.contact?.email || "",
      phone: parsedData.contact?.phone || "",
      location: parsedData.contact?.location || "",
      linkedin: parsedData.contact?.linkedin || "",
      github: parsedData.contact?.github || "",
      websiteURL: parsedData.contact?.website || "",
    },
    skills: parsedData.skills?.map((skill) => ({
      domain: typeof skill === "string" ? "General" : skill.domain || "General",
      languages:
        typeof skill === "string" ? [skill] : skill.languages || [skill],
    })) || [{ domain: "General", languages: [] }],
    experience:
      parsedData.experience?.map((exp) => ({
        company: exp.company || "",
        role: exp.role || "",
        technologies: exp.technologies || "",
        years: exp.duration || "",
        description: exp.description || "",
      })) || [],
    projects:
      parsedData.projects?.map((proj) => ({
        name: proj.name || "",
        description: proj.description || "",
        github: proj.link || "",
        demo: proj.demo || "",
      })) || [],
    education: {
      college: parsedData.education?.[0]?.institution || "",
      degree: parsedData.education?.[0]?.degree || "",
      specialization: parsedData.education?.[0]?.specialization || "",
      location: parsedData.education?.[0]?.location || "",
      startYear:
        parsedData.education?.[0]?.duration?.split("-")?.[0]?.trim() || "",
      endYear:
        parsedData.education?.[0]?.duration?.split("-")?.[1]?.trim() || "",
      cgpa:
        parsedData.education?.[0]?.gpa || parsedData.education?.[0]?.cgpa || "",
      school: "",
      tenth: "",
      twelfth: "",
    },
    achievements:
      parsedData.achievements?.map((ach) => ({
        title: ach.title || "",
        description: ach.description || "",
        year: ach.year || "",
        month: ach.month || "",
      })) || [],
    certifications: parsedData.certifications || [],
  };
};

const PdfActionsModal = ({ isOpen, onClose, selectedResume }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [showResumeLoader, setShowResumeLoader] = useState(false);
  const [showATSLoader, setShowATSLoader] = useState(false);
  const [showJobMatchLoader, setShowJobMatchLoader] = useState(false);

  const navigate = useNavigate();
  const { setResume } = useResumeData();

  // Handle option selection - only allow one option at a time
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Process selected option
  const handleProcess = async () => {
    if (!selectedResume) {
      toast.error("No resume selected");
      return;
    }

    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }

    if (selectedOption === "jobMatching" && !jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    setIsProcessing(true);

    try {
      // Process Create Resume
      if (selectedOption === "createResume") {
        setShowResumeLoader(true);
        setProcessingStep("Creating resume...");

        const parsedData = await parseResumeFromUpload(selectedResume.fileUrl);
        console.log("Parsed data from AI:", parsedData);

        const transformedData = transformParsedDataToResumeFormat(parsedData);
        console.log("Transformed data:", transformedData);

        // Ensure we have a name, use a fallback if needed
        if (!transformedData.name || transformedData.name.trim() === "") {
          transformedData.name = "User";
        }

        await createResume(transformedData);

        // Update the context with the new resume data
        setResume(transformedData);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowResumeLoader(false);
          toast.success("Resume created successfully!");

          // Close modal and navigate to resume page
          onClose();
          navigate("/resume");
        }, 1000);
      }

      // Process ATS Check
      else if (selectedOption === "checkATS") {
        setShowATSLoader(true);
        setProcessingStep("Checking ATS compatibility...");

        const atsData = await checkATSFromUpload(selectedResume.fileUrl);

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowATSLoader(false);
          toast.success(`ATS Score: ${atsData.atsScore}/100`);

          // Close modal and navigate to ATS checker with results
          onClose();
          navigate("/ats-checker", {
            state: { atsResult: atsData, uploadedFile: selectedResume },
          });
        }, 1000);
      }

      // Process Job Matching
      else if (selectedOption === "jobMatching") {
        setShowJobMatchLoader(true);
        setProcessingStep("Analyzing job fit...");

        const jobFitResult = await matchJDFromFile(
          selectedResume.fileUrl,
          jobDescription,
          "concise"
        );

        // Wait a bit for the loader to complete its animation
        setTimeout(() => {
          setShowJobMatchLoader(false);
          toast.success("Job fit analysis complete!");

          // Close modal and navigate to job fit analyzer
          onClose();
          navigate("/job-fit-analyzer", {
            state: { aiResult: jobFitResult, uploadedFile: selectedResume },
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process resume. Please try again.");

      // Hide all loaders on error
      setShowResumeLoader(false);
      setShowATSLoader(false);
      setShowJobMatchLoader(false);
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Reset modal state when closed
  const handleClose = () => {
    setSelectedOption("");
    setJobDescription("");
    setIsProcessing(false);
    setProcessingStep("");
    setShowResumeLoader(false);
    setShowATSLoader(false);
    setShowJobMatchLoader(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-8 max-w-md w-full mx-auto border border-white/20 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-2xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-3 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUpload className="text-white text-sm md:text-lg" />
              </div>
              <h2 className="text-md md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Process Resume
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Selected Resume Info */}
          {selectedResume && (
            <div className="relative z-10 mb-3 md:mb-6 p-2 md:p-4 bg-blue-50/50 rounded-lg md:rounded-xl border border-blue-200/50">
              <h3 className="font-semibold text-sm md:text-base text-blue-800 mb-1">
                Selected Resume:
              </h3>
              <p className="text-blue-700 text-xs md:text-sm">
                {selectedResume.fileName}
              </p>
            </div>
          )}

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative z-10 space-y-3 mb-3 md:mb-6"
          >
            <div className="text-xs md:text-sm font-medium text-gray-700 mb-3">
              What would you like to do with this resume?
            </div>

            <OptionRadio
              icon={<FaUpload />}
              label="Create Resume"
              description="Build a new resume from this file"
              value="createResume"
              checked={selectedOption === "createResume"}
              onChange={() => handleOptionSelect("createResume")}
            />

            <OptionRadio
              icon={<FaRobot />}
              label="Check ATS Score"
              description="Analyze ATS compatibility"
              value="checkATS"
              checked={selectedOption === "checkATS"}
              onChange={() => handleOptionSelect("checkATS")}
            />

            <OptionRadio
              icon={<FaBriefcase />}
              label="Job Matching"
              description="Match with job descriptions"
              value="jobMatching"
              checked={selectedOption === "jobMatching"}
              onChange={() => handleOptionSelect("jobMatching")}
            />
          </motion.div>

          {/* Job Description Input */}
          {selectedOption === "jobMatching" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 resize-none placeholder-gray-400 text-sm"
                placeholder="Paste the job description here..."
              />
            </motion.div>
          )}

          {/* Process Button */}
          {selectedOption && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={handleProcess}
              disabled={isProcessing}
              className="relative w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg overflow-hidden group"
            >
              {/* Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>{processingStep || "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <span>Process Resume</span>
                  </>
                )}
              </div>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Loaders - Only render the active one */}
      {showResumeLoader && (
        <ResumeCreationLoader isVisible={showResumeLoader} />
      )}
      {showATSLoader && <ATSCheckingLoader isVisible={showATSLoader} />}
      {showJobMatchLoader && (
        <JobMatchingLoader isVisible={showJobMatchLoader} />
      )}
    </AnimatePresence>
  );
};

// Option Radio Component
const OptionRadio = ({ icon, label, description, checked, onChange }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onChange}
    className={`relative flex items-center gap-2.5 md:gap-4 p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
      checked
        ? "border-blue-300 bg-blue-50/50 shadow-md"
        : "border-gray-200 bg-white/50 hover:border-blue-200 hover:bg-blue-50/30"
    }`}
  >
    {/* Radio */}
    <div
      className={`md:w-5 w-4 h-4 md:h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-transparent"
          : "border-gray-300 bg-white"
      }`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2.5 h-2.5 bg-white rounded-full"
        />
      )}
    </div>

    {/* Icon */}
    <div
      className={`md:w-10 w-8 h-8 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
    </div>

    {/* Content */}
    <div className="flex-1">
      <div
        className={`font-semibold text-sm transition-colors ${
          checked ? "text-blue-700" : "text-gray-800"
        }`}
      >
        {label}
      </div>
      <div className="text-xs md:text-sm text-gray-600 mt-0.5">
        {description}
      </div>
    </div>
  </motion.div>
);

export default PdfActionsModal;
