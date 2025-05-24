// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaUpload, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useResumeData } from "../Contexts/ResumeDataContext";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const { resume, setResume } = useResumeData();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumes")) || [];
    setResumes(stored);
  }, []);

  return (
    <div className="min-h-[67lvh]  px-6 md:px-20 py-16 bg-gradient-to-br from-white via-sky-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto bg-white shadow-lg p-10 rounded-xl text-center"
      >
        <h2 className="text-3xl font-bold text-sky-700 mb-2">
          Welcome to ResuMate 👋
        </h2>

        {resume?.name ? (
          <p className="text-gray-600 mb-6 text-sm">
            Edit your resume or upload a new one to get started!
          </p>
        ) : (
          <p className="text-gray-600 mb-6 text-sm">
            You haven't created or uploaded any resumes yet. Let's get started!
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/resume-form"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition"
          >
            {resume?.name ? <FaPen /> : <FaPlus />}
            {resume?.name ? "Edit Resume" : "Create Resume"}
          </Link>
          <Link
            to="/upload"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            <FaUpload /> Upload Resume
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
