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
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useAuth } from "../Contexts/AuthContext";
import { getUserUploadedResumes, deleteUploadedResume } from "../db/database";
import ResumeUploadModal from "../Components/ResumeUploadModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
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
    },
    {
      action: "Member since",
      time: `${memberSince}`,
      icon: FaStar,
      color: "text-green-600",
    },
  ];

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

        {/* Uploaded Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Uploads
            </h2>
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Your First Resume
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedResumes.map((resume, index) => (
                  <ResumeItem
                    key={resume.id}
                    resume={resume}
                    onDelete={handleDeleteResume}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
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
                <FaFileAlt className="text-xs md:text-xl " />
              </div>
              <h2 className="text-sm md:text-xl font-bold text-gray-900">
                Resume Status
              </h2>
            </div>

            {resume?.name ? (
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-1 text-[16px] md:text-sm">
                    ✅ Resume Ready
                  </h3>
                  <p className="text-[12px] md:text-xs text-green-700">
                    Your resume "{resume.name}" is ready to go! You can continue
                    editing or download it.
                  </p>
                </div>

                <div className="flex gap-2 text-[12px] md:text-sm">
                  <Link
                    to="/resume-form"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors  font-medium"
                  >
                    <FaPen size={12} />
                    Edit Resume
                  </Link>
                  <Link
                    to="/resume"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors  font-medium"
                  >
                    <FaFileAlt size={12} />
                    View Resume
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

                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaUpload size={16} />
                    Upload Resume
                  </button>
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
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-[16px] md:text-sm">
                      {activity.action}
                    </p>
                    <p className="text-[12px] md:text-xs text-gray-500">
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
const ResumeItem = ({ resume, onDelete, index }) => {
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
      className="flex items-center  justify-between p-1 md:p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FaFileAlt className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {resume.fileName}
          </h4>
          <p className="text-sm text-gray-500">
            {formatFileSize(resume.fileSize)} • {formatDate(resume.uploadedAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center md:gap-2">
        {/* View Button */}
        <button
          title="View Resume"
          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <FaEye size={16} />
        </button>

        {/* Download Button */}
        <button
          title="Download Resume"
          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          <FaDownload size={16} />
        </button>

        {/* Delete Button */}
        <button
          title="Delete Resume"
          onClick={() => onDelete(resume)}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
};
