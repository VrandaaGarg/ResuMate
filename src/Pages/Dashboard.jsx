// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaUpload,
  FaPen,
  FaFileAlt,
  FaRocket,
  FaStar,
  FaChartLine,
  FaClock,
  FaRobot,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheck,
  FaCloudDownloadAlt,
  FaChevronCircleRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useAuth } from "../Contexts/AuthContext";
import { getUserUploadedResumes, deleteUploadedResume } from "../db/database";
import ResumeUploadModal from "../Components/ResumeUploadModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
import PdfActionsModal from "../Components/PdfActionsModal";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { resume, setResume } = useResumeData();
  const { user } = useAuth();
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resume: null,
  });
  const [pdfActionsModal, setPdfActionsModal] = useState({
    isOpen: false,
    resume: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("Classic");

  useEffect(() => {
    const storedTemplate = localStorage.getItem("selectedTemplate");
    if (storedTemplate) {
      setSelectedTemplate(
        storedTemplate.charAt(0).toUpperCase() + storedTemplate.slice(1)
      );
    }
  }, []);
  // Format the creation date
  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  // Load uploaded resumes
  useEffect(() => {
    const loadUploadedResumes = async () => {
      try {
        setLoadingResumes(true);
        const resumes = await getUserUploadedResumes();
        // Sort by upload date (newest first) and take only latest 5
        const sortedResumes = resumes
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 5);
        setUploadedResumes(sortedResumes);
      } catch (error) {
        console.error("Error loading uploaded resumes:", error);
        toast.error("Failed to load uploaded resumes");
      } finally {
        setLoadingResumes(false);
      }
    };

    if (user) {
      loadUploadedResumes();
    }
  }, [user]);

  // Handle upload success
  const handleUploadSuccess = (uploadedFile) => {
    // Refresh uploaded resumes list
    const loadUploadedResumes = async () => {
      try {
        const resumes = await getUserUploadedResumes();
        const sortedResumes = resumes
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 5);
        setUploadedResumes(sortedResumes);
      } catch (error) {
        console.error("Error refreshing uploaded resumes:", error);
      }
    };
    loadUploadedResumes();
  };

  // Handle delete resume - open confirmation modal
  const handleDeleteResume = (resume) => {
    setDeleteModal({ isOpen: true, resume });
  };

  // Confirm delete resume
  const confirmDeleteResume = async () => {
    if (!deleteModal.resume) return;

    setIsDeleting(true);
    try {
      await deleteUploadedResume(deleteModal.resume.id);
      setUploadedResumes((prev) =>
        prev.filter((r) => r.id !== deleteModal.resume.id)
      );
      toast.success("Resume deleted successfully!");
      setDeleteModal({ isOpen: false, resume: null });
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, resume: null });
    }
  };

  // Handle PDF actions - open modal
  const handlePdfActions = (resume) => {
    setPdfActionsModal({ isOpen: true, resume });
  };

  // Close PDF actions modal
  const closePdfActionsModal = () => {
    setPdfActionsModal({ isOpen: false, resume: null });
  };

  // Handle view PDF
  const handleViewPdf = (resume) => {
    if (resume.fileUrl) {
      window.open(resume.fileUrl, "_blank");
    } else {
      toast.error("File URL not available");
    }
  };

  // Handle download PDF
  const handleDownloadPdf = async (resume) => {
    try {
      const response = await fetch(resume.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const quickActions = [
    {
      title: "Create New Resume",
      description: "Start building your professional resume from scratch",
      icon: FaPlus,
      link: "/resume-form",
      color: "from-blue-500 to-cyan-400",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Upload Existing Resume",
      description: "Upload your existing resume and enhance it with AI",
      icon: FaUpload,
      action: () => setIsUploadModalOpen(true),
      color: "from-yellow-500 to-orange-400",
      bgColor: "from-yellow-50 to-orange-50",
    },
    {
      title: "ATS Compatibility Check",
      description: "Ensure your resume passes ATS filters",
      icon: FaRobot,
      link: "/ats-checker",
      color: "from-purple-500 to-pink-400",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Job Fit Analyzer",
      description: "Check how well your resume matches job descriptions",
      icon: FaChartLine,
      link: "/job-fit-analyzer",
      color: "from-green-500 to-emerald-400",
      bgColor: "from-green-50 to-emerald-50",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "No resume created";
    if (typeof date === "object" && date.seconds)
      date = new Date(date.seconds * 1000);
    else date = new Date(date);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const recentActivity = [
    {
      action: "Resume Created",
      time: resume?.createdOn
        ? formatDate(resume.createdOn)
        : "No resume created",
      icon: FaFileAlt,
      color: "text-blue-600",
      date: resume?.createdOn
        ? new Date(resume.createdOn.seconds * 1000)
        : new Date(0),
    },
    {
      action: "Member since",
      time: `${memberSince}`,
      icon: FaStar,
      color: "text-green-600",
      date: user.metadata?.creationTime
        ? new Date(user.metadata.creationTime)
        : new Date(0),
    },
    ...uploadedResumes.map((r) => ({
      action: "Resume Uploaded",
      time: formatDate(r.uploadedAt),
      icon: FaUpload,
      color: "text-yellow-600",
      date: new Date(r.uploadedAt),
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 4);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 md:px-12 py-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-200 opacity-15 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-200 opacity-10 blur-3xl rounded-full z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-3 shadow-lg">
            <FaRocket className="text-blue-500 text-xs" />
            <span className="text-[10px] md:text-xs md:font-medium text-gray-700">
              Welcome to your Dashboard
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2 [font-family:'Lilita_One',cursive]">
            Welcome Back! 👋
          </h1>

          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            {resume?.name
              ? "Continue building your professional story with ResuMate"
              : "Ready to create your first resume? Let's get started!"}
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.03, y: -3 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {action.link ? (
                <Link to={action.link} className="block">
                  <ActionCard action={action} />
                </Link>
              ) : (
                <button
                  onClick={action.action}
                  className="block w-full text-left"
                >
                  <ActionCard action={action} />
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Current Resume Status & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-6">
          {/* Current Resume Status */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-1.5 md:mb-4">
              <div className="p-1 md:p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white shadow-lg">
                <FaFileAlt className="text-xs md:text-sm " />
              </div>
              <h2 className="text-md md:text-xl font-bold text-gray-900">
                Resume Status
              </h2>
            </div>

            {resume?.name ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-100 via-emerald-50 to-teal-50 border border-green-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-md">
                      <FaCheck className="text-green-500 text-sm md:text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-sm md:text-lg">
                        Your Resume is Ready!
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        "{resume.name}" is polished and ready for opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="font-semibold text-gray-700">
                      Template:
                    </span>
                    <span className="font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {resume.template || selectedTemplate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="font-semibold text-gray-700">
                      Last Updated:
                    </span>
                    <span className="font-mono text-xs">
                      {formatDate(resume.updatedOn || resume.createdOn)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row gap-3 mt-4">
                  <Link
                    to="/resume-form"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-2 md:px-5 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg transition-all duration-300 font-medium text-[16px] md:text-sm"
                  >
                    <FaPen />
                    Edit Resume
                  </Link>
                  <Link
                    to="/resume"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-2 md:px-5 py-2 md:py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300 font-medium text-[16px] md:text-sm"
                  >
                    <FaEye />
                    Preview
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Resume Yet
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Get started by creating your first resume or uploading an
                  existing one.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/resume-form"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaPlus size={16} />
                    Create Resume
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg text-white shadow-lg">
                <FaClock className="text-[12px] text-xl" />
              </div>
              <h2 className="text-sm md:text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-1.5 md:p-3 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
                >
                  <div
                    className={`p-1.5 ${activity.color} bg-white rounded-md shadow-sm`}
                  >
                    <activity.icon size={14} />
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="font-medium text-gray-900 text-[16px] md:text-sm">
                      {activity.action}
                    </p>
                    <p className="text-[12px] text-right md:text-xs text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaClock className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Uploaded Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Uploads
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  title="Upload Resume"
                  className="inline-flex items-center gap-2 px-1.5 md:px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                >
                  <FaCloudDownloadAlt className="text-white text-sm" />
                  <span className="hidden md:inline">Upload</span>
                </button>
                {uploadedResumes.length > 0 && (
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-1.5 md:px-3 py-1.5 bg-gradient-to-r from-gray-600 to-zinc-500 text-white rounded-lg hover:from-gray-800 hover:to-zinc-700 hover:shadow-lg transition-all duration-300 font-medium text-sm"
                  >
                    <span className="hidden md:inline">View All</span>
                    <FaChevronCircleRight className="text-xs" />
                  </Link>
                )}
              </div>
            </div>
            {loadingResumes ? (
              <div className="flex items-center justify-center py-8">
                <FaClock className="animate-spin text-gray-400 mr-2" />
                <span className="text-gray-500">Loading resumes...</span>
              </div>
            ) : uploadedResumes.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No resumes uploaded yet</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedResumes.map((resume, index) => (
                  <ResumeItem
                    key={resume.id}
                    resume={resume}
                    onDelete={handleDeleteResume}
                    onPdfActions={handlePdfActions}
                    onView={handleViewPdf}
                    onDownload={handleDownloadPdf}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteResume}
        fileName={deleteModal.resume?.fileName}
        isDeleting={isDeleting}
      />

      {/* PDF Actions Modal */}
      <PdfActionsModal
        isOpen={pdfActionsModal.isOpen}
        onClose={closePdfActionsModal}
        selectedResume={pdfActionsModal.resume}
      />
    </div>
  );
}

// ActionCard Component
const ActionCard = ({ action }) => (
  <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 md:p-5 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
    {/* Gradient Background */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}
    />

    {/* Icon */}
    <motion.div
      whileHover={{ rotate: 12, scale: 1.1 }}
      transition={{ duration: 0.3 }}
      className={`relative z-10 md:w-12 md:h-12 w-7 h-7 bg-gradient-to-r ${action.color} rounded md:rounded-xl text-white flex items-center justify-center mb-1.5 md:mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
    >
      <action.icon size={20} />
    </motion.div>

    <div className="relative z-10">
      <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
        {action.title}
      </h3>
      <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
        {action.description}
      </p>
    </div>
  </div>
);

// ResumeItem Component
const ResumeItem = ({
  resume,
  onDelete,
  onPdfActions,
  onView,
  onDownload,
  index,
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center justify-between p-1 md:p-3 bg-gray-50/50 rounded-lg hover:bg-gray-200/55  transition-colors"
    >
      <div
        className="flex items-center gap-3 flex-1 cursor-pointer"
        onClick={() => onPdfActions(resume)}
        title="Click to process this resume"
      >
        <div className="md:w-10 w-7 h-7 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FaFileAlt className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 break-all text-[16px] md:text-sm">
            {resume.fileName}
          </h4>
          <p className="text-[12px] md:text-sm text-gray-500">
            {formatFileSize(resume.fileSize)} • {formatDate(resume.uploadedAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center md:gap-2">
        {/* View Button */}
        <button
          title="View Resume"
          onClick={(e) => {
            e.stopPropagation();
            onView(resume);
          }}
          className="p-1 md:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <FaEye size={16} />
        </button>

        {/* Download Button */}
        <button
          title="Download Resume"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(resume);
          }}
          className="p-1 md:p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          <FaDownload size={16} />
        </button>

        {/* Delete Button */}
        <button
          title="Delete Resume"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resume);
          }}
          className="p-1 md:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
};
