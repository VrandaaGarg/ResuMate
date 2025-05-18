// src/Components/Templates/ClassicTemplate.jsx
import React from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { details } from "framer-motion/client";

const ClassicTemplate = ({ resume, onChange }) => {
  const { isEditable } = useEditResume();
  if (!resume) return null;

  // Helpers
  const updateField = (section, key, value) =>
    onChange((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));

  const updateRoot = (key, value) =>
    onChange((prev) => ({ ...prev, [key]: value }));

  const updateArray = (section, index, key, value) => {
    const updated = [...resume[section]];
    updated[index][key] = value;
    onChange((prev) => ({ ...prev, [section]: updated }));
  };

  const renderInput = (type, value, onChange, className, extra = {}) =>
    isEditable ? (
      type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          className={className}
          {...extra}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={className}
          {...extra}
        />
      )
    ) : (
      <span>{value}</span>
    );

  resume.sectionOrder = [
    "name",
    "details",
    "description",
    "education",
    "skills",
    "projects",
    "experience",
    "achievements",
  ];

  resume.visibleSections = {
    name: true,
    details: true,
    description: true,
    education: true,
    skills: true,
    projects: true,
    experience: true,
    achievements: true,
  };

  const sectionMap = {
    name: (
      <div className="text-center">
        <h1 className="text-4xl font-bold w-full inline-block">
          {resume.name}
        </h1>
      </div>
    ),
    details: (
      <div className="text-center space-y-1">
        {/* Contact Line */}
        <p className="text-sm text-gray-700">
          {[
            resume.contact.phone,
            resume.contact.email && (
              <a
                href={`mailto:${resume.contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {resume.contact.email}
              </a>
            ),
            resume.contact.location && (
              <span className="text-blue-600">{resume.contact.location}</span>
            ),
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i}>
                {item}
                {i < arr.length - 1 && " | "}
              </span>
            ))}
        </p>

        {/* Links */}
        <div className="text-sm text-blue-600 space-x-1">
          {resume.contact.github && (
            <>
              <a
                href={resume.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {resume.contact.github}
              </a>
              {resume.contact.linkedin && <span>|</span>}
            </>
          )}
          {resume.contact.linkedin && (
            <a
              href={resume.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {resume.contact.linkedin}
            </a>
          )}
        </div>
      </div>
    ),

    description: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">PROFILE</h2>
        <p className="text-gray-700">{resume.description}</p>
      </div>
    ),

    education: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">EDUCATION</h2>
        <p className="font-semibold">{resume.education.college}</p>
        <p className="italic">
          {resume.education.startYear} – {resume.education.endYear} —{" "}
          {resume.education.cgpa} CGPA
        </p>
      </div>
    ),

    skills: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">SKILLS</h2>
        {resume.skills.map((skill, i) => (
          <div key={i}>
            <span className="font-semibold">{skill.domain}:</span>{" "}
            <span>{skill.languages.join(", ")}</span>
          </div>
        ))}
      </div>
    ),

    projects: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">PROJECTS</h2>
        {resume.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between">
              <span className="font-bold">{proj.name}</span>
              <span className="italic">
                {proj.month} {proj.year}
              </span>
            </div>

            {/* Project Links */}
            <div className="text-sm text-blue-600 space-x-2">
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Live Demo
                </a>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub
                </a>
              )}
            </div>

            {/* Description */}
            <p className="mt-1 text-gray-700">{proj.description}</p>
          </div>
        ))}
      </div>
    ),

    experience: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">EXPERIENCE</h2>
        <ul className="list-disc pl-5 space-y-2">
          {resume.experience.map((a, i) => (
            <li key={i}>
              <div className="flex justify-between">
                <span className="font-semibold">{a.company}</span>
                <span className="italic">{a.years}</span>
              </div>
              <p className="text-gray-700">{a.description}</p>
            </li>
          ))}
        </ul>
      </div>
    ),

    achievements: (
      <div>
        <h2 className="text-lg font-bold text-gray-800">ACHIEVEMENTS</h2>
        <ul className="list-disc pl-5 space-y-2">
          {resume.achievements.map((a, i) => (
            <li key={i}>
              <span className="font-semibold">{a.title}</span> —{" "}
              <span className="text-gray-700">{a.description}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto font-sans text-sm leading-relaxed space-y-5">
      {/* Dynamically rendered sections */}
      {resume.sectionOrder.map(
        (sectionKey) =>
          resume.visibleSections[sectionKey] && sectionMap[sectionKey]
      )}
    </div>
  );
};

export default ClassicTemplate;
