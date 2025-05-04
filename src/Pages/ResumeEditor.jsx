import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ClassicTemplate from "../Components/Templates/ClassicTemplate";
import SidebarTemplate from "../Components/Templates/SidebarTemplate";
import { useEditResume } from "../Contexts/EditResumeContext";
import generatePDF from "react-to-pdf"; // modern version

export default function ResumeEditor() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const { isEditable, toggleEditing } = useEditResume();
  const resumeRef = useRef();

  // Load from localStorage
  useEffect(() => {
    const allResumes = JSON.parse(localStorage.getItem("resumes")) || {};
    const selectedResume = allResumes[resumeId];
    if (selectedResume) setResume(selectedResume);
  }, [resumeId]);

  // Save to localStorage on resume change
  useEffect(() => {
    if (resume) {
      const allResumes = JSON.parse(localStorage.getItem("resumes")) || {};
      allResumes[resumeId] = resume;
      localStorage.setItem("resumes", JSON.stringify(allResumes));
    }
  }, [resume, resumeId]);

  const handlePDFDownload = () => {
    generatePDF(resumeRef, {
      filename: `${resume?.name || "resume"}.pdf`,
      scale: 0.8,
    });
  };

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
            <h1 className="text-2xl font-bold text-sky-800">Resume Editor</h1>
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
        <div ref={resumeRef} className="bg-white shadow p-6 rounded-lg">
          {selectedTemplate === "classic" && (
            <ClassicTemplate resume={resume} onChange={setResume} />
          )}
          {selectedTemplate === "sidebar" && (
            <SidebarTemplate resume={resume} onChange={setResume} />
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handlePDFDownload}
          className="px-4 py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 text-white font-medium transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
