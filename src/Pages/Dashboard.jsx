// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaUpload, FaPen, FaFileAlt, FaRocket, FaStar, FaChartLine, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useResumeData } from "../Contexts/ResumeDataContext";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const { resume, setResume } = useResumeData();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumes")) || [];
    setResumes(stored);
  }, []);

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
      title: "Upload Resume",
      description: "Upload and enhance your existing resume with AI",
      icon: FaUpload,
      link: "/upload",
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

  const recentActivity = [
    {
      action: "Resume Created",
      time: "2 hours ago",
      icon: FaFileAlt,
      color: "text-blue-600",
    },
    {
      action: "ATS Check Completed",
      time: "1 day ago",
      icon: FaStar,
      color: "text-green-600",
    },
    {
      action: "Template Applied",
      time: "3 days ago",
      icon: FaRocket,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 md:px-20 py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-200 opacity-15 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-200 opacity-10 blur-3xl rounded-full z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-4 shadow-lg">
            <FaRocket className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Welcome to your Dashboard</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4 [font-family:'Lilita_One',cursive]">
            Welcome Back! 👋
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {resume?.name 
              ? "Continue building your professional story with ResuMate"
              : "Ready to create your first resume? Let's get started!"
            }
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link to={action.link} className="block">
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className={`relative z-10 w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl text-white flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <action.icon size={24} />
                  </motion.div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Current Resume Status & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Resume Status */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white shadow-lg">
                <FaFileAlt size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Resume Status</h2>
            </div>
            
            {resume?.name ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Resume Ready</h3>
                  <p className="text-green-700 text-sm">
                    Your resume "{resume.name}" is ready to go! You can continue editing or download it.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to="/resume-form"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <FaPen size={14} />
                    Edit Resume
                  </Link>
                  <Link
                    to="/resume"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <FaFileAlt size={14} />
                    View Resume
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Resume Yet</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Get started by creating your first resume or uploading an existing one.
                </p>
                <Link
                  to="/resume-form"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <FaPlus size={16} />
                  Create Resume
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl text-white shadow-lg">
                <FaClock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
                >
                  <div className={`p-2 ${activity.color} bg-white rounded-lg shadow-sm`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
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
    </div>
  );
}
