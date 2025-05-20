import { motion } from "framer-motion";
import { FaGithub, FaHeart, FaBug, FaEnvelope } from "react-icons/fa";
import { SiGoogleforms } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Created with Love */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex  flex-col gap-1 text-sm"
        >
          {/* Logo */}
          <div className="text-center md:text-left">
            <span className="font-bold text-lg text-sky-700">ResuMate</span>
          </div>

          {/* Created with ❤️ by ResuMate */}
          <div className="flex items-center gap-1 text-gray-500">
            <span>Created with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <FaHeart className="text-sky-700" />
            </motion.span>
          </div>
        </motion.div>

        {/* Right: Icons and Bug Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => alert("Report Bug")}
            className="flex items-center gap-1 px-3 py-1 text-sm text-sky-700 border border-sky-700 rounded hover:bg-sky-50 transition"
          >
            <FaBug />
            Report Bug
          </button>
          <a
            href="https://github.com/VrandaaGarg/ResuMate"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-700 transition"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="mailto:connect@vrandacodz.xyz"
            className="hover:text-sky-700 transition"
          >
            <FaEnvelope size={18} />
          </a>
        </motion.div>
      </div>

      {/* Copyright */}
      <p className="text-xs text-center text-gray-400 mt-3">
        © {new Date().getFullYear()} ResuMate. All rights reserved.
      </p>
    </footer>
  );
}
