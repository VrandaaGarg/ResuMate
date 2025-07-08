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
import { useSidebarSetting } from "../../Contexts/SidebarSettingContext";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaGlobe } from "react-icons/fa";
import { useRef } from "react";

const SidebarTemplate = ({ resume }) => {
  const { isEditable } = useEditResume();
  const { sidebarSettings, setSidebarSettings } = useSidebarSetting();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
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

  const pixelSizes = [
    4, 6, 8, 10, 12, 14, 16, 18, 20, 26, 30, 36, 48, 60, 72, 96, 128,
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

  const getFontPxValue = (basePx, level = 0) => {
    const base = parseInt(basePx.replace(/\D/g, ""), 10);
    const index = pixelSizes.indexOf(base);
    if (index === -1) return base; // fallback
    const newIndex = Math.max(
      0,
      Math.min(pixelSizes.length - 1, index + level)
    );
    return pixelSizes[newIndex];
  };

  const defaultTextColor = (tag) => {
    switch (tag) {
      case "h1":
        return "white";
      case "h2":
        return "#F4F3F3";
      case "h3":
        return "#D6D5D5";
      case "h4":
        return "text-gray-300";
      default:
        return "#000000";
    }
  };

  const defaultMainTextColor = (tag) => {
    switch (tag) {
      case "h1":
        return "#000000"; // dark slate
      case "h2":
        return "#333333"; // slightly lighter
      case "h3":
        return "#404040"; // even lighter
      default:
        return "#404040";
    }
  };

  useEffect(() => {
    if (
      !sidebarSettings.sectionOrder ||
      !Array.isArray(sidebarSettings.sectionOrder)
    ) {
      setSidebarSettings((prev) => ({
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
  }, [sidebarSettings.sectionOrder, setSidebarSettings]);

  useEffect(() => {
    if (!sidebarSettings.visibleSections) {
      setSidebarSettings((prev) => ({
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
    if (!sidebarSettings.skillColors) {
      setSidebarSettings((prev) => ({
        ...prev,
        skillColors: {},
      }));
    }
  }, [sidebarSettings.skillColors, setSidebarSettings]);

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
          className={`resume-h1 ${getCustomFontClass(
            "text-[30px]",
            sidebarSettings.fontScaleLevel
          )} font-bold bg-transparent w-full text-center outline-none`}
          style={{
            color: sidebarSettings.textColors?.["h1"] || "white",
            "--resume-h1-user": `${getFontPxValue(
              "36",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.name || "Your Name"}
        </h1>
      </div>
    ),
    details: (
      <div className="mb-1 md:mb-2">
        <h2
          className={`font-semibold uppercase resume-h2 tracking-wide mb-1  md:mb-2 ${getCustomFontClass(
            "text-16px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            color: sidebarSettings.textColors?.["h2"] || "#F4F3F3",
            textAlign: sidebarSettings.descriptionAlign || "left",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          Details
        </h2>
        <div
          className={`flex break-words resume-h3 whitespace-normal flex-col space-y-0.5 md:space-y-2 ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            color: sidebarSettings.textColors?.["h3"] || "#d9d9d9",
            textAlign: sidebarSettings.descriptionAlign || "left",
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
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

          {resume.contact.websiteURL && (
            <div className="flex items-start  gap-2">
              <FaGlobe className="flex-shrink-0  mt-1" />
              <a
                href={resume.contact.websiteURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent outline-none w-full break-all"
              >
                {resume.contact.websiteURL}
              </a>
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
      <div className="mb-1 md:mb-2">
        {resume.description && (
          <div>
            <h2
              className={`font-semibold break-all resume-h2 uppercase tracking-wide mb-1 md:mb-2 ${getCustomFontClass(
                "text-[16px]",
                sidebarSettings.fontScaleLevel
              )}`}
              style={{
                color: sidebarSettings.textColors?.["h2"] || "text-blue-300",
                textAlign: sidebarSettings.descriptionAlign || "left",
                "--resume-h2-user": `${getFontPxValue(
                  "16",
                  sidebarSettings.fontScaleLevel
                )}px`,
              }}
            >
              Description
            </h2>

            <div
              className={`bg-transparent resume-h3 resume-content ${getCustomFontClass(
                "text-[14px]",
                sidebarSettings.fontScaleLevel
              )} outline-none w-full whitespace-pre-line`}
              style={{
                textAlign: sidebarSettings.descriptionAlign || "left",
                color: sidebarSettings.textColors?.["h3"] || "#d9d9d9",
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  sidebarSettings.fontScaleLevel
                )}px`,
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
      <div
        style={{ textAlign: sidebarSettings.descriptionAlign || "left" }}
        className="mb-1 md:mb-2"
      >
        <h2
          className={`font-semibold resume-h2 uppercase tracking-wide md:mb-2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            color: sidebarSettings.textColors?.["h2"] || "text-blue-300",
            textAlign: sidebarSettings.descriptionAlign || "left",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          Skills Overview
        </h2>

        <div className="">
          {resume.skills.map((skill, i) => {
            const totalSkills = resume.skills.reduce(
              (acc, s) => acc + s.languages.length,
              0
            );
            const domainCount = skill.languages.length;
            const percentage = Math.round((domainCount / totalSkills) * 100);

            return (
              <div key={i}>
                <span
                  className={`resume-h3 ${getCustomFontClass(
                    "text-[14px]",
                    sidebarSettings.fontScaleLevel
                  )} font-medium`}
                  style={{
                    color: sidebarSettings.textColors?.["h3"] || "#d9d9d9",
                    textAlign: sidebarSettings.descriptionAlign || "left",
                    "--resume-h3-user": `${getFontPxValue(
                      "14",
                      sidebarSettings.fontScaleLevel
                    )}px`,
                  }}
                >
                  {skill.domain}
                </span>

                <p
                  className={`resume-h3 ${getCustomFontClass(
                    "text-[14px]",
                    sidebarSettings.fontScaleLevel
                  )}`}
                  style={{
                    color: sidebarSettings.textColors?.["h4"] || "#c9c9c9",
                    "--resume-h3-user": `${getFontPxValue(
                      "14",
                      sidebarSettings.fontScaleLevel
                    )}px`,
                  }}
                >
                  {skill.languages.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        <p
          className={`font-semibold resume-h2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )} uppercase tracking-wide my-1 md:my-3`}
          style={{
            color: sidebarSettings.textColors?.["h2"] || "text-blue-300",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
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

            const color =
              sidebarSettings.skillColors?.[skill.domain] || "#9c9c9c";

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
          className={`resume-h3 ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )} space-y-1`}
          style={{
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
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

            const color =
              sidebarSettings.skillColors?.[skill.domain] || "#9c9c9c";

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
                    color: sidebarSettings.textColors?.["h3"] || "#d9d9d9",
                  }}
                >
                  {skill.domain}
                </span>
                <span
                  className="ml-auto "
                  style={{
                    color: sidebarSettings.textColors?.["h4"] || "#c9c9c9",
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
      <section
        style={{ textAlign: sidebarSettings.descriptionAlign || "left" }}
      >
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              sidebarSettings.mainTextColors?.["h1"] ||
              defaultMainTextColor("h1"),
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          EXPERIENCE
        </h2>
        {resume.experience.map((exp, i) => (
          <div
            key={i}
            className={`mb-4 resume-h3 ${getCustomFontClass(
              "text-[14px]",
              sidebarSettings.fontScaleLevel
            )}`}
            style={{
              "--resume-h3-user": `${getFontPxValue(
                "14",
                sidebarSettings.fontScaleLevel
              )}px`,
            }}
          >
            <div
              className={`flex gap-6 break-all w-full ${
                sidebarSettings.descriptionAlign === "center"
                  ? "justify-center"
                  : sidebarSettings.descriptionAlign === "right"
                  ? "justify-end"
                  : sidebarSettings.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    sidebarSettings.mainTextColors?.["h2"] ||
                    defaultMainTextColor("h2"),
                }}
              >
                {exp.company}–{exp.role}
              </p>
              <p
                className="italic"
                style={{
                  color:
                    sidebarSettings.mainTextColors?.["h2"] ||
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
                  textAlign: sidebarSettings.descriptionAlign || "left",
                  color:
                    sidebarSettings.mainTextColors?.["h3"] ||
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
                textAlign: sidebarSettings.descriptionAlign || "left",
                color:
                  sidebarSettings.mainTextColors?.["h3"] ||
                  defaultMainTextColor("h3"),
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
      <section
        style={{ textAlign: sidebarSettings.descriptionAlign || "left" }}
      >
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              sidebarSettings.mainTextColors?.["h1"] ||
              defaultMainTextColor("h1"),
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          PROJECTS
        </h2>

        {resume.projects.map((proj, i) => (
          <div
            key={i}
            className={`mb-4 resume-h3 ${getCustomFontClass(
              "text-[14px]",
              sidebarSettings.fontScaleLevel
            )}`}
            style={{
              "--resume-h3-user": `${getFontPxValue(
                "14",
                sidebarSettings.fontScaleLevel
              )}px`,
            }}
          >
            <div
              className={`flex gap-6 w-full ${
                sidebarSettings.descriptionAlign === "center"
                  ? "justify-center"
                  : sidebarSettings.descriptionAlign === "right"
                  ? "justify-end"
                  : sidebarSettings.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <p
                className="font-semibold"
                style={{
                  color:
                    sidebarSettings.mainTextColors?.["h2"] ||
                    defaultMainTextColor("h2"),
                }}
              >
                {proj.name}
              </p>

              <div
                className={`break-all resume-h3 ${getCustomFontClass(
                  "text-[14px]",
                  sidebarSettings.fontScaleLevel
                )}`}
                style={{
                  "--resume-h3-user": `${getFontPxValue(
                    "14",
                    sidebarSettings.fontScaleLevel
                  )}px`,
                }}
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
                        style={{
                          color: sidebarSettings.linkColor || "#2563eb",
                        }}
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
                        style={{
                          color: sidebarSettings.linkColor || "#2563eb",
                        }}
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
              className={`mt-1 resume-h3 ${getCustomFontClass(
                "text-[14px]",
                sidebarSettings.fontScaleLevel
              )} text-gray-700 whitespace-pre-line`}
              style={{
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  sidebarSettings.fontScaleLevel
                )}px`,
              }}
            >
              <div
                className="mb-1 resume-content"
                style={{
                  textAlign: sidebarSettings.descriptionAlign || "left",
                  color:
                    sidebarSettings.mainTextColors?.["h3"] ||
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
      <section
        style={{ textAlign: sidebarSettings.descriptionAlign || "left" }}
      >
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )} font-bold mb-2`}
          style={{
            color:
              sidebarSettings.mainTextColors?.["h1"] ||
              defaultMainTextColor("h1"),
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          EDUCATION
        </h2>

        <div
          className={`flex resume-h3 gap-6 break-all w-full ${
            sidebarSettings.descriptionAlign === "center"
              ? "justify-center"
              : sidebarSettings.descriptionAlign === "right"
              ? "justify-end"
              : sidebarSettings.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          } ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          <p
            className="font-semibold"
            style={{
              color:
                sidebarSettings.mainTextColors?.["h2"] ||
                defaultMainTextColor("h2"),
            }}
          >
            {resume.education.college}
          </p>

          <p
            className="italic"
            style={{
              color:
                sidebarSettings.mainTextColors?.["h2"] ||
                defaultMainTextColor("h2"),
            }}
          >
            {resume.education.location}
          </p>
        </div>

        <div
          className={`flex resume-h3 break-all gap-6 w-full ${
            sidebarSettings.descriptionAlign === "center"
              ? "justify-center"
              : sidebarSettings.descriptionAlign === "right"
              ? "justify-end"
              : sidebarSettings.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          } ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
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
                sidebarSettings.mainTextColors?.["h2"] ||
                defaultMainTextColor("h2"),
            }}
          >
            {resume.education.startYear} - {resume.education.endYear}
          </p>
        </div>

        <p
          className={`resume-h3 ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )}`}
          style={{
            color:
              sidebarSettings.mainTextColors?.["h3"] ||
              defaultMainTextColor("h3"),
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          CGPA: {resume.education.cgpa}
        </p>
      </section>
    ),

    achievements: (
      <section
        style={{ textAlign: sidebarSettings.descriptionAlign || "left" }}
      >
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            sidebarSettings.fontScaleLevel
          )} font-bold mb-1 md:mb-2`}
          style={{
            color:
              sidebarSettings.mainTextColors?.["h1"] ||
              defaultMainTextColor("h1"),
            "--resume-h2-user": `${getFontPxValue(
              "16",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          ACHIEVEMENTS
        </h2>
        <ul
          className={`list-disc resume-h3 ${getCustomFontClass(
            "text-[14px]",
            sidebarSettings.fontScaleLevel
          )} pl-5 space-y-2 text-gray-800`}
          style={{
            "--resume-h3-user": `${getFontPxValue(
              "14",
              sidebarSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.achievements.map((ach, i) => (
            <li
              key={i}
              style={{
                textAlign: sidebarSettings.descriptionAlign || "left",
                color:
                  sidebarSettings.mainTextColors?.["h2"] ||
                  defaultMainTextColor("h2"),
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
      {/* Preview Header - more compact */}
      <div className="bg-gradient-to-r from-slate-100/80 to-blue-50/80 p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/80 rounded-lg shadow-sm">
              <FaFileAlt className="text-blue-600 text-xs" />
            </div>
            <div>
              <h3 className="text-[14px] md:text-sm font-semibold text-slate-900">
                Resume Preview
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600">
                {resume.name}'s Professional Resume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={reactToPrintFn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-white/80 flex hover:bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-slate-600 hover:text-blue-600"
              title="Download PDF"
            >
              <FaDownload size={12} />
            </motion.button>
          </div>
        </div>
      </div>
      {/* Toolbar */}
      {isEditable && (
        <div className="w-full bg-white justify-center border border-gray-200 shadow-sm rounded-md px-2.5 md:px-6 py-2.5 md:py-3 mb-2.5 md:mb-6 flex flex-wrap items-center gap-3">
          {/* Background Color Picker */}
          <div className="relative">
            {/* Icon trigger */}
            <button
              className={`md:p-2 rounded-md hover:bg-gray-200 transition relative group ${
                openDropdown === "mainColor" ? "bg-gray-200" : ""
              }`}
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
                style={{
                  backgroundColor: sidebarSettings.bgColor || "#ffffff",
                }}
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
                          clr === sidebarSettings.bgColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          setSidebarSettings((prev) => ({
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
                      value={sidebarSettings.bgColor || "#ffffff"}
                      onChange={(e) =>
                        setSidebarSettings((prev) => ({
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
                      style={{
                        backgroundColor: sidebarSettings.bgColor || "#ffffff",
                      }}
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
              className={`md:p-2 rounded-md hover:bg-gray-200 transition relative group ${
                openDropdown === "sidebarColor" ? "bg-gray-200" : ""
              }`}
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
                style={{
                  backgroundColor: sidebarSettings.sidebarColor || "#212121",
                }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "sidebarColor" && (
              <div className="absolute z-50 mt-2 bg-white border bg-gra border-gray-200 rounded-lg shadow-xl p-4 w-fit left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                  Sidebar Color
                </p>

                <div className="flex items-center gap-2 md:gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-1 md:gap-2">
                    {[
                      "#2B2B2C",
                      "#02396D",
                      "#2E2020",
                      "#264700",
                      "#2F2135",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`h-4 w-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === sidebarSettings.sidebarColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          setSidebarSettings((prev) => ({
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
                        backgroundColor:
                          sidebarSettings.sidebarColor || "#1e3a8a",
                      }}
                    >
                      <MdOutlineColorize className="text-white/30 text-[10px] md:text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    {/* Color input (on top but invisible) */}
                    <input
                      type="color"
                      value={sidebarSettings.sidebarColor || "#1e3a8a"}
                      onChange={(e) =>
                        setSidebarSettings((prev) => ({
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
                    setSidebarSettings((prev) => ({
                      ...prev,
                      descriptionAlign: value,
                    }))
                  }
                  className={`p-1 md:p-2 text-sm md:text-lg md:rounded-md transition  ${
                    sidebarSettings.descriptionAlign === value
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
              className={`md:p-2 rounded-md hover:bg-gray-100 transition ${
                openDropdown === "font" ? "bg-gray-100 " : ""
              }`}
            >
              <FaFont className={`text-gray-700 text-xs md:text-lg`} />
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
                    "Open Sans",
                    "Nunito",
                    "Montserrat",
                    "Work Sans",
                    "DM Sans",
                    "Ubuntu",
                    "Fira Sans",
                    "Source Sans Pro",
                    "Raleway",
                    "Mulish",
                    "PT Sans",
                    "Helvetica",
                    "Segoe UI",
                    "Georgia",
                    "Times New Roman",
                    "Courier New",
                    "Lucida Console",
                    "Arial",
                  ].map((font) => (
                    <button
                      key={font}
                      onClick={() => {
                        setSidebarSettings((prev) => ({
                          ...prev,
                          fontFamily: font,
                        }));
                        setOpenDropdown(false);
                      }}
                      className={`text-xs md:text-sm text-left px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition ${
                        sidebarSettings.fontFamily === font
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
                setSidebarSettings((prev) => ({
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
                setSidebarSettings((prev) => ({
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
                className={`md:p-2 align-middle  rounded hover:bg-gray-200 ${
                  openDropdown === "skillColor" ? "bg-gray-200" : ""
                }`}
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
                              sidebarSettings.skillColors?.[skill.domain] ||
                              "#60a5fa"
                            }
                            onChange={(e) =>
                              setSidebarSettings((prev) => ({
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
                                sidebarSettings.skillColors?.[skill.domain] ||
                                "#9c9c9c",
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
                className={`md:p-2 align-middle rounded-md hover:bg-gray-100 transition ${
                  openDropdown === "linkColor" ? "bg-gray-100" : ""
                }`}
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
                        "#2B2B2C",
                        "#02396D",
                        "#2E2020",
                        "#264700",
                        "#2F2135",
                      ].map((clr) => (
                        <button
                          key={clr}
                          className={`w-4 h-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                            clr === sidebarSettings.linkColor
                              ? "ring-2 ring-offset-1 ring-sky-500"
                              : ""
                          }`}
                          style={{ backgroundColor: clr }}
                          onClick={() =>
                            setSidebarSettings((prev) => ({
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
                        value={sidebarSettings.linkColor || "#2563eb"}
                        onChange={(e) =>
                          setSidebarSettings((prev) => ({
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
                          backgroundColor:
                            sidebarSettings.linkColor || "#2563eb",
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
              className={`md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition ${
                openDropdown === "textSidebar" ? "bg-gray-100" : ""
              }`}
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
                            sidebarSettings.textColors?.[tag] ||
                            defaultTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          sidebarSettings.textColors?.[tag] ||
                          defaultTextColor(tag)
                        }
                        onChange={(e) =>
                          setSidebarSettings((prev) => ({
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
              className={`md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition ${
                openDropdown === "mainTextColor" ? "bg-gray-100" : ""
              }`}
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
                            sidebarSettings.mainTextColors?.[tag] ||
                            defaultMainTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          sidebarSettings.mainTextColors?.[tag] ||
                          defaultMainTextColor(tag)
                        }
                        onChange={(e) =>
                          setSidebarSettings((prev) => ({
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
              className={`md:p-2 text-center align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "gap" ? "bg-gray-100" : ""
              }`}
              title="Adjust Section Spacing"
            >
              <CgSpaceBetweenV className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "gap" && (
              <div className="absolute max-h-48 overflow-auto left-1/2 -translate-x-1/2 mt-2 z-50 w-32 md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 md:p-3">
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CgSpaceBetweenV className="text-sky-700" />
                  Section Spacing
                </h3>

                <ul className="space-y-1 text-[12px] md:text-sm text-gray-600">
                  {[
                    { label: "None", value: 0 },
                    { label: "Extra Small", value: 4 },
                    { label: "Small", value: 8 },
                    { label: "normal", value: 12 },
                    { label: "Medium", value: 16 },
                    { label: "Large", value: 20 },
                    { label: "Extra Large", value: 26 },
                    { label: "Huge", value: 28 },
                    { label: "Massive", value: 32 },
                    { label: "Giant", value: 36 },
                    { label: "Colossal", value: 40 },
                    { label: "Titanic", value: 44 },
                    { label: "Epic", value: 48 },
                  ].map((option) => (
                    <li
                      key={option.value}
                      onClick={() =>
                        setSidebarSettings((prev) => ({
                          ...prev,
                          sectionGap: option.value,
                        }))
                      }
                      className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded cursor-pointer hover:bg-sky-50 transition ${
                        sidebarSettings.sectionGap === option.value
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
              className={`md:p-2 rounded-md align-middle hover:bg-gray-100 transition ${
                openDropdown === "toggleSection" ? "bg-gray-100" : ""
              }`}
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
                    {Object.keys(sidebarSettings.visibleSections).map((key) => {
                      const isVisible = sidebarSettings.visibleSections[key];
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <button
                          key={key}
                          onClick={() =>
                            setSidebarSettings((prev) => ({
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
              className={`md:p-2 align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "reorder" ? "bg-gray-100" : ""
              }`}
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

                      const oldIndex = sidebarSettings.sectionOrder.indexOf(
                        active.id
                      );
                      const newIndex = sidebarSettings.sectionOrder.indexOf(
                        over.id
                      );

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
                          sidebarSettings.sectionOrder,
                          oldIndex,
                          newIndex
                        );
                        setSidebarSettings((prev) => ({
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
                          items={(sidebarSettings.sectionOrder || []).filter(
                            (id) => sidebarSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5 ">
                            {sidebarSettings.sectionOrder
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
                          items={(sidebarSettings.sectionOrder || []).filter(
                            (id) => mainSections.includes(id)
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-1.5">
                            {sidebarSettings.sectionOrder
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
      <div className="overflow-hidden md:aspect-[7/10.4] md:flex">
        <div
          ref={contentRef}
          className="border print-a4 border-gray-400 p-2 md:p-4 flex"
          style={{
            backgroundColor: sidebarSettings.bgColor || "#ffffff",
            fontFamily: sidebarSettings.fontFamily || "Inter",

            flexDirection: "row",
          }}
        >
          {/* Sidebar */}
          <aside
            className=" w-1/3 print:w-[32%] text-white overflow-hidden p-3 md:p-6 flex flex-col"
            style={{
              backgroundColor: sidebarSettings.sidebarColor || "#212121",
              rowGap: `${sidebarSettings.sectionGap ?? 16}px`,
            }}
          >
            {(sidebarSettings.sectionOrder || [])
              .filter(
                (key) =>
                  sidebarSettings.visibleSections?.[key] &&
                  sidebarSections.includes(key)
              )
              .map((key) => (
                <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
              ))}
          </aside>

          {/* Mainbar */}
          <main
            className=" w-2/3 print:w-[68%] p-2 md:p-6 flex flex-col"
            style={{
              rowGap: `${sidebarSettings.sectionGap ?? 16}px`,
            }}
          >
            {(sidebarSettings.sectionOrder || [])
              .filter(
                (key) =>
                  sidebarSettings.visibleSections?.[key] &&
                  mainSections.includes(key)
              )
              .map((key) => (
                <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
              ))}
          </main>
        </div>
      </div>{" "}
    </div>
  );
};

export default SidebarTemplate;
