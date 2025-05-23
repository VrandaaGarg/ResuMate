// src/Pages/Resume.jsx
import React, { useEffect, useState } from "react";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useClassicSetting } from "../Contexts/ClassicSettingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";
import { useSidebarSetting } from "../Contexts/SidebarSettingContext";
import StandardTemplate from "../Components/Templates/StandardTemplate";
import { useStandardSetting } from "../Contexts/StandardSettingContext";
import { useModernSetting } from "../Contexts/ModernSettingContext";
// import ModernTemplate from "../Components/Templates/ModernTemplate";
import {
  editClassicSettings,
  editSidebarSettings,
  editStandardSettings,
  updateResume,
} from "../config/database";
import showSuccessToast from "../Components/showSuccessToast";

export default function Resume() {
  const navigate = useNavigate();
  const { resume, setResume } = useResumeData();
  const { classicSettings, setClassicSettings } = useClassicSetting();
  const { sidebarSettings, setSidebarSettings } = useSidebarSetting();
  const { standardSettings, setStandardSettings } = useStandardSetting();
  // const { modernSettings, setModernSettings } = useModernSetting();

  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem("selectedTemplate") || "classic"
  );
  const { isEditable, toggleEditing } = useEditResume();

  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  // Load from localStorage

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
      // Save all settings
      await Promise.all([
        showSuccessToast("Changes saved successfully!"),
        editClassicSettings(classicSettings),
        editSidebarSettings(sidebarSettings),
        editStandardSettings(standardSettings),
        // editModernSettings(modernSettings),
        updateResume(resume),
      ]);
    } catch (error) {
      toast.error("Failed to save changes.");
      console.error("Error while saving:", error);
    }
  };

  if (!resume?.name || resume.name.trim() === "") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6  bg-gradient-to-br from-white via-sky-50 to-white"
      >
        <FaUserEdit className="text-5xl text-sky-700 mb-4 animate-pulse" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Resume details missing
        </h2>
        <p className="text-gray-600 mb-6">
          Please fill in your details to get started with your resume.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/resume-form")}
          className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
        >
          Add Details
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className=" p-2.5 md:p-6 bg-gradient-to-br from-white via-sky-50 to-white   ">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-sm md:text-2xl font-bold text-sky-800">
              Your Resume
            </h1>
            <p className="text-sm text-gray-500">
              Mode: {isEditable ? "Edit" : "View"}
            </p>
          </div>

          <div className="flex gap-2.5">
            <div className="flex flex-col md:flex-row items-center gap-1  md:gap-3">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Template:
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm"
              >
                <option value="classic">Classic</option>
                <option value="sidebar">Sidebar</option>
                <option value="standard">Standard</option>
                {/* <option value="modern">Modern</option> */}
              </select>
            </div>
            <div className="">
              <button
                onClick={() => {
                  if (isEditable) handleSaveAllChanges(); // Only save if exiting edit mode
                  toggleEditing();
                }}
                className="px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
              >
                {isEditable ? "Save Changes" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white shadow p-2.5 md:p-6 rounded-lg relative">
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

          {/* {selectedTemplate === "modern" && (
            <ModernTemplate
              resume={resume}
              onChange={setResume}
              sectionOrder={sectionOrder}
              visibleSections={visibleSections}
              settings={modernSettings}
              onSettingsChange={setModernSettings}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
