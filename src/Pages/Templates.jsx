import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegClock } from "react-icons/fa";

export default function Templates() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gradient-to-br from-white via-sky-50 to-white "
    >
      <FaRegClock className="text-5xl text-sky-700 mb-4 animate-pulse" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Templates Coming Soon
      </h2>
      <p className="text-gray-600 mb-6">
        We’re designing beautiful resume templates just for you. Hang tight!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
      >
        Back to Dashboard
      </motion.button>
    </motion.div>
  );
}
