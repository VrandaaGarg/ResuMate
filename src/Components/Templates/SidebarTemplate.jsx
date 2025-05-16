// src/Components/Templates/SidebarTemplate.jsx
import React, { useState } from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { FaPhone } from "react-icons/fa6";
import { MdEmail, MdOutlineMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { MdOutlineColorize } from "react-icons/md";
import { MdOutlineColorLens } from "react-icons/md";

import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";
import { title } from "framer-motion/m";

const SidebarTemplate = ({ resume, onChange }) => {
  const defaultColor = resume.sidebarColor || "#1e3a8a";
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  // fallback to bg-blue-900

  const { isEditable } = useEditResume();

  const handleChange = (section, key, value) => {
    onChange((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleRootChange = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (section, index, key, value) => {
    const updated = [...resume[section]];
    updated[index][key] = value;
    onChange((prev) => ({ ...prev, [section]: updated }));
  };

  const renderInput = (type, value, onChange, className = "", props = {}) =>
    isEditable ? (
      type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          className={className}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={className}
          {...props}
        />
      )
    ) : (
      <span>{value}</span>
    );

  return (
    <div className="">
      {/* Toolbar */}
      {isEditable && (
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-md px-6 py-3 mb-6 flex flex-wrap items-center gap-6">
          <div className="relative">
            {/* Color Icon Button */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={`Sidebar Color`}
              onClick={() => setShowColorPicker((prev) => !prev)}
            >
              <MdOutlineColorize className="text-xl text-gray-700" />
              <span
                className="absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: resume.sidebarColor || "#1e3a8a" }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {showColorPicker && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-1/2">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Sidebar Color
                </p>

                <div className="flex items-center gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-2">
                    {[
                      "#1e3a8a",
                      "#0f766e",
                      "#7c3aed",
                      "#f59e0b",
                      "#dc2626",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`w-6 h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === resume.sidebarColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          onChange((prev) => ({ ...prev, sidebarColor: clr }))
                        }
                        title={clr}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300" />

                  {/* Custom Color Picker (Right) */}
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border cursor-pointer group">
                    {/* Colored background + icon (underneath) */}
                    <div
                      className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: resume.sidebarColor || "#1e3a8a",
                      }}
                    >
                      <MdOutlineColorize className="text-white/30 text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    {/* Color input (on top but invisible) */}
                    <input
                      type="color"
                      value={resume.sidebarColor || "#1e3a8a"}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          sidebarColor: e.target.value,
                        }))
                      }
                      className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                      title="Pick custom color"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description Alignment */}

          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
              {[
                {
                  icon: <MdFormatAlignLeft />,
                  value: "left",
                  title: "Align left",
                },
                {
                  icon: <MdFormatAlignCenter />,
                  value: "center",
                  title: "Align center",
                },
                {
                  icon: <MdFormatAlignRight />,
                  value: "right",
                  title: "Align right",
                },
                {
                  icon: <MdFormatAlignJustify />,
                  value: "justify",
                  title: "Align justify",
                },
              ].map(({ icon, value }) => (
                <button
                  key={value}
                  onClick={() =>
                    onChange((prev) => ({ ...prev, descriptionAlign: value }))
                  }
                  className={`p-2 rounded-md transition ${
                    resume.descriptionAlign === value
                      ? "bg-white shadow  "
                      : "hover:bg-white/80"
                  }`}
                  title={`Align ${value}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color Picker */}

          <div className="relative">
            {/* Icon trigger */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={` Background Color`}
              onClick={() => setShowBgColorPicker((prev) => !prev)}
            >
              <MdOutlineColorLens className="text-xl text-gray-700" />
              <span
                className="absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: resume.bgColor || "#ffffff" }}
              ></span>
            </button>

            {/* Picker panel */}
            {showBgColorPicker && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-0">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Background Color
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {[
                      "#ffffff",
                      "#f8fafc",
                      "#fef3c7",
                      "#ecfccb",
                      "#f3e8ff",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`w-6 h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === resume.bgColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          onChange((prev) => ({ ...prev, bgColor: clr }))
                        }
                        title={clr}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  <div className="relative w-6 h-6 rounded-full overflow-hidden border cursor-pointer group">
                    {/* Invisible Color Picker */}
                    <input
                      type="color"
                      value={resume.bgColor || "#ffffff"}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          bgColor: e.target.value,
                        }))
                      }
                      className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                      title="Pick custom color"
                    />

                    {/* Visible colored circle with icon */}
                    <div
                      className="absolute inset-0 z-0 rounded-full"
                      style={{ backgroundColor: resume.bgColor || "#ffffff" }}
                    >
                      <MdOutlineColorize className="text-gray-500/50 text-lg drop-shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Placeholder for future features */}
          <div className="ml-auto text-xs text-gray-400 hidden sm:block">
            More customizations coming soon...
          </div>
        </div>
      )}

      <div
        className="min-h-screen border border-gray-400 p-4 flex font-sans"
        style={{ backgroundColor: resume.bgColor || "#ffffff" }}
      >
        {/* Sidebar */}
        <aside
          className="w-1/3 text-white p-6 space-y-6 "
          style={{ backgroundColor: resume.sidebarColor || "#1e3a8a" }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-transparent w-full text-center outline-none">
              {resume.name}
            </h1>
          </div>

          <div className="mr-3.5">
            <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
              Details
            </h2>
            <div className="flex flex-col space-y-1">
              {resume.contact.location && (
                <div className="flex items-start text-sm gap-2">
                  <CiLocationOn className="flex-shrink-0 text-lg mt-1" />
                  <p className="bg-transparent outline-none w-full break-words">
                    {resume.contact.location}
                  </p>
                </div>
              )}

              {resume.contact.phone && (
                <div className="flex items-center text-sm">
                  <CiPhone className="mr-2 text-lg" />
                  <p className="bg-transparent outline-none w-full">
                    {resume.contact.phone}
                  </p>
                </div>
              )}

              {resume.contact.email && (
                <div className="flex items-center text-sm">
                  <MdOutlineMailOutline className="mr-2 text-lg" />
                  <p className="bg-transparent outline-none w-full break-words">
                    {resume.contact.email}
                  </p>
                </div>
              )}

              {resume.contact.linkedin && (
                <div className="flex items-start text-sm gap-2">
                  <FaLinkedinIn className="flex-shrink-0 text-lg mt-1" />
                  <p className="bg-transparent outline-none w-full break-words">
                    {resume.contact.linkedin}
                  </p>
                </div>
              )}

              {resume.contact.github && (
                <div className="flex items-start text-sm gap-2">
                  <FaGithub className="flex-shrink-0 text-lg mt-1" />
                  <p className="bg-transparent outline-none w-full break-words">
                    {resume.contact.github}
                  </p>
                </div>
              )}
            </div>
          </div>

          {resume.description && (
            <div>
              <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
                Description
              </h2>
              <p
                className="bg-transparent outline-none w-full whitespace-pre-line"
                style={{ textAlign: resume.descriptionAlign || "left" }}
              >
                {resume.description}
              </p>
            </div>
          )}

          <div>
            <h2 className="font-semibold uppercase tracking-wide text-blue-300 mb-3">
              Skills Overview
            </h2>

            <div className="space-y-4">
              {resume.skills.map((skill, i) => {
                const totalSkills = resume.skills.reduce(
                  (acc, s) => acc + s.languages.length,
                  0
                );
                const domainCount = skill.languages.length;
                const percentage = Math.round(
                  (domainCount / totalSkills) * 100
                );

                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-blue-100 font-medium">
                        {skill.domain}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1">
                      {skill.languages.join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="font-semibold text-sm uppercase tracking-wide text-blue-300 my-3">
              Skills Distribution
            </p>

            {/* Segmented Bar */}
            <div className="flex w-full h-2 rounded-4xl overflow-hidden bg-white/10 mb-2">
              {resume.skills.map((skill, i) => {
                const totalSkills = resume.skills.reduce(
                  (acc, s) => acc + s.languages.length,
                  0
                );
                const width = (skill.languages.length / totalSkills) * 100;

                const colors = [
                  "bg-blue-400",
                  "bg-green-400",
                  "bg-yellow-400",
                  "bg-pink-400",
                  "bg-purple-400",
                  "bg-red-400",
                ];
                const color = colors[i % colors.length];

                return (
                  <div
                    key={i}
                    className={`${color} h-full`}
                    style={{ width: `${width}%` }}
                    title={`${skill.domain} (${skill.languages.length} skills)`}
                  ></div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-300 space-y-1">
              {resume.skills.map((skill, i) => {
                const totalSkills = resume.skills.reduce(
                  (acc, s) => acc + s.languages.length,
                  0
                );
                const percent = (
                  (skill.languages.length / totalSkills) *
                  100
                ).toFixed(1);

                const colors = [
                  "bg-blue-400",
                  "bg-green-400",
                  "bg-yellow-400",
                  "bg-pink-400",
                  "bg-purple-400",
                  "bg-red-400",
                ];
                const color = colors[i % colors.length];

                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm ${color}`}></span>
                    <span className="text-white">{skill.domain}</span>
                    <span className="ml-auto text-gray-400">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div>
          <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
            Informations
          </h2>
          <p>Languages: English, Hindi</p>
          <p>License: Valid</p>
        </div> */}

          {/* <div>
          <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
            Hobbies
          </h2>
          <p>Reading, Music, Travel</p>
        </div> */}
        </aside>

        {/* Main Section */}
        <main className="w-2/3 p-8 space-y-6">
          {/* Experience */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              Professional Experience
            </h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between">
                  <p className="font-semibold">{exp.company}</p>
                  <p className="italic">{exp.years}</p>
                </div>
                <p className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-2">Projects</h2>

            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                {/* Project Name */}
                <p className="font-semibold">{proj.name}</p>

                {/* Links */}
                <div className="text-blue-600 text-sm space-x-3">
                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Demo
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
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                  {proj.description?.split("\n").map((line, idx) => (
                    <p key={idx} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-2">Education</h2>

            <p className="font-semibold">{resume.education.college}</p>

            <p className="italic">
              {resume.education.startYear} - {resume.education.endYear}
            </p>

            <p>CGPA: {resume.education.cgpa}</p>
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              Achievements
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-800">
              {resume.achievements.map((ach, i) => (
                <li key={i}>
                  <strong>{ach.title}</strong> – {ach.description}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SidebarTemplate;
