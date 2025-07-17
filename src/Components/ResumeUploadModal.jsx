// src/Components/ResumeUploadModal.jsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaRobot,
  FaBriefcase,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { uploadFile, validateResumeFile } from "../services/fileStorage";
import { saveUploadedFile, createResume } from "../db/database";
import {
  parseResumeFromUpload,
  checkATSFromUpload,
  matchJDFromFile,
} from "../utils/ai";
import { useResumeData } from "../Contexts/ResumeDataContext";

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

const ResumeUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    createResume: false,
    checkATS: false,
    jobMatching: false,
  });
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  const navigate = useNavigate();
  const { setResume } = useResumeData();

  // Handle file upload
  const handleFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setIsUploading(true);
    const uploadToastId = toast.loading("Uploading your resume...");

    try {
      // Upload to Appwrite
      const uploadResult = await uploadFile(file);

      // Save metadata to Firestore
      await saveUploadedFile(uploadResult);

      setUploadedFile(uploadResult);
      toast.success("Resume uploaded successfully!", { id: uploadToastId });

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(uploadResult);
      }
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Failed to upload resume. Please try again.";
      if (error.message.includes("size")) {
        errorMessage =
          "File is too large. Please upload a file smaller than 10MB.";
      } else if (error.message.includes("type")) {
        errorMessage =
          "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.";
      }

      toast.error(errorMessage, { id: uploadToastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  // File input change handler
  const handleInputChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  // Handle option selection
  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Process selected options
  const handleDone = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a resume first");
      return;
    }

    const selectedCount = Object.values(selectedOptions).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error("Please select at least one option");
      return;
    }

    if (selectedOptions.jobMatching && !jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    setIsProcessing(true);

    try {
      // Process Create Resume
      if (selectedOptions.createResume) {
        setProcessingStep("Creating resume...");
        const parsedData = await parseResumeFromUpload(uploadedFile.fileUrl);
        const transformedData = transformParsedDataToResumeFormat(parsedData);
        await createResume(transformedData);
        toast.success("Resume created successfully!");
      }

      // Process ATS Check
      if (selectedOptions.checkATS) {
        setProcessingStep("Checking ATS compatibility...");
        const atsData = await checkATSFromUpload(uploadedFile.fileUrl);
        toast.success(`ATS Score: ${atsData.atsScore}/100`);

        // Navigate to ATS checker with results
        navigate("/ats-checker", {
          state: { atsResult: atsData, uploadedFile },
        });
      }

      // Process Job Matching
      if (selectedOptions.jobMatching) {
        setProcessingStep("Analyzing job fit...");
        const jobFitResult = await matchJDFromFile(
          uploadedFile.fileUrl,
          jobDescription,
          "concise"
        );
        toast.success("Job fit analysis complete!");
        navigate("/job-fit-analyzer", {
          state: { aiResult: jobFitResult, uploadedFile },
        });
      }

      // Close modal after processing
      onClose();
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process resume. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Reset modal state when closed
  const handleClose = () => {
    setUploadedFile(null);
    setSelectedOptions({
      createResume: false,
      checkATS: false,
      jobMatching: false,
    });
    setJobDescription("");
    setIsProcessing(false);
    setProcessingStep("");
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
          className="bg-white/90 backdrop-blur-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 max-w-md w-full mx-auto border border-white/20 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-2xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUpload className="text-white text-lg" />
              </div>
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upload Resume
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-4 md:p-8 text-center transition-all duration-300 mb-6 bg-white/40 backdrop-blur-sm ${
              dragActive
                ? "border-blue-400 bg-blue-50/50 shadow-lg scale-[1.02]"
                : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
            } ${
              isUploading ? "pointer-events-none opacity-60" : "hover:shadow-lg"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload-modal"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.txt"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FaSpinner className="animate-spin text-white text-xl" />
                </div>
                <p className="text-gray-700 font-medium">
                  Uploading your resume...
                </p>
                <p className="text-gray-500 text-sm mt-1">Please wait</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <p className="text-gray-800 font-semibold text-sm md:text-lg mb-1">
                  {uploadedFile.fileName}
                </p>
                <p className="text-green-600 text-xs md:text-sm font-medium">
                  ✓ Upload successful
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FaUpload className="text-white text-xl" />
                </div>
                <p className="text-gray-800 font-semibold text-sm md:text-lg mb-2">
                  Drop your resume here
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  or click to browse files
                </p>
                <div className="inline-flex items-center gap-2 bg-gray-100/80 rounded-lg md:rounded-full px-3 py-1">
                  <span className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-xs text-gray-500">Max 10MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2 md:space-y-3 mb-6"
            >
              <div className="text-xs md:text-sm font-medium text-gray-700 mb-3">
                What would you like to do with your resume?
              </div>
              <OptionCheckbox
                icon={<FaUpload />}
                label="Create Resume"
                description="Build a new resume from this file"
                checked={selectedOptions.createResume}
                onChange={() => handleOptionToggle("createResume")}
              />
              <OptionCheckbox
                icon={<FaRobot />}
                label="Check ATS Score"
                description="Analyze ATS compatibility"
                checked={selectedOptions.checkATS}
                onChange={() => handleOptionToggle("checkATS")}
              />
              <OptionCheckbox
                icon={<FaBriefcase />}
                label="Job Matching"
                description="Match with job descriptions"
                checked={selectedOptions.jobMatching}
                onChange={() => handleOptionToggle("jobMatching")}
              />
            </motion.div>
          )}

          {/* Job Description Input */}
          {selectedOptions.jobMatching && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
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

          {/* Done Button */}
          {uploadedFile && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={handleDone}
              disabled={
                isProcessing || Object.values(selectedOptions).every((v) => !v)
              }
              className="relative w-full py-2 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg overflow-hidden group"
            >
              {/* Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex items-center gap-1 md:gap-2">
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>{processingStep || "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs md:text-sm">Get Started</span>
                  </>
                )}
              </div>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Option Checkbox Component
const OptionCheckbox = ({ icon, label, description, checked, onChange }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onChange}
    className={`relative flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
      checked
        ? "border-blue-300 bg-blue-50/50 shadow-md"
        : "border-gray-200 bg-white/50 hover:border-blue-200 hover:bg-blue-50/30"
    }`}
  >
    {/* Checkbox */}
    <div
      className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-transparent"
          : "border-gray-300 bg-white"
      }`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2.5 h-2.5 bg-white rounded-sm"
        />
      )}
    </div>

    {/* Icon */}
    <div
      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
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
        className={`font-semibold text-xs md:text-sm transition-colors ${
          checked ? "text-blue-700" : "text-gray-800"
        }`}
      >
        {label}
      </div>
      <div className="text-xs md:text-sm text-gray-600 mt-0.5">
        {description}
      </div>
    </div>

    {/* Selection indicator */}
    {checked && (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
      >
        <FaCheckCircle className="text-white text-xs md:text-sm" />
      </motion.div>
    )}
  </motion.div>
);

export default ResumeUploadModal;
