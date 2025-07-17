// src/Pages/ResumeUpload.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaFileAlt,
  FaTrash,
  FaEye,
  FaRobot,
  FaChartLine,
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  uploadFile,
  validateResumeFile,
  deleteFile,
} from "../services/fileStorage";
import {
  saveUploadedFile,
  getUserUploadedFiles,
  deleteUploadedFile,
  createResume,
  updateResume,
} from "../db/database";
import { parseResumeFromUpload, checkATSFromUpload } from "../utils/ai";
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

const ResumeUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { resume, setResume } = useResumeData();

  // Load user's uploaded files on component mount
  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const files = await getUserUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load uploaded files");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    const file = files[0]; // Only handle single file for now
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

      // Update local state
      setUploadedFiles((prev) => [uploadResult, ...prev]);

      toast.success("Resume uploaded successfully!", { id: uploadToastId });
    } catch (error) {
      console.error("Upload error:", error);

      // More specific error messages
      let errorMessage = "Failed to upload resume. Please try again.";
      if (error.message.includes("size")) {
        errorMessage =
          "File is too large. Please upload a file smaller than 10MB.";
      } else if (error.message.includes("type")) {
        errorMessage =
          "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast.error(errorMessage, { id: uploadToastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileData) => {
    try {
      // Delete from Appwrite storage
      await deleteFile(fileData.fileId);

      // Delete metadata from Firestore
      await deleteUploadedFile(fileData.fileId);

      // Update local state
      setUploadedFiles((prev) =>
        prev.filter((f) => f.fileId !== fileData.fileId)
      );

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "📝";
    return "📄";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Resume</h1>
        <p className="text-gray-600">
          Upload your existing resume to create a new one with ResuMate's
          templates and AI enhancements
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleInputChange}
            accept=".pdf,.doc,.docx,.txt"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-700">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FaUpload className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Drop your resume here or click to browse
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX, and TXT files (max 10MB)
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Uploaded Resumes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uploadedFiles.map((file, index) => (
              <FileCard
                key={file.fileId}
                file={file}
                onDelete={handleDeleteFile}
                navigate={navigate}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No resumes uploaded yet
          </h3>
          <p className="text-gray-500">
            Upload your first resume to get started
          </p>
        </motion.div>
      )}
    </div>
  );
};

// File Card Component
const FileCard = ({ file, onDelete, navigate, index }) => {
  const [showActions, setShowActions] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [isCheckingATS, setIsCheckingATS] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [showATSResult, setShowATSResult] = useState(false);

  const handleCreateResume = async () => {
    if (isCreatingResume) return; // Prevent multiple clicks

    try {
      setIsCreatingResume(true);
      toast.loading("Parsing your resume with AI...", { id: "parsing" });

      // Parse the resume using OpenAI
      const parsedData = await parseResumeFromUpload(file.fileUrl);

      // Transform the parsed data to match the expected resume structure
      const transformedData = transformParsedDataToResumeFormat(parsedData);

      // Save to Firebase (this will trigger ResumeDataContext to update)
      await createResume(transformedData);

      toast.success("Resume created successfully!", { id: "parsing" });

      // Navigate to the resume page to view/edit
      navigate("/resume");
    } catch (error) {
      console.error("Error creating resume from upload:", error);

      // More specific error messages
      let errorMessage = "Failed to create resume. Please try again.";
      if (error.message.includes("parse")) {
        errorMessage =
          "Failed to parse resume. Please ensure the file is readable.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage, { id: "parsing" });
    } finally {
      setIsCreatingResume(false);
    }
  };

  const handleATSCheck = async () => {
    if (isCheckingATS) return; // Prevent multiple clicks

    try {
      setIsCheckingATS(true);
      toast.loading("Analyzing ATS compatibility...", { id: "ats-check" });

      // Check ATS compatibility using OpenAI
      const atsData = await checkATSFromUpload(file.fileUrl);

      setAtsResult(atsData);
      setShowATSResult(true);

      toast.success(`ATS Score: ${atsData.atsScore}/100`, { id: "ats-check" });
    } catch (error) {
      console.error("Error checking ATS compatibility:", error);

      let errorMessage = "Failed to check ATS compatibility. Please try again.";
      if (error.message.includes("parse")) {
        errorMessage =
          "Failed to analyze resume. Please ensure the file is readable.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage, { id: "ats-check" });
    } finally {
      setIsCheckingATS(false);
    }
  };

  const handleJobAnalysis = () => {
    // Navigate to job fit analyzer with file data
    navigate("/job-fit-analyzer", { state: { uploadedFile: file } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getFileIcon(file.fileType)}</span>
          <div>
            <h3
              className="font-medium text-gray-800 truncate max-w-[150px]"
              title={file.fileName}
            >
              {file.fileName}
            </h3>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.fileSize)} •{" "}
              {new Date(file.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(file)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showActions ? 1 : 0,
          height: showActions ? "auto" : 0,
        }}
        transition={{ duration: 0.2 }}
        className="space-y-2 overflow-hidden"
      >
        <button
          onClick={handleCreateResume}
          disabled={isCreatingResume}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm ${
            isCreatingResume ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isCreatingResume ? (
            <>
              <FaSpinner size={12} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaPlus size={12} />
              Create Resume
            </>
          )}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleATSCheck}
            disabled={isCheckingATS}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs ${
              isCheckingATS ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isCheckingATS ? (
              <>
                <FaSpinner size={10} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <FaRobot size={10} />
                ATS Check
              </>
            )}
          </button>
          <button
            onClick={handleJobAnalysis}
            className="flex items-center gap-1 px-2 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
          >
            <FaChartLine size={10} />
            Job Analysis
          </button>
        </div>

        {/* ATS Result Display */}
        {showATSResult && atsResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">ATS Analysis Result</h4>
              <button
                onClick={() => setShowATSResult(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">ATS Score:</span>
                <span
                  className={`text-lg font-bold ${
                    atsResult.atsScore >= 80
                      ? "text-green-600"
                      : atsResult.atsScore >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {atsResult.atsScore}/100
                </span>
              </div>
            </div>

            {atsResult.generalTips && atsResult.generalTips.length > 0 && (
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Key Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  {atsResult.generalTips.slice(0, 2).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() =>
                navigate("/ats-checker", {
                  state: { atsResult, uploadedFile: file },
                })
              }
              className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              View Detailed Analysis →
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Helper function (moved outside component to avoid recreation)
const getFileIcon = (fileType) => {
  if (fileType?.includes("pdf")) return "📄";
  if (fileType?.includes("word") || fileType?.includes("document")) return "📝";
  return "📄";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default ResumeUpload;
