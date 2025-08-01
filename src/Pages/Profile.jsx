import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiLogOut,
  FiUser,
  FiMail,
  FiCheck,
  FiX,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import {
  FaFileAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaUpload,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import showSuccessToast from "../Components/showSuccessToast";
import { getUserUploadedResumes, deleteUploadedResume } from "../db/database";
import ResumeUploadModal from "../Components/ResumeUploadModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
  });
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resume: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load uploaded resumes
  useEffect(() => {
    const loadUploadedResumes = async () => {
      try {
        setLoadingResumes(true);
        const resumes = await getUserUploadedResumes();
        // Sort by upload date (newest first)
        const sortedResumes = resumes.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
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
        const sortedResumes = resumes.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
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

  const handleSave = async () => {
    try {
      await updateUser({ displayName: form.name });
      setEditing(false);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    showSuccessToast("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-4 sm:px-6 md:px-20 py-8 sm:py-12 md:py-16 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute top-1/2 left-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-r from-green-100/15 to-emerald-100/15 blur-3xl rounded-full z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 sm:px-6 py-2 mb-4 shadow-lg">
            <FiUser className="text-blue-500" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              User Profile
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Profile Settings
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 px-4 sm:px-0">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8 text-center text-white relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-20 sm:w-40 h-20 sm:h-40 border border-white/10 rounded-full"
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10"
            >
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold uppercase shadow-2xl border-4 border-white/20"
              >
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </motion.div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                {user?.displayName || "User"}
              </h2>
              <p className="text-white/80 text-sm sm:text-base break-all sm:break-normal">
                {user?.email}
              </p>
            </motion.div>
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Full Name Input */}
                  <div className="relative group">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <FiUser className="text-blue-600" />
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-8 sm:pl-12 border-2 border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 group-hover:border-slate-300 text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                      <FiUser className="absolute left-2 sm:left-4 top-3 sm:top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <FiMail className="text-blue-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        disabled
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-8 sm:pl-12 border-2 border-slate-200/60 rounded-xl bg-slate-100/60 text-slate-600 font-medium cursor-not-allowed text-sm sm:text-base"
                        placeholder="Email cannot be changed"
                      />
                      <FiMail className="absolute left-2 sm:left-4 top-3 sm:top-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Email address cannot be modified for security reasons
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <motion.button
                      onClick={handleSave}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <FiCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Save Changes
                    </motion.button>
                    <motion.button
                      onClick={() => setEditing(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <FiX size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Profile Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-slate-50/80 border border-slate-200/60 rounded-xl">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">
                        Full Name
                      </label>
                      <p className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                        {user?.displayName || user?.name || "Not provided"}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-slate-50/80 border border-slate-200/60 rounded-xl">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1">
                        Email Address
                      </label>
                      <p className="text-base sm:text-lg text-slate-700 break-all sm:break-normal">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-200/60 rounded-xl text-center">
                      <FiStar className="text-xl sm:text-2xl text-blue-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium text-blue-800">
                        Account Status
                      </p>
                      <p className="text-base sm:text-lg font-bold text-blue-700">
                        Active
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/60 rounded-xl text-center">
                      <FiSettings className="text-xl sm:text-2xl text-green-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-medium text-green-800">
                        Profile
                      </p>
                      <p className="text-base sm:text-lg font-bold text-green-700">
                        Complete
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <motion.button
                      onClick={() => setEditing(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <FiEdit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Edit Profile
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <FiLogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Uploaded Resumes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 sm:mt-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Uploaded Resumes
            </h3>
          </div>

          {loadingResumes ? (
            <div className="flex items-center justify-center py-8">
              <FaClock className="animate-spin text-gray-400 mr-2" />
              <span className="text-gray-500">Loading resumes...</span>
            </div>
          ) : uploadedResumes.length === 0 ? (
            <div className="text-center py-8 ">
              <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No resumes uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {uploadedResumes.map((resume, index) => (
                <ProfileResumeItem
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDeleteResume}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 sm:mt-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FiSettings className="text-blue-600" />
            Account Information
          </h3>
          <div className="text-xs sm:text-sm text-slate-600 space-y-2">
            <p>• Your account data is securely stored and encrypted</p>
            <p>
              • Email address is used for authentication and cannot be changed
            </p>
            <p>• You can update your display name anytime</p>
            <p>• All changes are automatically saved to the cloud</p>
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
    </div>
  );
};

// ProfileResumeItem Component
const ProfileResumeItem = ({ resume, onDelete, index }) => {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className=" p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors border border-gray-200/50"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaFileAlt className="text-blue-600 text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 break-all text-sm sm:text-base">
              {resume.fileName}
            </h4>
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
      </div>
      <div className="flex items-center mt-2 justify-between gap-2">
        <p className="text-xs flex justify-start sm:text-sm text-gray-500">
          {formatFileSize(resume.fileSize)}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          {formatDate(resume.uploadedAt)}
        </p>
      </div>
    </motion.div>
  );
};

export default Profile;
