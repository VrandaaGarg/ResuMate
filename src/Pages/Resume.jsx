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
    <div className="min-h-screen p-2.5 md:p-6 bg-gray-100">
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
              </select>
            </div>
            <div className="">
              <button
                onClick={toggleEditing}
                className="px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
              >
                {isEditable ? "Disable Edit" : "Edit"}
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
        </div>
      </div>
    </div>
  );
}
