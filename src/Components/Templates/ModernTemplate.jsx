// src/Components/Templates/ModernTemplate.jsx
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CgSpaceBetweenV } from "react-icons/cg";
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
  TouchSensor,
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
import DOMPurify from "dompurify";

const ModernTemplate = ({ resume, settings, onSettingsChange }) => {
  const { isEditable } = useEditResume();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

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

  const pixelSizes = [
    4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128,
  ];

  const getCustomFontClass = (basePx, level = 0) => {
    const base = parseInt(basePx.replace(/\D/g, ""), 10);
    const index = pixelSizes.indexOf(base);
    if (index === -1) return `text-[${base}px]`; // fallback
    const newIndex = Math.max(
      0,
      Math.min(pixelSizes.length - 1, index + level)
    );
    return `text-[${pixelSizes[newIndex]}px]`;
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
    if (!settings.sectionOrder || !Array.isArray(settings.sectionOrder)) {
      onSettingsChange((prev) => ({
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
  }, [settings.sectionOrder, onSettingsChange]);

  useEffect(() => {
    if (!settings.visibleSections) {
      onSettingsChange((prev) => ({
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
    if (!settings.skillColors) {
      onSettingsChange((prev) => ({
        ...prev,
        skillColors: {},
      }));
    }
  }, [settings.skillColors, onSettingsChange]);

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
        {...attributes}
        {...listeners}
        style={style}
        title={id}
        className="flex items-center overflow-y-hidden justify-between px-1 md:px-2 py-0.5 md:py-2 bg-gray-50 border border-gray-200 rounded-xs md:rounded-md text-[10px] md:text-xs cursor-grab touch-none hover:bg-gray-100 transition"
      >
        <span className="capitalize text-gray-700 truncate w-full max-w-[85%] break-words">
          {id.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
        </span>
        <IoReorderThreeSharp className="text-gray-500 flex-shrink-0 ml-2" />
      </div>
    );
  };

  const sectionMap = {
    name: (
      <div className="text-center">
        <h1
          className={`${getCustomFontClass(
            "text-[48px]",
            settings.fontScaleLevel
          )} font-bold bg-transparent w-full text-center outline-none`}
          style={{ color: settings.textColors?.["h1"] || "white" }}
        >
          {resume.name || "Your Name"}
        </h1>
      </div>
    ),
    details: (
      <div className="">
        <h2
          className={`font-semibold uppercase tracking-wide mb-1  md:mb-2 ${getCustomFontClass(
            "text-24px]",
            settings.fontScaleLevel
          )}`}
          style={{
            color: settings.textColors?.["h2"] || "text-blue-300",
            textAlign: settings.descriptionAlign || "left",
          }}
        >
          Details
        </h2>
        <div
          className={`flex break-words whitespace-normal flex-col space-y-0.5 md:space-y-2 ${getCustomFontClass(
            "text-[18px]",
            settings.fontScaleLevel
          )}`}
          style={{
            color: settings.textColors?.["h3"] || "text-blue-200",
            textAlign: settings.descriptionAlign || "left",
          }}
        >
          {resume.contact.location && (
            <div className="flex items-start  gap-2">
              <CiLocationOn className="flex-shrink-0  mt-1" />
              <p className="bg-transparent outline-none w-full break-all">
                {resume.contact.location}
              </p>
            </div>
          )}

          {resume.contact.phone && (
            <div className="flex items-start  gap-2 ">
              <CiPhone className="flex-shrink-0  mt-1" />
              <p className="bg-transparent outline-none w-full break-all">
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
                className="bg-transparent outline-none w-full break-all"
              >
                {resume.contact.email}
              </a>
            </div>
          )}

          {resume.contact.linkedin && (
            <div className="flex items-start gap-2">
              <FaLinkedinIn className="flex-shrink-0  mt-1" />
              <a
                href={`${resume.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent outline-none w-full break-all"
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
                className="bg-transparent outline-none w-full break-all"
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
              className={`font-semibold break-all uppercase tracking-wide mb-1 md:mb-2 ${getCustomFontClass(
                "text-[24px]",
                settings.fontScaleLevel
              )}`}
              style={{
                color: settings.textColors?.["h2"] || "text-blue-300",
                textAlign: settings.descriptionAlign || "left",
              }}
            >
              Description
            </h2>

            <div
              className={`bg-transparent resume-content ${getCustomFontClass(
                "text-[18px]",
                settings.fontScaleLevel
              )} outline-none w-full whitespace-pre-line`}
              style={{
                textAlign: settings.descriptionAlign || "left",
                color: settings.textColors?.["h3"] || "text-blue-200",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(resume.description),
              }}
            />
          </div>
        )}
      </div>
    ),

    skills: (
      <div style={{ textAlign: settings.descriptionAlign || "left" }}>
        <h2
          className={`font-semibold  uppercase tracking-wide md:mb-2 ${getCustomFontClass(
            "text-[24px]",
            settings.fontScaleLevel
          )}`}
          style={{
            color: settings.textColors?.["h2"] || "text-blue-300",
            textAlign: settings.descriptionAlign || "left",
          }}
        >
          Skills Overview
        </h2>

        <div className="md:space-y-4">
          {resume.skills.map((skill, i) => {
            const totalSkills = resume.skills.reduce(
              (acc, s) => acc + s.languages.length,
              0
            );
            const domainCount = skill.languages.length;
            const percentage = Math.round((domainCount / totalSkills) * 100);

            return (
              <div key={i}>
                <div className="align-middle">
                  <span
                    className={`${getCustomFontClass(
                      "text-[18px]",
                      settings.fontScaleLevel
                    )} font-medium`}
                    style={{
                      color: settings.textColors?.["h3"] || "text-blue-200",
                      textAlign: settings.descriptionAlign || "left",
                    }}
                  >
                    {skill.domain}
                  </span>
                </div>

                <p
                  className={`${getCustomFontClass(
                    "text-[18px]",
                    settings.fontScaleLevel
                  )}`}
                  style={{
                    color: settings.textColors?.["h4"] || "text-blue-200",
                  }}
                >
                  {skill.languages.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        <p
          className={`font-semibold ${getCustomFontClass(
            "text-[20px]",
            settings.fontScaleLevel
          )} uppercase tracking-wide my-1 md:my-3`}
          style={{ color: settings.textColors?.["h2"] || "text-blue-300" }}
        >
          Skills Distribution
        </p>

        {/* Segmented Bar */}

        <div className="flex w-full h-1 md:h-2 rounded-4xl overflow-hidden bg-white/10 mb-2">
          {resume.skills.map((skill, i) => {
            const totalSkills = resume.skills.reduce(
              (acc, s) => acc + s.languages.length,
              0
            );
            const width = (skill.languages.length / totalSkills) * 100;

            const color = settings.skillColors?.[skill.domain] || "#60a5fa";

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
          className={`${getCustomFontClass(
            "text-[18px]",
            settings.fontScaleLevel
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

            const color = settings.skillColors?.[skill.domain] || "#60a5fa";

            return (
              <div
                key={i}
                className="flex break-all justify-between items-center gap-0.5 md:gap-2"
              >
                <span
                  className="w-2 h-2  md:w-3 md:h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                ></span>
                <span
                  style={{
                    color: settings.textColors?.["h3"] || "text-blue-200",
                  }}
                >
                  {skill.domain}
                </span>
                <span
                  className="ml-auto "
                  style={{
                    color: settings.textColors?.["h4"] || "text-gray-300",
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
      <section style={{ textAlign: settings.descriptionAlign || "left" }}>
        <h2
          className={`${getCustomFontClass(
            "text-[24px]",
            settings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              settings.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          EXPERIENCE
        </h2>
        {resume.experience.map((exp, i) => (
          <div
            key={i}
            className={`mb-4 ${getCustomFontClass(
              "text-[18px]",
              settings.fontScaleLevel
            )}`}
          >
            <div
              className={`flex gap-6 break-all w-full ${
                settings.descriptionAlign === "center"
                  ? "justify-center"
                  : settings.descriptionAlign === "right"
                  ? "justify-end"
                  : settings.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    settings.mainTextColors?.["h2"] ||
                    defaultMainTextColor("h2"),
                }}
              >
                {exp.company}–{exp.role}
              </p>
              <p
                className="italic"
                style={{
                  color:
                    settings.mainTextColors?.["h2"] ||
                    defaultMainTextColor("h2"),
                }}
              >
                {exp.years}
              </p>
            </div>

            {exp.technologies && exp.technologies.trim() !== "" && (
              <p
                className="my-0.5"
                style={{
                  textAlign: settings.descriptionAlign || "left",
                  color:
                    settings.mainTextColors?.["h3"] ||
                    defaultMainTextColor("h3"),
                }}
              >
                <span className="font-bold">Technologies :</span>{" "}
                {exp.technologies}
              </p>
            )}

            <p
              className="resume-content "
              style={{
                textAlign: settings.descriptionAlign || "left",
                color:
                  settings.mainTextColors?.["h3"] || defaultMainTextColor("h3"),
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(exp.description),
              }}
            />
          </div>
        ))}
      </section>
    ),

    projects: (
      <section style={{ textAlign: settings.descriptionAlign || "left" }}>
        <h2
          className={`${getCustomFontClass(
            "text-[24px]",
            settings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              settings.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          PROJECTS
        </h2>

        {resume.projects.map((proj, i) => (
          <div
            key={i}
            className={`mb-4 ${getCustomFontClass(
              "text-[18px]",
              settings.fontScaleLevel
            )}`}
          >
            <div
              className={`flex gap-6 w-full ${
                settings.descriptionAlign === "center"
                  ? "justify-center"
                  : settings.descriptionAlign === "right"
                  ? "justify-end"
                  : settings.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    settings.mainTextColors?.["h2"] ||
                    defaultMainTextColor("h2"),
                }}
              >
                {proj.name}
              </p>

              <div
                className={`break-all ${getCustomFontClass(
                  "text-[18px]",
                  settings.fontScaleLevel
                )}`}
              >
                {(proj.demo || proj.github) && (
                  <span>
                    (
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: settings.linkColor || "#2563eb" }}
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
                        style={{ color: settings.linkColor || "#2563eb" }}
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
              className={`mt-1 ${getCustomFontClass(
                "text-[18px]",
                settings.fontScaleLevel
              )} text-gray-700 whitespace-pre-line`}
            >
              <div
                className="mb-1 resume-content"
                style={{
                  textAlign: settings.descriptionAlign || "left",
                  color:
                    settings.mainTextColors?.["h3"] ||
                    defaultMainTextColor("h3"),
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(proj.description),
                }}
              />
            </div>
          </div>
        ))}
      </section>
    ),

    education: (
      <section style={{ textAlign: settings.descriptionAlign || "left" }}>
        <h2
          className={`${getCustomFontClass(
            "text-[24px]",
            settings.fontScaleLevel
          )} font-bold mb-2`}
          style={{
            color:
              settings.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          EDUCATION
        </h2>

        <div
          className={`flex gap-6 break-all w-full ${
            settings.descriptionAlign === "center"
              ? "justify-center"
              : settings.descriptionAlign === "right"
              ? "justify-end"
              : settings.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          } ${getCustomFontClass("text-[18px]", settings.fontScaleLevel)}`}
        >
          <p
            className="font-semibold"
            style={{
              color:
                settings.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
            }}
          >
            {resume.education.college}
          </p>

          <p
            className="italic"
            style={{
              color:
                settings.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
            }}
          >
            {resume.education.location}
          </p>
        </div>

        <div
          className={`flex break-all gap-6 w-full ${
            settings.descriptionAlign === "center"
              ? "justify-center"
              : settings.descriptionAlign === "right"
              ? "justify-end"
              : settings.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          } ${getCustomFontClass("text-[18px]", settings.fontScaleLevel)}`}
        >
          <p>
            {resume.education.degree}
            {resume.education.specialization &&
              ` (${resume.education.specialization})`}
          </p>

          <p
            className="italic"
            style={{
              color:
                settings.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
            }}
          >
            {resume.education.startYear} - {resume.education.endYear}
          </p>
        </div>

        <p
          className={`${getCustomFontClass(
            "text-[18px]",
            settings.fontScaleLevel
          )}`}
          style={{
            color:
              settings.mainTextColors?.["h3"] || defaultMainTextColor("h3"),
          }}
        >
          CGPA: {resume.education.cgpa}
        </p>
      </section>
    ),

    achievements: (
      <section style={{ textAlign: settings.descriptionAlign || "left" }}>
        <h2
          className={`${getCustomFontClass(
            "text-[24px]",
            settings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              settings.mainTextColors?.["h1"] || defaultMainTextColor("h1"),
          }}
        >
          ACHIEVEMENTS
        </h2>
        <ul
          className={`list-disc ${getCustomFontClass(
            "text-[18px]",
            settings.fontScaleLevel
          )} pl-5 space-y-2 text-gray-800`}
        >
          {resume.achievements.map((ach, i) => (
            <li
              key={i}
              style={{
                textAlign: settings.descriptionAlign || "left",
                color:
                  settings.mainTextColors?.["h2"] || defaultMainTextColor("h2"),
              }}
            >
              <strong>{ach.title}</strong>–
              <span
                className="resume-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(ach.description),
                }}
              />
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
        <div className="w-full bg-white justify-center border border-gray-200 shadow-sm rounded-md px-2.5 md:px-6 py-2.5 md:py-3 mb-2.5 md:mb-6 flex flex-wrap items-center gap-3">
          {/* Background Color Picker */}
          <div className="relative">
            {/* Icon trigger */}
            <button
              className="md:p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={` Background Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "mainColor" ? null : "mainColor"
                )
              }
            >
              <FaFillDrip className="text-sm md:text-xl text-gray-700" />
              <span
                className="absolute hidden md:block w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: settings.bgColor || "#ffffff" }}
              ></span>
            </button>

            {/* Picker panel */}
            {openDropdown === "mainColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit left-0">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Background Color
                </p>

                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex gap-1 md:gap-2">
                    {[
                      "#ffffff",
                      "#f8fafc",
                      "#fef3c7",
                      "#ecfccb",
                      "#f3e8ff",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`h-4 w-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === settings.bgColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          onSettingsChange((prev) => ({
                            ...prev,
                            bgColor: clr,
                          }))
                        }
                        title={clr}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300 mx-2" />

                  <div className="relative h-4 w-4 md:w-6 md:h-6 rounded-full overflow-hidden border cursor-pointer group">
                    {/* Invisible Color Picker */}
                    <input
                      type="color"
                      value={settings.bgColor || "#ffffff"}
                      onChange={(e) =>
                        onSettingsChange((prev) => ({
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
                      style={{ backgroundColor: settings.bgColor || "#ffffff" }}
                    >
                      <MdOutlineColorize className="text-gray-500/50 text-[10px] md:text-lg drop-shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
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
              className="md:p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={`Sidebar Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "sidebarColor" ? null : "sidebarColor"
                )
              }
            >
              <MdOutlineColorize className="text-sm md:text-xl text-gray-700" />
              <span
                className="absolute hidden md:block w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: settings.sidebarColor || "#1e3a8a" }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "sidebarColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                  Sidebar Color
                </p>

                <div className="flex items-center gap-2 md:gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-1 md:gap-2">
                    {[
                      "#1e3a8a",
                      "#0f766e",
                      "#7c3aed",
                      "#f59e0b",
                      "#dc2626",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`h-4 w-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === settings.sidebarColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          onSettingsChange((prev) => ({
                            ...prev,
                            sidebarColor: clr,
                          }))
                        }
                        title={clr}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300" />

                  {/* Custom Color Picker (Right) */}
                  <div className="relative h-4 w-4 md:w-6 md:h-6 rounded-full overflow-hidden border cursor-pointer group">
                    {/* Colored background + icon (underneath) */}
                    <div
                      className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: settings.sidebarColor || "#1e3a8a",
                      }}
                    >
                      <MdOutlineColorize className="text-white/30 text-[10px] md:text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    {/* Color input (on top but invisible) */}
                    <input
                      type="color"
                      value={settings.sidebarColor || "#1e3a8a"}
                      onChange={(e) =>
                        onSettingsChange((prev) => ({
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
          <div className="flex items-center gap-1 md:gap-3">
            <div className="flex gap-1 md:gap-2 bg-gray-100 p-1 rounded-md">
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
                    onSettingsChange((prev) => ({
                      ...prev,
                      descriptionAlign: value,
                    }))
                  }
                  className={`p-1 md:p-2 text-sm md:text-lg md:rounded-md transition  ${
                    settings.descriptionAlign === value
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

          {/* Font Selector */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "font" ? null : "font"))
              }
              title="Change Font"
              className="md:p-2 rounded-md hover:bg-gray-100 transition"
            >
              <FaFont className="text-gray-700 text-xs md:text-lg" />
            </button>

            {/* Dropdown Menu */}
            {openDropdown === "font" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-40 md:w-52 right-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
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
                        onSettingsChange((prev) => ({
                          ...prev,
                          fontFamily: font,
                        }));
                        setOpenDropdown(false);
                      }}
                      className={`text-xs md:text-sm text-left px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition ${
                        settings.fontFamily === font
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

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-3">
            <button
              title="Decrease Font Size"
              onClick={() =>
                onSettingsChange((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.max(-10, (prev.fontScaleLevel || 0) - 1),
                }))
              }
              className="md:p-2 align-middle  rounded hover:bg-gray-200"
            >
              <span className="text-lg align-middle md:text-xl">
                <MdOutlineTextDecrease />
              </span>
            </button>

            <button
              title="Increase Font Size"
              onClick={() =>
                onSettingsChange((prev) => ({
                  ...prev,
                  fontScaleLevel: Math.min(10, (prev.fontScaleLevel || 0) + 1),
                }))
              }
              className="md:p-2 align-middle rounded hover:bg-gray-200"
            >
              <span className="text-lg align-middle md:text-xl">
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
                className="md:p-2 align-middle  rounded hover:bg-gray-200"
                title="Customize Skill Colors"
              >
                <span className="text-lg align-middle md:text-xl">
                  <MdOutlineFormatColorFill />
                </span>
              </button>

              {/* Popover Panel */}
              {openDropdown === "skillColor" && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 md:p-4 w-max right-1/2 transform translate-x-1/2">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Skill Bar Colors
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {resume.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs bg-white border border-gray-200 rounded-xs px-3 py-1 shadow-sm"
                      >
                        <span className="text-gray-700 font-medium">
                          {skill.domain}
                        </span>
                        <label className="relative w-3 h-3 md:w-5 md:h-5 cursor-pointer">
                          <input
                            type="color"
                            value={
                              settings.skillColors?.[skill.domain] || "#60a5fa"
                            }
                            onChange={(e) =>
                              onSettingsChange((prev) => ({
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
                                settings.skillColors?.[skill.domain] ||
                                "#60a5fa",
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
                className="md:p-2 align-middle rounded-md hover:bg-gray-100 transition"
                title="Change Project Link Color"
              >
                <FaLink className="text-sm md:text-lg text-gray-700" />
              </button>

              {/* Picker Panel */}
              {openDropdown === "linkColor" && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 md:p-4 w-fit right-1/2 transform translate-x-1/2">
                  <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                    Project Link Color
                  </p>

                  <div className="flex items-center gap-2.5 md:gap-4">
                    {/* Preset Swatches */}
                    <div className="flex gap-1 md:gap-2">
                      {[
                        "#2563eb", // blue
                        "#7c3aed", // purple
                        "#16a34a", // green
                        "#f59e0b", // amber
                        "#dc2626", // red
                      ].map((clr) => (
                        <button
                          key={clr}
                          className={`w-4 h-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                            clr === settings.linkColor
                              ? "ring-2 ring-offset-1 ring-sky-500"
                              : ""
                          }`}
                          style={{ backgroundColor: clr }}
                          onClick={() =>
                            onSettingsChange((prev) => ({
                              ...prev,
                              linkColor: clr,
                            }))
                          }
                          title={clr}
                        />
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    {/* Custom Color Picker Circle */}
                    <div className="relative w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border cursor-pointer group">
                      <input
                        type="color"
                        value={settings.linkColor || "#2563eb"}
                        onChange={(e) =>
                          onSettingsChange((prev) => ({
                            ...prev,
                            linkColor: e.target.value,
                          }))
                        }
                        className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        title="Pick custom color"
                      />
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor: settings.linkColor || "#2563eb",
                        }}
                      >
                        <MdOutlineColorize className="text-gray-500/50 text-xs md:text-lg drop-shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Color Picker Button for sidebar */}
          <div className="relative group">
            <button
              className="md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition"
              title="Sidebar Text Color"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "textSidebar" ? null : "textSidebar"
                )
              }
            >
              <RiFontColor className="text-sm md:text-lg text-gray-700" />
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
                            settings.textColors?.[tag] || defaultTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          settings.textColors?.[tag] || defaultTextColor(tag)
                        }
                        onChange={(e) =>
                          onSettingsChange((prev) => ({
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
              className="md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition"
              title="Mainbar Text Color"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "mainTextColor" ? null : "mainTextColor"
                )
              }
            >
              <MdFormatColorText className="text-sm md:text-lg text-gray-700" />
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
                            settings.mainTextColors?.[tag] ||
                            defaultMainTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          settings.mainTextColors?.[tag] ||
                          defaultMainTextColor(tag)
                        }
                        onChange={(e) =>
                          onSettingsChange((prev) => ({
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

          {/* Section Spacing */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "gap" ? null : "gap"))
              }
              className="md:p-2 text-center align-middle rounded-md hover:bg-gray-100 transition"
              title="Adjust Section Spacing"
            >
              <CgSpaceBetweenV className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "gap" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 w-40 md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 md:p-3">
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CgSpaceBetweenV className="text-sky-700" />
                  Section Spacing
                </h3>

                <ul className="space-y-1 text-[12px] md:text-sm text-gray-600">
                  {[
                    { label: "None", value: 0 },
                    { label: "Small", value: 8 },
                    { label: "Medium", value: 16 },
                    { label: "Large", value: 24 },
                    { label: "Extra Large", value: 32 },
                  ].map((option) => (
                    <li
                      key={option.value}
                      onClick={() =>
                        onSettingsChange((prev) => ({
                          ...prev,
                          sectionGap: option.value,
                        }))
                      }
                      className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded cursor-pointer hover:bg-sky-50 transition ${
                        settings.sectionGap === option.value
                          ? "bg-sky-100 text-sky-700 font-semibold"
                          : ""
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Show/Hide Sections Button */}
          <div className="relative">
            <button
              className="md:p-2 rounded-md align-middle hover:bg-gray-100 transition"
              title="Show/Hide Sections"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "toggleSection" ? null : "toggleSection"
                )
              }
            >
              <BiShowAlt className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "toggleSection" && (
              <div className="absolute right-0 mt-2 z-50 w-48 md:w-72 max-w-[90vw] max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-3 flex items-center gap-1 md:gap-2">
                    <FaEye className="text-sky-700 text-[14px] md:text-base" />
                    Show/Hide Sections
                  </h3>

                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {Object.keys(settings.visibleSections).map((key) => {
                      const isVisible = settings.visibleSections[key];
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <button
                          key={key}
                          onClick={() =>
                            onSettingsChange((prev) => ({
                              ...prev,
                              visibleSections: {
                                ...prev.visibleSections,
                                [key]: !isVisible,
                              },
                            }))
                          }
                          className={`flex items-center justify-between px-1.5 md:px-3 py-1.5 rounded-md border transition-all text-[10px] md:text-xs ${
                            isVisible
                              ? "bg-blue-50 text-sky-700 border-sky-300 hover:bg-sky-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate w-16 md:w-28 text-left">
                            {label}
                          </span>
                          {isVisible ? (
                            <FaEye className="text-blue-500 text-[10px] md:text-sm shrink-0" />
                          ) : (
                            <FaEyeSlash className="text-gray-400 text-[10px] md:text-sm shrink-0" />
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
              className="md:p-2 align-middle rounded-md hover:bg-gray-100 transition"
              title="Reorder Sections"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "reorder" ? null : "reorder"
                )
              }
            >
              <IoReorderThreeSharp className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "reorder" && (
              <div className="absolute right-1/2 transform translate-x-1/2 mt-2 z-50 w-40 md:w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-1.5 md:p-4">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-3 flex items-center gap-1 md:gap-2">
                    <IoReorderThreeSharp className="text-sky-600" />
                    Reorder Sections
                  </h3>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]} // restrict drag to vertical
                    onDragEnd={({ active, over }) => {
                      if (!over || active.id === over.id) return;

                      const oldIndex = settings.sectionOrder.indexOf(active.id);
                      const newIndex = settings.sectionOrder.indexOf(over.id);

                      // Ensure drag happens within same section group
                      const isSidebar = sidebarSections.includes(active.id);
                      const overIsSidebar = sidebarSections.includes(over.id);
                      const isMain = mainSections.includes(active.id);
                      const overIsMain = mainSections.includes(over.id);

                      if (
                        (isSidebar && overIsSidebar) ||
                        (isMain && overIsMain)
                      ) {
                        const newOrder = arrayMove(
                          settings.sectionOrder,
                          oldIndex,
                          newIndex
                        );
                        onSettingsChange((prev) => ({
                          ...prev,
                          sectionOrder: newOrder,
                        }));
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-1.5 md:gap-4 text-xs">
                      {/* Sidebar Sections */}
                      <div>
                        <p className="text-[12px] md:text-xs text-gray-500 mb-1 font-medium">
                          Sidebar
                        </p>
                        <SortableContext
                          items={(settings.sectionOrder || []).filter((id) =>
                            sidebarSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5 ">
                            {settings.sectionOrder
                              .filter((id) => sidebarSections.includes(id))
                              .map((id) => (
                                <SortableItem key={id} id={id} />
                              ))}
                          </div>
                        </SortableContext>
                      </div>

                      {/* Main Sections */}
                      <div>
                        <p className="text-[12px] md:text-xs text-gray-500 mb-1 font-medium">
                          Main
                        </p>
                        <SortableContext
                          items={(settings.sectionOrder || []).filter((id) =>
                            mainSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5">
                            {settings.sectionOrder
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
        className=" border border-gray-400 p-2 md:p-4 flex"
        style={{
          backgroundColor: settings.bgColor || "#ffffff",
          fontFamily: settings.fontFamily || "Inter",
        }}
      >
        {/* Sidebar */}
        <aside
          className="w-full md:w-1/3 text-white p-3 md:p-6 flex flex-col"
          style={{
            backgroundColor: settings.sidebarColor || "#1e3a8a",
            rowGap: `${settings.sectionGap ?? 16}px`,
          }}
        >
          {(settings.sectionOrder || [])
            .filter(
              (key) =>
                settings.visibleSections?.[key] && sidebarSections.includes(key)
            )
            .map((key) => (
              <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
            ))}
        </aside>

        {/* Mainbar */}
        <main
          className="w-full md:w-2/3 p-2 md:p-8 flex flex-col"
          style={{
            rowGap: `${settings.sectionGap ?? 16}px`,
          }}
        >
          {(settings.sectionOrder || [])
            .filter(
              (key) =>
                settings.visibleSections?.[key] && mainSections.includes(key)
            )
            .map((key) => (
              <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
            ))}
        </main>
      </div>
    </div>
  );
};

export default ModernTemplate;
