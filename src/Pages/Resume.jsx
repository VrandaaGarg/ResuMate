// src/Pages/Resume.jsx
import React, { useEffect, useState } from "react";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import { useResumeData } from "../Contexts/ResumeDataContext";
import { useClassicSetting } from "../Contexts/ClassicSettingContext";
import { useSidebarSetting } from "../Contexts/SidebarSettingContext";

export default function Resume() {
  const { resume, setResume } = useResumeData();
  const { classicSettings, setClassicSettings } = useClassicSetting();
  const { sidebarSettings, setSidebarSettings } = useSidebarSetting();

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

  if (!resume) {
    return (
      <div className="p-6 text-center text-gray-500">Loading resume...</div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-sky-800">Your Resume</h1>
            <p className="text-sm text-gray-500">
              Mode: {isEditable ? "Edit" : "View"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Template:
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="classic">Classic</option>
              <option value="sidebar">Sidebar</option>
            </select>

            <button
              onClick={toggleEditing}
              className="px-4 py-1.5 text-sm rounded bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
            >
              {isEditable ? "Disable Edit" : "Edit"}
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white shadow p-6 rounded-lg relative">
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
        </div>
      </div>
    </div>
  );
}
