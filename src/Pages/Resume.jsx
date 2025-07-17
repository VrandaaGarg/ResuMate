// src/Pages/Resume.jsx
import React, { useEffect, useState } from "react";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useClassicSetting } from "../Contexts/ClassicSettingContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { parseResumeFromUpload } from "../utils/ai";
import toast from "react-hot-toast";
import {
  FaUserEdit,
  FaFileAlt,
  FaEdit,
  FaSave,
  FaPalette,
  FaEye,
  FaCog,
  FaDownload,
  FaShare,
} from "react-icons/fa";
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
import { FaLightbulb, FaFont, FaThList } from "react-icons/fa";

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
    {
      value: "classic",
      label: "Classic",
      icon: "📄",
      description: "Traditional and professional",
    },
    {
      value: "sidebar",
      label: "Sidebar",
      icon: "📋",
      description: "Modern sidebar layout",
    },
    {
      value: "standard",
      label: "Standard",
      icon: "📝",
      description: "Clean and minimal",
    },
  ];

  if (!resume?.name || resume.name.trim() === "") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-4 md:px-12 py-10 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl mx-auto text-center"
        >
          <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <FaUserEdit className="text-2xl text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Resume Details Missing
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Please fill in your details to get started with creating your
              professional resume.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/resume-form")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/60 px-4 md:px-12 py-10 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl rounded-full z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 max-w-6xl flex flex-col justify-center items-center mx-auto">
        {/* Enhanced Header - smaller text and spacing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-3 shadow-lg">
            <FaStar className="text-yellow-500 text-xs" />
            <span className="text-[10px] md:text-xs font-medium text-slate-700">
              Resume Builder
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
            Your Professional Resume
          </h1>

          <p className="text-[14px] md:text-sm text-slate-600 max-w-2xl mx-auto">
            Customize and perfect your resume with our intuitive editor
          </p>
        </motion.div>

        {/* Control Panel - more compact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 md:p-5 shadow-xl mb-6"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-9">
            {/* Template Selection */}
            <div className="flex flex-col items-start  gap-3 flex-1">
              <div className="flex gap-1.5">
                <FaPalette className="text-purple-600 text-sm" />
                <label className="text-sm text-left font-semibold text-slate-700">
                  Template:
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <motion.button
                    key={template.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
                      selectedTemplate === template.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-300 shadow-md"
                        : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <span className="text-xs md:text-base">
                      {template.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold  md:text-xs text-[14px]">
                        {template.label}
                      </div>
                      <div
                        className={`md:text-xs text-[14px] ${
                          selectedTemplate === template.value
                            ? "text-white/80"
                            : "text-slate-500"
                        }`}
                      >
                        {template.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex  items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-lg">
                <FaEye
                  className={`text-xs md:text-sm ${
                    isEditable ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                <span className="text-xs md:text-sm font-medium text-slate-700">
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
                className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center gap-1.5 text-[14px] md:text-sm ${
                  isEditable
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                {isEditable ? (
                  <>
                    <FaSave size={12} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FaEdit size={12} />
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
          className="bg-white/60 backdrop-blur-md max-w-2xl border border-white/40 shadow-xl rounded-xl "
        >
          {/* Template Content */}
          <div className="p-4 md:p-6">
            <motion.div
              key={selectedTemplate}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md border border-slate-200/50"
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

        <div className="flex flex-col md:flex-row items-center w-full  md:gap-8 justify-center mt-8">
          <motion.div
            className="bg-yellow-50 border h-full border-yellow-200 rounded-xl px-2 md:px-5 py-2 md:py-4 shadow-md mt-6 mb-4 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex text items-center gap-2 md:mb-2">
              <FaLightbulb className="text-yellow-400 text-lg md:text-xl animate-pulse" />
              <h1 className="text-lg md:text-xl font-bold text-yellow-900">
                Tips
              </h1>
            </div>
            <ul className="space-y-2 text-xs md:text-sm pl-1">
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-2 text-yellow-900"
              >
                <FaLightbulb className="text-yellow-500 mt-1" />
                <span>
                  <strong>For best alignment and editing:</strong> Use your
                  resume editor on a laptop or desktop for better control of
                  layout and visual consistency.
                </span>
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2 text-yellow-900"
              >
                <FaFont className="text-yellow-500 mt-1" />
                <span>
                  <strong>Adjust font size:</strong> Try increasing or
                  decreasing the font size to easily distinguish between
                  sections and improve overall readability.
                </span>
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2 text-yellow-900"
              >
                <FaThList className="text-yellow-500 mt-1 " />
                <span>
                  <strong>Balance your content:</strong> If your sections are
                  looking <b>too long</b>, try to{" "}
                  <span className="font-semibold">
                    summarize or break up details
                  </span>{" "}
                  for clarity. If your sections are <b>too short</b>, consider{" "}
                  <span className="font-semibold">
                    adding achievements, specifics, or a brief explanation
                  </span>
                  to better highlight your strengths.
                </span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6  text-center"
          >
            <div className="flex w-full h-full flex-wrap flex-row md:flex-col justify-center items-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-3 shadow-lg">
              <span className="text-xs md:text-base font-medium text-slate-700">
                Quick Actions:
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/job-fit-analyzer")}
                className="px-3 md:px-3.5 md:w-full py-1.5 md:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs md:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Analyze Job Fit
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/ats-checker")}
                className="px-3 md:px-3.5 py-1.5 md:w-full md:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs md:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Check ATS Score
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/resume-form")}
                className="px-3 md:px-3.5 py-1.5 md:w-full md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs md:text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Edit Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
