// src/Components/DeleteConfirmModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full mx-auto border border-white/20 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white/50 to-orange-50/50 rounded-2xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaExclamationTriangle className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Resume</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200 disabled:opacity-50"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 mb-6">
            <p className="text-gray-700 text-center mb-4">
              Are you sure you want to delete this resume?
            </p>

            {fileName && (
              <div className="bg-gray-100/80 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-medium text-gray-800">{fileName}</span>
                </p>
              </div>
            )}

            <p className="text-sm text-red-600 text-center">
              ⚠️ This action cannot be undone
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash size={14} />
                  Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
