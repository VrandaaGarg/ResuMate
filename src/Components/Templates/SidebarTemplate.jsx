// src/Components/Templates/SidebarTemplate.jsx
import React, { useState, useEffect } from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import {
  MdOutlineColorize,
  MdOutlineMailOutline,
  MdOutlineColorLens,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdOutlineFormatColorFill,
  MdOutlineTextIncrease,
  MdOutlineTextDecrease,
  MdFormatColorText,
} from "react-icons/md";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import {
  FaGithub,
  FaLinkedinIn,
  FaEye,
  FaFillDrip,
  FaEyeSlash,
  FaFont,
  FaLink,
} from "react-icons/fa6";
import { RiFontColor } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { IoReorderThreeSharp } from "react-icons/io5";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SidebarTemplate = ({ resume, onChange }) => {
  const { isEditable } = useEditResume();
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(pointerSensor);
  const [openDropdown, setOpenDropdown] = useState(null); // values: "toggle", "font", "reorder", etc.
  const sidebarSections = ["name", "details", "description", "skills"];
  const mainSections = ["experience", "projects", "education", "achievements"];
  fontScaleLevel: 0; // default level (0), can be -1, 0, +1, +2

  const getScaledFontClass = (base, level) => {
    const sizes = [
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl",
      "text-5xl",
      "text-6xl",
    ];

    const baseIndex = sizes.indexOf(base);
    const newIndex = Math.min(sizes.length - 1, Math.max(0, baseIndex + level));

    return sizes[newIndex];
  };

  const defaultTextColor = (tag) => {
    switch (tag) {
      case "h1":
        return "white";
      case "h2":
        return "text-blue-300";
      case "h3":
        return "text-blue-200";
      case "h4":
        return "text-gray-300";
      default:
        return "#000000";
    }
  };

  const defaultMainTextColor = (tag) => {
    switch (tag) {
      case "h1":
        return "#1e293b"; // dark slate
      case "h2":
        return "#334155"; // slightly lighter
      case "h3":
        return "#475569"; // even lighter
      default:
        return "#000000";
    }
  };

  useEffect(() => {
    if (!resume.sectionOrder || !Array.isArray(resume.sectionOrder)) {
      onChange((prev) => ({
        ...prev,
        sectionOrder: [
          "name",
          "details",
          "description",
          "skills",
          "experience",
          "projects",
          "education",
          "achievements",
        ],
      }));
    }
  }, [resume.sectionOrder, onChange]);

  useEffect(() => {
    if (!resume.visibleSections) {
      onChange((prev) => ({
        ...prev,
        visibleSections: {
          name: true,
          details: true,
          description: true,
          skills: true,
          experience: true,
          projects: true,
          education: true,
          achievements: true,
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!resume.skillColors) {
      onChange((prev) => ({
        ...prev,
        skillColors: {},
      }));
    }
  }, [resume.skillColors, onChange]);

  const hasAnyProjectLink = resume.projects?.some(
    (proj) => proj.demo || proj.github
  );

  const SortableItem = ({ id }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-2 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs cursor-grab max-w-full"
        title={id}
      >
        <span className="capitalize text-gray-700 truncate max-w-[80%]">
          {id}
        </span>
        <IoReorderThreeSharp className="text-gray-500 flex-shrink-0" />
      </div>
    );
  };

  const sectionMap = {
    name: (
      <div className="text-center">
        <h1
          className={`${getScaledFontClass(
            "text-3xl",
            resume.fontScaleLevel || 0
          )} font-bold bg-transparent w-full text-center outline-none`}
          style={{ color: resume.textColors?.["h1"] || "white" }}
        >
          {resume.name || "Your Name"}
        </h1>
      </div>
    ),
    details: (
      <div className="mr-3.5">
        <h2
          className={`font-semibold uppercase tracking-wide  mb-2 ${getScaledFontClass(
            "text-base",
            resume.fontScaleLevel || 0
          )}`}
          style={{
            color: resume.textColors?.["h2"] || "text-blue-300",
            textAlign: resume.descriptionAlign || "left",
          }}
        >
          Details
        </h2>
        <div
          className={`flex flex-col space-y-2 ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )}`}
          style={{
            color: resume.textColors?.["h3"] || "text-blue-200",
            textAlign: resume.descriptionAlign || "left",
          }}
        >
          {resume.contact.location && (
            <div className="flex items-start  gap-2">
              <CiLocationOn className="flex-shrink-0  mt-1" />
              <p className="bg-transparent outline-none w-full break-words">
                {resume.contact.location}
              </p>
            </div>
          )}

          {resume.contact.phone && (
            <div className="flex items-center ">
              <CiPhone className="mr-2" />
              <p className="bg-transparent outline-none w-full">
                {resume.contact.phone}
              </p>
            </div>
          )}

          {resume.contact.email && (
            <div className="flex items-start  gap-2">
              <MdOutlineMailOutline className="flex-shrink-0 mt-1" />
              <a
                href={`mailto:${resume.contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent outline-none w-full break-words"
              >
                {resume.contact.email}
              </a>
            </div>
          )}

          {resume.contact.linkedin && (
            <div className="flex items-start gap-2">
              <FaLinkedinIn className="flex-shrink-0 text-lg mt-1" />
              <a
                href={`${resume.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent outline-none w-full break-words"
              >
                {resume.contact.linkedin}
              </a>
            </div>
          )}

          {resume.contact.github && (
            <div className="flex items-start  gap-2">
              <FaGithub className="flex-shrink-0 mt-1" />
              <a
                href={`${resume.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent outline-none w-full break-words"
              >
                {resume.contact.github}
              </a>
            </div>
          )}
        </div>
      </div>
    ),

    description: (
      <div>
        {resume.description && (
          <div>
            <h2
              className={`font-semibold uppercase tracking-wide  mb-2 ${getScaledFontClass(
                "text-base",
                resume.fontScaleLevel || 0
              )}`}
              style={{
                color: resume.textColors?.["h2"] || "text-blue-300",
                textAlign: resume.descriptionAlign || "left",
              }}
            >
              Description
            </h2>

            <p
              className={`bg-transparent ${getScaledFontClass(
                "text-sm",
                resume.fontScaleLevel || 0
              )} outline-none w-full whitespace-pre-line`}
              style={{
                textAlign: resume.descriptionAlign || "left",
                color: resume.textColors?.["h3"] || "text-blue-200",
              }}
            >
              {resume.description}
            </p>
          </div>
        )}
      </div>
    ),

    skills: (
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`font-semibold uppercase tracking-wide mb-3 ${getScaledFontClass(
            "text-base",
            resume.fontScaleLevel || 0
          )}`}
          style={{
            color: resume.textColors?.["h2"] || "text-blue-300",
            textAlign: resume.descriptionAlign || "left",
          }}
        >
          Skills Overview
        </h2>

        <div className="space-y-4">
          {resume.skills.map((skill, i) => {
            const totalSkills = resume.skills.reduce(
              (acc, s) => acc + s.languages.length,
              0
            );
            const domainCount = skill.languages.length;
            const percentage = Math.round((domainCount / totalSkills) * 100);

            return (
              <div key={i}>
                <div className="mb-1">
                  <span
                    className={`${getScaledFontClass(
                      "text-sm",
                      resume.fontScaleLevel || 0
                    )} font-medium`}
                    style={{
                      color: resume.textColors?.["h3"] || "text-blue-200",
                      textAlign: resume.descriptionAlign || "left",
                    }}
                  >
                    {skill.domain}
                  </span>
                </div>

                <p
                  className={`${getScaledFontClass(
                    "text-xs",
                    resume.fontScaleLevel || 0
                  )} mt-1`}
                  style={{
                    color: resume.textColors?.["h4"] || "text-blue-200",
                  }}
                >
                  {skill.languages.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        <p
          className={`font-semibold ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )} uppercase tracking-wide  my-3`}
          style={{ color: resume.textColors?.["h2"] || "text-blue-300" }}
        >
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

            const color = resume.skillColors?.[skill.domain] || "#60a5fa";

            return (
              <div
                key={i}
                className={`h-full`}
                style={{ width: `${width}%`, backgroundColor: color }}
                title={`${skill.domain} (${skill.languages.length} skills)`}
              ></div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className={`${getScaledFontClass(
            "text-xs",
            resume.fontScaleLevel || 0
          )} space-y-1`}
        >
          {resume.skills.map((skill, i) => {
            const totalSkills = resume.skills.reduce(
              (acc, s) => acc + s.languages.length,
              0
            );
            const percent = (
              (skill.languages.length / totalSkills) *
              100
            ).toFixed(1);

            const color = resume.skillColors?.[skill.domain] || "#60a5fa";

            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                ></span>
                <span
                  style={{
                    color: resume.textColors?.["h3"] || "text-blue-200",
                  }}
                >
                  {skill.domain}
                </span>
                <span
                  className="ml-auto "
                  style={{
                    color: resume.textColors?.["h4"] || "text-gray-300",
                  }}
                >
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ),

    experience: (
      <section style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-xl",
            resume.fontScaleLevel || 0
          )} font-bold  mb-2`}
          style={{
            color: resume.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          EXPERIENCE
        </h2>
        {resume.experience.map((exp, i) => (
          <div
            key={i}
            className={`mb-4 ${getScaledFontClass(
              "text-sm",
              resume.fontScaleLevel || 0
            )}`}
          >
            <div
              className={`flex gap-6 w-full ${
                resume.descriptionAlign === "center"
                  ? "justify-center"
                  : resume.descriptionAlign === "right"
                  ? "justify-end"
                  : resume.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
                }}
              >
                {exp.company}
              </p>
              <p
                className="italic"
                style={{
                  color:
                    resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
                }}
              >
                {exp.years}
              </p>
            </div>

            <p
              className="mt-1 text-gray-800 whitespace-pre-line"
              style={{
                textAlign: resume.descriptionAlign || "left",
                color:
                  resume.mainTextColors?.["h3"] || defaultMainTextColor("h3"),
              }}
            >
              {exp.description}
            </p>
          </div>
        ))}
      </section>
    ),

    projects: (
      <section style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-xl",
            resume.fontScaleLevel || 0
          )} font-bold  mb-2`}
          style={{
            color: resume.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          PROJECTS
        </h2>

        {resume.projects.map((proj, i) => (
          <div
            key={i}
            className={`mb-4 ${getScaledFontClass(
              "text-sm",
              resume.fontScaleLevel || 0
            )}`}
          >
            <div
              className={`flex gap-6 w-full ${
                resume.descriptionAlign === "center"
                  ? "justify-center"
                  : resume.descriptionAlign === "right"
                  ? "justify-end"
                  : resume.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
                }}
              >
                {proj.name}
              </p>

              <div className="text-sm">
                {(proj.demo || proj.github) && (
                  <span>
                    (
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: resume.linkColor || "#2563eb" }}
                      >
                        Live Demo
                      </a>
                    )}
                    {proj.demo && proj.github && (
                      <span className="mx-1">|</span>
                    )}
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: resume.linkColor || "#2563eb" }}
                      >
                        GitHub
                      </a>
                    )}
                    )
                  </span>
                )}
              </div>
            </div>

            <div
              className={`mt-1 ${getScaledFontClass(
                "text-xs",
                resume.fontScaleLevel || 0
              )} text-gray-700 whitespace-pre-line`}
            >
              {proj.description?.split("\n").map((line, idx) => (
                <p
                  key={idx}
                  className="mb-1"
                  style={{
                    textAlign: resume.descriptionAlign || "left",
                    color:
                      resume.mainTextColors?.["h3"] ||
                      defaultMainTextColor("h3"),
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    ),

    education: (
      <section style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-xl",
            resume.fontScaleLevel || 0
          )} font-bold mb-2`}
          style={{
            color: resume.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          EDUCATION
        </h2>

        <div
          className={`flex gap-6 w-full mb-4 ${
            resume.descriptionAlign === "center"
              ? "justify-center"
              : resume.descriptionAlign === "right"
              ? "justify-end"
              : resume.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          } ${getScaledFontClass("text-sm", resume.fontScaleLevel || 0)}`}
        >
          <p
            className="font-semibold"
            style={{
              color:
                resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
            }}
          >
            {resume.education.college}
          </p>

          <p
            className="italic"
            style={{
              color:
                resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
            }}
          >
            {resume.education.startYear} - {resume.education.endYear}
          </p>
        </div>

        <p
          className={`${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )}`}
          style={{
            color: resume.mainTextColors?.["h3"] || defaultMainTextColor("h3"),
          }}
        >
          CGPA: {resume.education.cgpa}
        </p>
      </section>
    ),

    achievements: (
      <section style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold  mb-2`}
          style={{
            color: resume.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          ACHIEVEMENTS
        </h2>
        <ul
          className={`list-disc ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )} pl-5 space-y-2 text-gray-800`}
        >
          {resume.achievements.map((ach, i) => (
            <li
              key={i}
              style={{
                textAlign: resume.descriptionAlign || "left",
                color:
                  resume.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
              }}
            >
              <strong>{ach.title}</strong> – {ach.description}
            </li>
          ))}
        </ul>
      </section>
    ),
  };

  return (
    <div className="">
      {/* Toolbar */}
      {isEditable && (
        <div className="w-full bg-white  justify-center border border-gray-200 shadow-sm rounded-md px-6 py-3 mb-6 flex flex-wrap items-center gap-3">
          {/* Background Color Picker */}
          <div className="relative">
            {/* Icon trigger */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={` Background Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "mainColor" ? null : "mainColor"
                )
              }
            >
              <FaFillDrip className="text-xl text-gray-700" />
              <span
                className="absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: resume.bgColor || "#ffffff" }}
              ></span>
            </button>

            {/* Picker panel */}
            {openDropdown === "mainColor" && (
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

          {/* Sidebar section color */}
          <div className="relative">
            {/* Color Icon Button */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={`Sidebar Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "sidebarColor" ? null : "sidebarColor"
                )
              }
            >
              <MdOutlineColorize className="text-xl text-gray-700" />
              <span
                className="absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: resume.sidebarColor || "#1e3a8a" }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "sidebarColor" && (
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

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1">
            <button
              title="Decrease Font Size"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.max(-2, (prev.fontScaleLevel || 0) - 1),
                }))
              }
              className="p-2 rounded hover:bg-gray-200"
            >
              <span className="text-xl">
                <MdOutlineTextDecrease />
              </span>
            </button>

            <button
              title="Increase Font Size"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.min(3, (prev.fontScaleLevel || 0) + 1),
                }))
              }
              className="p-2 rounded hover:bg-gray-200"
            >
              <span className="text-xl">
                <MdOutlineTextIncrease />
              </span>
            </button>
          </div>

          {/* Skill Color Picker */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "skillColor" ? null : "skillColor"
                  )
                }
                className="p-2 rounded-md hover:bg-gray-200 transition group relative"
                title="Customize Skill Colors"
              >
                <MdOutlineFormatColorFill className="text-xl text-gray-700" />
              </button>

              {/* Popover Panel */}
              {openDropdown === "skillColor" && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-max right-0">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Skill Bar Colors
                  </p>

                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {resume.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-xs px-3 py-1 shadow-sm"
                      >
                        <span className="text-gray-700 font-medium">
                          {skill.domain}
                        </span>
                        <label className="relative w-5 h-5 cursor-pointer">
                          <input
                            type="color"
                            value={
                              resume.skillColors?.[skill.domain] || "#60a5fa"
                            }
                            onChange={(e) =>
                              onChange((prev) => ({
                                ...prev,
                                skillColors: {
                                  ...prev.skillColors,
                                  [skill.domain]: e.target.value,
                                },
                              }))
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title={`Set color for ${skill.domain}`}
                          />
                          <div
                            className="w-full h-full rounded-full border"
                            style={{
                              backgroundColor:
                                resume.skillColors?.[skill.domain] || "#60a5fa",
                            }}
                          ></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Font Selector */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "font" ? null : "font"))
              }
              title="Change Font"
              className="p-2 rounded-md hover:bg-gray-100  transition"
            >
              <FaFont className="text-gray-700 text-lg" />
            </button>

            {/* Dropdown Menu */}
            {openDropdown === "font" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-52 right-0">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Select Font
                </p>

                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {[
                    "Inter",
                    "Roboto",
                    "Poppins",
                    "Lato",
                    "Merriweather",
                    "Georgia",
                    "Courier New",
                  ].map((font) => (
                    <button
                      key={font}
                      onClick={() => {
                        onChange((prev) => ({ ...prev, fontFamily: font }));
                        setOpenDropdown(false);
                      }}
                      className={`text-sm text-left px-3 py-1 rounded hover:bg-gray-100 transition ${
                        resume.fontFamily === font
                          ? "bg-sky-50 text-sky-700 font-medium"
                          : "text-gray-700"
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Link Color Button */}
          {hasAnyProjectLink && (
            <div className="relative">
              {/* Trigger Button */}
              <button
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "linkColor" ? null : "linkColor"
                  )
                }
                className="p-2 rounded-md hover:bg-gray-100 transition"
                title="Change Project Link Color"
              >
                <FaLink className="text-lg text-gray-700" />
              </button>

              {/* Picker Panel */}
              {openDropdown === "linkColor" && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md px-4 py-3 z-50 w-52">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Project Link Color
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Fully-filled circular color picker */}
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border cursor-pointer group">
                      <div
                        className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                        style={{
                          backgroundColor: resume.linkColor || "#2563eb",
                        }}
                      ></div>
                      <input
                        type="color"
                        value={resume.linkColor || "#2563eb"}
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            linkColor: e.target.value,
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title="Pick link color"
                      />
                    </div>

                    {/* Hex color display */}
                    <span className="text-xs text-gray-600 font-mono">
                      {resume.linkColor?.toUpperCase() || "#2563EB"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Color Picker Button for sidebar */}
          <div className="relative group">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Sidebar Text Color"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "textSidebar" ? null : "textSidebar"
                )
              }
            >
              <RiFontColor className="text-lg text-gray-700" />
            </button>

            {/* Color Panel */}
            {openDropdown === "textSidebar" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-0">
                {/* <p className="text-xs font-medium text-gray-600 mb-2">
                  Heading & Text Colors
                </p> */}

                {["h1", "h2", "h3", "h4"].map((tag) => (
                  <div key={tag} className="flex items-center gap-3 mb-2">
                    <span className="uppercase text-xs w-5">{tag}</span>

                    <div className="relative w-5 h-5 rounded-full overflow-hidden border cursor-pointer group">
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor:
                            resume.textColors?.[tag] || defaultTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          resume.textColors?.[tag] || defaultTextColor(tag)
                        }
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            textColors: {
                              ...prev.textColors,
                              [tag]: e.target.value,
                            },
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title={`Change ${tag.toUpperCase()} color`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mainbar Text Color Picker */}
          <div className="relative group">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Mainbar Text Color"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "mainTextColor" ? null : "mainTextColor"
                )
              }
            >
              <MdFormatColorText className="text-lg text-gray-700" />
            </button>

            {openDropdown === "mainTextColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-0">
                {/* <p className="text-xs font-medium text-gray-600 mb-2">
                  Mainbar Text Colors
                </p> */}

                {["h1", "h2", "h3"].map((tag) => (
                  <div key={tag} className="flex items-center gap-3 mb-2">
                    <span className="uppercase text-xs w-5">{tag}</span>

                    <div className="relative w-5 h-5 rounded-full overflow-hidden border cursor-pointer group">
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor:
                            resume.mainTextColors?.[tag] ||
                            defaultMainTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          resume.mainTextColors?.[tag] ||
                          defaultMainTextColor(tag)
                        }
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            mainTextColors: {
                              ...prev.mainTextColors,
                              [tag]: e.target.value,
                            },
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title={`Change ${tag.toUpperCase()} color`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Show/Hide Sections Button */}
          <div className="relative">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Show/Hide Sections"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "toggleSection" ? null : "toggleSection"
                )
              }
            >
              <BiShowAlt className="text-xl text-gray-700" />
            </button>

            {openDropdown === "toggleSection" && (
              <div className="absolute right-0 mt-2 z-50 w-72 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaEye className="text-blue-600" />
                    Show/Hide Sections
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(resume.visibleSections).map((key) => {
                      const isVisible = resume.visibleSections[key];
                      return (
                        <button
                          key={key}
                          onClick={() =>
                            onChange((prev) => ({
                              ...prev,
                              visibleSections: {
                                ...prev.visibleSections,
                                [key]: !isVisible,
                              },
                            }))
                          }
                          className={`flex items-center justify-between px-3 py-1.5 rounded-md border text-xs capitalize transition-all ${
                            isVisible
                              ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate w-24">{key}</span>
                          {isVisible ? (
                            <FaEye className="text-blue-500 text-sm shrink-0" />
                          ) : (
                            <FaEyeSlash className="text-gray-400 text-sm shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reorder Sections Button */}
          <div className="relative">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Reorder Sections"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "reorder" ? null : "reorder"
                )
              }
            >
              <IoReorderThreeSharp className="text-xl text-gray-700" />
            </button>

            {openDropdown === "reorder" && (
              <div className="absolute right-0 mt-2 z-50 w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <IoReorderThreeSharp className="text-blue-600" />
                    Reorder Sections
                  </h3>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={({ active, over }) => {
                      if (!over || active.id === over.id) return;

                      const oldIndex = resume.sectionOrder.indexOf(active.id);
                      const newIndex = resume.sectionOrder.indexOf(over.id);

                      const isSidebar = sidebarSections.includes(active.id);
                      const overIsSidebar = sidebarSections.includes(over.id);
                      const isMain = mainSections.includes(active.id);
                      const overIsMain = mainSections.includes(over.id);

                      if (
                        (isSidebar && overIsSidebar) ||
                        (isMain && overIsMain)
                      ) {
                        const newOrder = arrayMove(
                          resume.sectionOrder,
                          oldIndex,
                          newIndex
                        );
                        onChange((prev) => ({
                          ...prev,
                          sectionOrder: newOrder,
                        }));
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {/* Sidebar Sections */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">
                          Sidebar
                        </p>
                        <SortableContext
                          items={(resume.sectionOrder || []).filter((id) =>
                            sidebarSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5 ">
                            {resume.sectionOrder
                              .filter((id) => sidebarSections.includes(id))
                              .map((id) => (
                                <SortableItem key={id} id={id} />
                              ))}
                          </div>
                        </SortableContext>
                      </div>

                      {/* Main Sections */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">
                          Main
                        </p>
                        <SortableContext
                          items={(resume.sectionOrder || []).filter((id) =>
                            mainSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5">
                            {resume.sectionOrder
                              .filter((id) => mainSections.includes(id))
                              .map((id) => (
                                <SortableItem key={id} id={id} />
                              ))}
                          </div>
                        </SortableContext>
                      </div>
                    </div>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resume Preview */}
      <div
        className="min-h-screen border border-gray-400 p-4 flex"
        style={{
          backgroundColor: resume.bgColor || "#ffffff",
          fontFamily: resume.fontFamily || "Inter",
        }}
      >
        {/* Sidebar */}
        <aside
          className="w-1/3 text-white p-6 space-y-6"
          style={{ backgroundColor: resume.sidebarColor || "#1e3a8a" }}
        >
          {(resume.sectionOrder || [])
            .filter(
              (key) =>
                resume.visibleSections?.[key] && sidebarSections.includes(key)
            )
            .map((key) => (
              <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
            ))}
        </aside>

        {/* Mainbar */}
        <main className="w-2/3 p-8 space-y-6">
          {(resume.sectionOrder || [])
            .filter(
              (key) =>
                resume.visibleSections?.[key] && mainSections.includes(key)
            )
            .map((key) => (
              <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
            ))}
        </main>
      </div>
    </div>
  );
};

export default SidebarTemplate;
