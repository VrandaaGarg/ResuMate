// src/Pages/Resume.jsx
import React, { useEffect, useState } from "react";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useClassicSetting } from "../Contexts/ClassicSettingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserEdit, FaFileAlt, FaEdit, FaSave, FaPalette, FaEye, FaCog, FaDownload, FaShare } from "react-icons/fa";
import { useSidebarSetting } from "../Contexts/SidebarSettingContext";
import StandardTemplate from "../Components/Templates/StandardTemplate";
import { useStandardSetting } from "../Contexts/StandardSettingContext";
import { useModernSetting } from "../Contexts/ModernSettingContext";
import {
  editClassicSettings,
  editSidebarSettings,
  editStandardSettings,
  updateResume,
} from "../db/database";
import showSuccessToast from "../Components/showSuccessToast";
import { FaWandMagicSparkles, FaStar } from "react-icons/fa6";

export default function Resume() {
  const navigate = useNavigate();
  const { resume, setResume } = useResumeData();
  const { classicSettings, setClassicSettings } = useClassicSetting();
  const { sidebarSettings, setSidebarSettings } = useSidebarSetting();
  const { standardSettings, setStandardSettings } = useStandardSetting();

  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem("selectedTemplate") || "classic"
  );
  const { isEditable, toggleEditing } = useEditResume();

  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const [sectionOrder, setSectionOrder] = useState([
    "details",
    "description",
    "skills",
    "experience",
    "projects",
    "education",
    "achievements",
  ]);

  const [visibleSections, setVisibleSections] = useState({
    details: true,
    description: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    achievements: true,
  });

  const handleSaveAllChanges = async () => {
    try {
      await Promise.all([
        editClassicSettings(classicSettings),
        editSidebarSettings(sidebarSettings),
        editStandardSettings(standardSettings),
        updateResume(resume),
      ]);
      showSuccessToast("Changes saved successfully!");
    } catch (error) {
      showErrorToast("Failed to save changes.");
      console.error("Error while saving:", error);
    }
  };

  const templates = [
    { value: "classic", label: "Classic", icon: "📄", description: "Traditional and professional" },
    { value: "sidebar", label: "Sidebar", icon: "📋", description: "Modern sidebar layout" },
    { value: "standard", label: "Standard", icon: "📝", description: "Clean and minimal" },
  ];

  if (!resume?.name || resume.name.trim() === "") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-6 md:px-20 py-16 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <FaUserEdit className="text-4xl text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Resume Details Missing
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Please fill in your details to get started with creating your professional resume.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/resume-form")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <FaWandMagicSparkles />
              Create Resume
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-6 md:px-20 py-16 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-6 py-2 mb-4 shadow-lg">
            <FaStar className="text-yellow-500" />
            <span className="text-sm font-medium text-slate-700">Resume Builder</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Your Professional Resume
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Customize and perfect your resume with our intuitive editor
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-6 md:p-8 shadow-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Template Selection */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <FaPalette className="text-purple-600" />
                <label className="text-lg font-semibold text-slate-700">
                  Template:
                </label>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                      selectedTemplate === template.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-300 shadow-lg"
                        : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <span className="text-lg">{template.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{template.label}</div>
                      <div className={`text-xs ${selectedTemplate === template.value ? 'text-white/80' : 'text-slate-500'}`}>
                        {template.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-xl">
                <FaEye className={`${isEditable ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="text-sm font-medium text-slate-700">
                  Mode: {isEditable ? "Edit" : "View"}
                </span>
              </div>
              
              <motion.button
                onClick={() => {
                  if (isEditable) handleSaveAllChanges();
                  toggleEditing();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
                  isEditable
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                {isEditable ? (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Edit Resume
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl overflow-hidden"
        >
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-slate-100/80 to-blue-50/80 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                  <FaFileAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Resume Preview</h3>
                  <p className="text-sm text-slate-600">
                    {resume.name}'s Professional Resume
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-blue-600"
                  title="Download PDF"
                >
                  <FaDownload />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-green-600"
                  title="Share Resume"
                >
                  <FaShare />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-purple-600"
                  title="Settings"
                >
                  <FaCog />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Template Content */}
          <div className="p-6 md:p-8">
            <motion.div
              key={selectedTemplate}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden"
            >
              {selectedTemplate === "sidebar" && (
                <SidebarTemplate
                  resume={resume}
                  onChange={setResume}
                  sectionOrder={sectionOrder}
                  visibleSections={visibleSections}
                  settings={sidebarSettings}
                  onSettingsChange={setSidebarSettings}
                />
              )}

              {selectedTemplate === "classic" && (
                <ClassicTemplate
                  resume={resume}
                  onChange={setResume}
                  sectionOrder={sectionOrder}
                  visibleSections={visibleSections}
                  settings={classicSettings}
                  onSettingsChange={setClassicSettings}
                />
              )}

              {selectedTemplate === "standard" && (
                <StandardTemplate
                  resume={resume}
                  onChange={setResume}
                  sectionOrder={sectionOrder}
                  visibleSections={visibleSections}
                  settings={standardSettings}
                  onSettingsChange={setStandardSettings}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-lg">
            <span className="text-sm font-medium text-slate-700">Quick Actions:</span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/job-fit-analyzer")}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Analyze Job Fit
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ats-checker")}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Check ATS Score
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/resume-form")}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Edit Details
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
