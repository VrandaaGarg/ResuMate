// src/Components/Templates/ClassicTemplate.jsx
import React, { useEffect, useState } from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { BsBorderWidth, BsBoundingBoxCircles } from "react-icons/bs";
import { TbBorderCornerPill } from "react-icons/tb";
import { BiShowAlt } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaFillDrip, FaFont, FaLink } from "react-icons/fa";
import { IoReorderThreeSharp } from "react-icons/io5";
import DOMPurify from "dompurify";
import { CgSpaceBetweenV } from "react-icons/cg";
import { useClassicSetting } from "../../Contexts/ClassicSettingContext";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaShare, FaCog } from "react-icons/fa";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignRight,
  MdOutlineTextDecrease,
  MdOutlineTextIncrease,
  MdOutlineColorize,
  MdFormatColorText,
} from "react-icons/md";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { FaExpand } from "react-icons/fa";

const ClassicTemplate = ({ resume }) => {
  const { classicSettings, setClassicSettings } = useClassicSetting();
  const { isEditable } = useEditResume();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // start drag after small pointer move
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // long press for smoother intent
        tolerance: 10, // slight finger movement allowed
      },
    })
  );

  const handleBorderRadiusChange = (value) => {
    setClassicSettings((prev) => ({
      ...prev,
      borderRadius: value,
    }));
  };

  const [openDropdown, setOpenDropdown] = useState(null); // values: "toggle", "font", "reorder", etc.
  if (!resume) return null;

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
        return "#1e293b"; // dark slate
      case "h2":
        return "#334155"; // slightly lighter
      case "h3":
        return "#475569"; // even lighter
      case "h4":
        return "#64748b"; // light slate
      default:
        return "#000000";
    }
  };

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
      transform: CSS.Transform.toString({
        ...transform,
        scaleX: isDragging ? 1.03 : 1,
        scaleY: isDragging ? 1.03 : 1,
      }),

      transition: transition ?? "transform 200ms ease",
      opacity: isDragging ? 0.6 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center overflow-y-hidden justify-between px-2 py-1 md:py-2 bg-gray-50 border border-gray-200 rounded-md text-[12px] md:text-xs cursor-grab touch-none hover:bg-gray-100 transition"
        title={id}
      >
        <span className="capitalize text-gray-700 truncate max-w-[80%]">
          {id.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
        </span>
        <IoReorderThreeSharp className="text-gray-500 flex-shrink-0" />
      </div>
    );
  };

  useEffect(() => {
    if (!classicSettings.visibleSections) {
      setClassicSettings((prev) => ({
        ...prev,
        visibleSections: {
          name: true,
          details: true,
          description: true,
          education: true,
          skills: true,
          projects: true,
          experience: true,
          achievements: true,
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!classicSettings.sectionOrder) {
      setClassicSettings((prev) => ({
        ...prev,
        sectionOrder: [
          "name",
          "details",
          "description",
          "education",
          "skills",
          "projects",
          "experience",
          "achievements",
        ],
      }));
    }
  }, []);

  const hasAnyProjectLink =
    resume.contact?.email ||
    resume.contact?.linkedin ||
    resume.contact?.github ||
    resume.projects?.some((proj) => proj.demo || proj.github);

  const sectionMap = {
    name: (
      <div className="text-center">
        <h1
          className={`resume-h1 ${getCustomFontClass(
            "text-[36px]",
            classicSettings.fontScaleLevel
          )} font-bold w-full inline-block`}
          style={{
            color: classicSettings.TextColors?.["h1"] || "black",
            "--resume-h1-user": `${getFontPxValue(
              "36",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.name}
        </h1>
      </div>
    ),

    details: (
      <div className="text-center ">
        {/* Contact Line */}
        <p
          className={`resume-h3 ${getCustomFontClass(
            "text-[14px]",
            classicSettings.fontScaleLevel
          )} `}
          style={{
            "--resume-h3-user": `${getFontPxValue(
              "14",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          {[
            resume.contact.phone && (
              <span
                style={{
                  color: classicSettings.TextColors?.["h3"] || "#475569",
                }}
              >
                {resume.contact.phone}
              </span>
            ),
            resume.contact.email && (
              <a
                href={`mailto:${resume.contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: classicSettings.linkColor || "#2563eb" }}
              >
                {resume.contact.email}
              </a>
            ),
            resume.contact.location && (
              <span style={{ color: classicSettings.linkColor || "#2563eb" }}>
                {resume.contact.location}
              </span>
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
        <div
          className={`resume-h3 ${getCustomFontClass(
            "text-[14px]",
            classicSettings.fontScaleLevel
          )} break-words whitespace-normal flex flex-wrap justify-center gap-x-2 `}
          style={{
            color: classicSettings.linkColor || "#2563eb",
            "--resume-h3-user": `${getFontPxValue(
              "14",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          {resume.contact.websiteURL && (
            <a
              href={resume.contact.websiteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              {resume.contact.websiteURL}
            </a>
          )}

          {resume.contact.websiteURL && resume.contact.linkedin && (
            <span className="text-gray-700 hidden sm:inline">|</span>
          )}
          {resume.contact.github && (
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              {resume.contact.github}
            </a>
          )}

          {resume.contact.github && resume.contact.linkedin && (
            <span className="text-gray-700 hidden sm:inline">|</span>
          )}

          {resume.contact.linkedin && (
            <a
              href={resume.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              {resume.contact.linkedin}
            </a>
          )}
        </div>
      </div>
    ),

    description: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold `}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          PROFILE
        </h2>
        <div
          className={`resume-content resume-h3 ${getCustomFontClass(
            "text-[14px]",
            classicSettings.fontScaleLevel
          )}`}
          style={{
            color: classicSettings.TextColors?.["h3"] || "#475569",
            "--resume-h3-user": `${getFontPxValue(
              "14",
              classicSettings.fontScaleLevel
            )}px`,
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(resume.description),
          }}
        />
      </div>
    ),

    education: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold `}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          EDUCATION
        </h2>
        <div
          style={{
            color: classicSettings.TextColors?.["h3"] || "#475569",
            "--resume-h3-user": `${getFontPxValue(
              "14",
              classicSettings.fontScaleLevel
            )}px`,
          }}
          className={`flex resume-h3 gap-6 w-full ${getCustomFontClass(
            "text-[14px]",
            classicSettings.fontScaleLevel
          )} ${
            classicSettings.descriptionAlign === "center"
              ? "justify-center"
              : classicSettings.descriptionAlign === "right"
              ? "justify-end"
              : classicSettings.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          }`}
        >
          <p className="font-semibold">{resume.education.college}</p>
          <p className="italic"> {resume.education.location}</p>
        </div>
        <div
          className={`resume-h3 ${getCustomFontClass(
            "text-[14px]",
            classicSettings.fontScaleLevel
          )}`}
          style={{
            color: classicSettings.TextColors?.["h3"] || "#475569",
            "--resume-h3-user": `${getFontPxValue(
              "14",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          <div
            className={`flex resume-h3 gap-6 w-full ${getCustomFontClass(
              "text-[14px]",
              classicSettings.fontScaleLevel
            )} ${
              classicSettings.descriptionAlign === "center"
                ? "justify-center"
                : classicSettings.descriptionAlign === "right"
                ? "justify-end"
                : classicSettings.descriptionAlign === "justify"
                ? "justify-between"
                : "justify-start"
            }`}
            style={{
              "--resume-h3-user": `${getFontPxValue(
                "14",
                classicSettings.fontScaleLevel
              )}px`,
            }}
          >
            <p>
              {resume.education.degree}
              {resume.education.specialization &&
                ` (${resume.education.specialization})`}
            </p>

            {resume.education.startYear && resume.education.endYear && (
              <p className="italic">
                {" "}
                {resume.education.startYear} – {resume.education.endYear}
              </p>
            )}
          </div>

          {resume.education.cgpa && <p>{resume.education.cgpa} CGPA</p>}
        </div>
      </div>
    ),

    skills: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold `}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          SKILLS
        </h2>
        {resume.skills.map((skill, i) => (
          <div
            key={i}
            className={`resume-h3 ${getCustomFontClass(
              "text-[14px]",
              classicSettings.fontScaleLevel
            )}`}
            style={{
              "--resume-h3-user": `${getFontPxValue(
                "14",
                classicSettings.fontScaleLevel
              )}px`,
            }}
          >
            <span
              className="font-semibold mr-2"
              style={{ color: classicSettings.TextColors?.["h3"] || "#475569" }}
            >
              {skill.domain}:
            </span>{" "}
            <span
              style={{ color: classicSettings.TextColors?.["h4"] || "#64748b" }}
            >
              {skill.languages.join(", ")}
            </span>
          </div>
        ))}
      </div>
    ),

    projects: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2  ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold `}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          PROJECTS
        </h2>
        {resume.projects.map((proj, i) => (
          <div key={i} className="md:mb-3">
            <div
              className={`resume-h3 flex gap-2 md:gap-6 w-full ${getCustomFontClass(
                "text-[14px]",
                classicSettings.fontScaleLevel
              )} ${
                classicSettings.descriptionAlign === "center"
                  ? "justify-center"
                  : classicSettings.descriptionAlign === "right"
                  ? "justify-end"
                  : classicSettings.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
              style={{
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  classicSettings.fontScaleLevel
                )}px`,
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: classicSettings.TextColors?.["h3"] || "#475569",
                }}
              >
                {proj.name}
              </span>
              <div>
                {(proj.demo || proj.github) && (
                  <span>
                    (
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline "
                        style={{
                          color: classicSettings.linkColor || "#2563eb",
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
                        className="underline "
                        style={{
                          color: classicSettings.linkColor || "#2563eb",
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

            {/* Description */}
            <div
              className={`resume-content resume-h3  ${getCustomFontClass(
                "text-[14px]",
                classicSettings.fontScaleLevel
              )}`}
              style={{
                color: classicSettings.TextColors?.["h4"] || "#64748b",
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  classicSettings.fontScaleLevel
                )}px`,
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(proj.description),
              }}
            />
          </div>
        ))}
      </div>
    ),

    experience: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold text-gray-800`}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          EXPERIENCE
        </h2>
        <ul className="gap-2">
          {resume.experience.map((a, i) => (
            <li
              key={i}
              className={`md:mb-3 resume-h3  ${getCustomFontClass(
                "text-[14px]",
                classicSettings.fontScaleLevel
              )}`}
              style={{
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  classicSettings.fontScaleLevel
                )}px`,
              }}
            >
              <div
                style={{
                  color: classicSettings.TextColors?.["h3"] || "#475569",
                }}
                className={`flex gap-2 md:gap-6 w-full ${
                  classicSettings.descriptionAlign === "center"
                    ? "justify-center"
                    : classicSettings.descriptionAlign === "right"
                    ? "justify-end"
                    : classicSettings.descriptionAlign === "justify"
                    ? "justify-between"
                    : "justify-start"
                }`}
              >
                <span className="font-semibold">
                  {a.company} {a.role && ` - ${a.role}`}
                </span>
                <span className="italic">{a.years}</span>
              </div>
              {a.technologies && a.technologies.trim() !== "" && (
                <p
                  className="md:my-0.5"
                  style={{
                    color: classicSettings.TextColors?.["h4"] || "#64748b",
                  }}
                >
                  <span className="font-bold">Technologies:</span>{" "}
                  {a.technologies}
                </p>
              )}

              <div
                className={`resume-content   `}
                style={{
                  color: classicSettings.TextColors?.["h4"] || "#64748b",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.description),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    ),

    achievements: (
      <div style={{ textAlign: classicSettings.descriptionAlign || "left" }}>
        <h2
          className={`resume-h2 ${getCustomFontClass(
            "text-[16px]",
            classicSettings.fontScaleLevel
          )} font-bold `}
          style={{
            color: classicSettings.TextColors?.["h2"] || "#334155",
            "--resume-h2-user": `${getFontPxValue(
              "16",
              classicSettings.fontScaleLevel
            )}px`,
          }}
        >
          ACHIEVEMENTS
        </h2>
        <ul className="list-disc pl-1.5 md:pl-5 ">
          {resume.achievements.map((a, i) => (
            <li
              key={i}
              className={`resume-h3 ${getCustomFontClass(
                "text-[14px]",
                classicSettings.fontScaleLevel
              )}`}
              style={{
                "--resume-h3-user": `${getFontPxValue(
                  "14",
                  classicSettings.fontScaleLevel
                )}px`,
              }}
            >
              <div
                style={{
                  color: classicSettings.TextColors?.["h3"] || "#475569",
                }}
                className={`flex gap-6 w-full ${
                  classicSettings.descriptionAlign === "center"
                    ? "justify-center"
                    : classicSettings.descriptionAlign === "right"
                    ? "justify-end"
                    : classicSettings.descriptionAlign === "justify"
                    ? "justify-between"
                    : "justify-start"
                }`}
              >
                <span className="font-semibold">{a.title}</span>
                <span className="italic">
                  {a.month || ""} {a.year || ""}
                </span>
              </div>

              <div
                className="resume-content "
                style={{
                  color: classicSettings.TextColors?.["h4"] || "#64748b",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.description),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
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

      {isEditable && (
        <div className="w-full bg-white justify-center border border-gray-200  px-2.5 md:px-6 py-2.5 md:py-3 mb-2.5 md:mb-6 flex flex-wrap items-center gap-3">
          {/* Resume Background Color */}
          <div className="relative">
            {/* Color Icon Button */}
            <button
              className={`md:p-2 rounded-md hover:bg-gray-200 transition relative group ${
                openDropdown === "bgColor" ? "bg-gray-200" : ""
              }`}
              title={`Background Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "bgColor" ? null : "bgColor"
                )
              }
            >
              <FaFillDrip className="text-sm md:text-xl text-gray-700" />
              <span
                className="hidden md:block absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{
                  backgroundColor: classicSettings.backgroundColor || "#ffffff",
                }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "bgColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                  Background Color
                </p>

                <div className="flex items-center gap-2 md:gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-1 md:gap-2">
                    {[
                      "#ffffff",
                      "#f1f5f9",
                      "#fef3c7",
                      "#e0f2fe",
                      "#fce7f3",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`h-4 w-4 md:w-6 md:h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === classicSettings.backgroundColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          setClassicSettings((prev) => ({
                            ...prev,
                            backgroundColor: clr,
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
                    <div
                      className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          classicSettings.backgroundColor || "#ffffff",
                      }}
                    >
                      <FaFillDrip className="text-gray-600/50 text-[10px] md:text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    <input
                      type="color"
                      value={classicSettings.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setClassicSettings((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
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
                    setClassicSettings((prev) => ({
                      ...prev,
                      descriptionAlign: value,
                    }))
                  }
                  className={`p-1 md:p-2 text-sm md:text-lg md:rounded-md transition ${
                    classicSettings.descriptionAlign === value
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
                openDropdown === "font" ? "bg-gray-100" : ""
              }`}
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
                        setClassicSettings((prev) => ({
                          ...prev,
                          fontFamily: font,
                        }));
                        setOpenDropdown(false);
                      }}
                      className={`text-xs md:text-sm text-left px-2 md:px-3 py-1 rounded hover:bg-gray-100 transition ${
                        classicSettings.fontFamily === font
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
          {/* Font Size Adjustments */}
          <div className="flex items-center gap-3">
            <button
              title="Decrease Font Size"
              onClick={() =>
                setClassicSettings((prev) => ({
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
                setClassicSettings((prev) => ({
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
              <div className="absolute max-h-48 overflow-auto left-1/2 -translate-x-1/2 mt-2 z-50 w-28 md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 md:p-3">
                <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CgSpaceBetweenV className="text-sky-700" />
                  Section Spacing
                </h3>

                <ul className="space-y-1 text-[14px] md:text-sm text-gray-600">
                  {[
                    { label: "None", value: 0 },
                    { label: "Extra Small", value: 4 },
                    { label: "Small", value: 8 },
                    { label: "Normal", value: 12 },
                    { label: "Medium", value: 16 },
                    { label: "Large", value: 20 },
                    { label: "Extra Large", value: 24 },
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
                        setClassicSettings((prev) => ({
                          ...prev,
                          sectionGap: option.value,
                        }))
                      }
                      className={`px-1 md:px-3 text-[12px] md:text-base py-0.5 md:py-1.5 rounded cursor-pointer hover:bg-sky-50 transition ${
                        classicSettings.sectionGap === option.value
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
          {/* Border Width Dropdown */}
          {/* <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderWidth" ? null : "borderWidth"
                )
              }
              title="Border Width"
              className={`md:p-2 rounded-md text-center align-middle hover:bg-gray-100 transition ${
                openDropdown === "borderWidth" ? "bg-gray-100" : ""
              }`}
            >
              <BsBorderWidth className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "borderWidth" && (
              <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 md:p-3  w-32 md:max-w-[90vw]">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-3 text-center">
                  Select Width
                </p>

                <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                  {[
                    { label: "None", value: "0px" },
                    { label: "1px", value: "1px" },
                    { label: "2px", value: "2px" },
                    { label: "4px", value: "4px" },
                    { label: "6px", value: "6px" },
                    { label: "8px", value: "8px" },
                  ].map((w) => (
                    <li key={w.value}>
                      <button
                        onClick={() => {
                          setClassicSettings((prev) => ({
                            ...prev,
                            borderWidth: w.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`w-full justify-center h-5 px-1 py-1.5 rounded-xs flex items-center gap-5 hover:bg-sky-50 transition ${
                          classicSettings.borderWidth === w.value
                            ? "bg-sky-100"
                            : "text-gray-800"
                        }`}
                      >
                        {w.value === "0px" ? (
                          <span className="text-xs md:text-sm text-center text-gray-500">
                            No Border
                          </span>
                        ) : (
                          <div
                            style={{
                              borderBottom: `${w.value} solid #334155`,
                              width: "100%",
                            }}
                          ></div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}

          {/* Padding Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "padding" ? null : "padding"
                )
              }
              title="Margin"
              className={`md:p-2 rounded-md text-center align-middle hover:bg-gray-100 transition ${
                openDropdown === "padding" ? "bg-gray-100" : ""
              }`}
            >
              {/* Any padding or spacing icon, e.g., FaExpandArrowsAlt */}
              <FaExpand className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "padding" && (
              <div className="absolute max-h-48 md:max-h-64 overflow-auto left-1/2 -translate-x-1/2 mt-2 z-50 w-28 md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 md:p-3">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-3 text-center">
                  Select Padding
                </p>

                <ul className="flex flex-col gap-1 max-h-60 pr-1">
                  {[
                    { label: "None", value: "0px" },
                    { label: "Extra Small", value: "3px" },
                    { label: "Small", value: "6px" },
                    { label: "Normal", value: "10px" },
                    { label: "Medium", value: "15px" },
                    { label: "Large", value: "20px" },
                    { label: "Extra Large", value: "28px" },
                    { label: "Huge", value: "36px" },
                    { label: "Massive", value: "44px" },
                    { label: "Giant", value: "56px" },
                    { label: "Colossal", value: "62px" },
                    { label: "Titanic", value: "70px" },
                    { label: "Epic", value: "86px" },
                  ].map((p) => (
                    <li key={p.value}>
                      <button
                        onClick={() => {
                          setClassicSettings((prev) => ({
                            ...prev,
                            padding: p.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`px-1.5 md:px-3 py-1.5 text-xs md:text-base text-left w-full rounded cursor-pointer hover:bg-sky-50 transition ${
                          classicSettings.padding === p.value
                            ? "bg-sky-100 text-sky-700 font-semibold"
                            : ""
                        }`}
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/*border style and color*/}
          {/* <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderStyles" ? null : "borderStyles"
                )
              }
              title="Border style and color"
              className={`md:p-2 text-center align-middle rounded-md hover:bg-gray-100 transition ${
                openDropdown === "borderStyles" ? "bg-gray-100" : ""
              }`}
            >
              <BsBoundingBoxCircles className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "borderStyles" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-40 left-0">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Border Settings
                </p>

                <div className="mb-2 md:mb-4">
                  <label className="block text-xs text-gray-500 mb-1">
                    Style
                  </label>
                  <select
                    value={classicSettings.borderStyle || "solid"}
                    onChange={(e) =>
                      setClassicSettings((prev) => ({
                        ...prev,
                        borderStyle: e.target.value,
                      }))
                    }
                    className="w-full border text-xs md:text-sm rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="solid">Solid</option>
                    <option value="dotted">Dotted</option>
                    <option value="dashed">Dashed</option>
                    <option value="double">Double</option>
                    <option value="groove">Groove</option>
                    <option value="ridge">Ridge</option>
                    <option value="inset">Inset</option>
                    <option value="outset">Outset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={classicSettings.borderColor || "#cbd5e1"}
                    onChange={(e) =>
                      setClassicSettings((prev) => ({
                        ...prev,
                        borderColor: e.target.value,
                      }))
                    }
                    className="w-full h-8 rounded border cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div> */}

          {/* Border Radius */}
          {/* <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderRadius" ? null : "borderRadius"
                )
              }
              title="Border Radius"
              className={`md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition ${
                openDropdown === "borderRadius" ? "bg-gray-100" : ""
              }`}
            >
              <TbBorderCornerPill className="text-gray-700 text-sm md:text-lg" />
            </button>

            {openDropdown === "borderRadius" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg p-3 w-40 max-w-[90vw]">
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                  Border Radius
                </p>

                <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                  {[
                    { label: "None", value: "0px" },
                    { label: "2px", value: "2px" },
                    { label: "4px", value: "4px" },
                    { label: "6px", value: "6px" },
                    { label: "8px", value: "8px" },
                    { label: "12px", value: "12px" },
                    { label: "16px", value: "16px" },
                    { label: "24px", value: "24px" },
                    { label: "32px", value: "32px" },
                  ].map((r) => (
                    <li key={r.value}>
                      <button
                        onClick={() => {
                          setClassicSettings((prev) => ({
                            ...prev,
                            borderRadius: r.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`w-full px-3 py-0.5 md:py-1.5 rounded-sm flex items-center gap-3 hover:bg-gray-50 transition ${
                          classicSettings.borderRadius === r.value
                            ? "bg-sky-50"
                            : "text-gray-800"
                        }`}
                      >
                        <span className="text-xs w-12 text-left text-gray-600">
                          {r.value}
                        </span>
                        <div
                          className="h-4 md:h-6 flex-1 border border-gray-300 bg-white"
                          style={{ borderRadius: r.value }}
                        ></div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}
          {/* Text Color Button */}
          <div className="relative group">
            <button
              className={`md:p-2 align-middle text-center rounded-md hover:bg-gray-100 transition ${
                openDropdown === "TextColor" ? "bg-gray-100" : ""
              }`}
              title="Text Color"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "TextColor" ? null : "TextColor"
                )
              }
            >
              <MdFormatColorText className="text-sm md:text-lg text-gray-700" />
            </button>

            {openDropdown === "TextColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-0">
                {["h1", "h2", "h3", "h4"].map((tag) => (
                  <div key={tag} className="flex items-center gap-3 mb-2">
                    <span className="uppercase text-xs w-5">{tag}</span>

                    <div className="relative w-5 h-5 rounded-full overflow-hidden border cursor-pointer group">
                      <div
                        className="absolute inset-0 z-0 rounded-full"
                        style={{
                          backgroundColor:
                            classicSettings.TextColors?.[tag] ||
                            defaultTextColor(tag),
                        }}
                      />
                      <input
                        type="color"
                        value={
                          classicSettings.TextColors?.[tag] ||
                          defaultTextColor(tag)
                        }
                        onChange={(e) =>
                          setClassicSettings((prev) => ({
                            ...prev,
                            TextColors: {
                              ...prev.TextColors,
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
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 md:p-4 w-fit left-1/2 -translate-x-1/2">
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
                            clr === classicSettings.linkColor
                              ? "ring-2 ring-offset-1 ring-sky-500"
                              : ""
                          }`}
                          style={{ backgroundColor: clr }}
                          onClick={() =>
                            setClassicSettings((prev) => ({
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
                        value={classicSettings.linkColor || "#2563eb"}
                        onChange={(e) =>
                          setClassicSettings((prev) => ({
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
                            classicSettings.linkColor || "#2563eb",
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
          {/* Toggle Visibility Dropdown */}
          <div className="relative">
            <button
              className={`md:p-2 rounded-md align-middle hover:bg-gray-100 transition ${
                openDropdown === "toggle" ? "bg-gray-100" : ""
              }`}
              title="Show/Hide Sections"
              onClick={() =>
                setOpenDropdown((prev) => (prev === "toggle" ? null : "toggle"))
              }
            >
              <BiShowAlt className="text-lg md:text-xl text-gray-700" />
            </button>

            {openDropdown === "toggle" && (
              <div className="absolute left-1/2 -translate-x-1/2 md:right-0 mt-2 z-50 w-48 md:w-48 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-[12px] md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-3 flex items-center gap-1 md:gap-2">
                    <FaEye className="text-sky-700" />
                    Show/Hide Sections
                  </h3>

                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {Object.keys(classicSettings.visibleSections).map((key) => {
                      const isVisible = classicSettings.visibleSections[key];
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <button
                          key={key}
                          onClick={() =>
                            setClassicSettings((prev) => ({
                              ...prev,
                              visibleSections: {
                                ...prev.visibleSections,
                                [key]: !isVisible,
                              },
                            }))
                          }
                          className={`flex items-center justify-between px-1.5 md:px-3 py-1.5 rounded-md border text-[10px] md:text-xs transition-all ${
                            isVisible
                              ? "bg-blue-50 text-sky-700 border-sky-300 hover:bg-sky-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate w-10 md:w-24 text-left">
                            {label}
                          </span>
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
          {/* Reorder Sections Dropdown */}
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
              <div className="absolute right-0 mt-2 z-50 w-40 md:w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2.5 md:p-4">
                  <h3 className="text-[16px] md:text-sm font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                    <IoReorderThreeSharp className="text-sky-700" />
                    Reorder Sections
                  </h3>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]} // 👈 restrict to vertical only
                    onDragEnd={({ active, over }) => {
                      if (!over || active.id === over.id) return;

                      const oldIndex = classicSettings.sectionOrder.indexOf(
                        active.id
                      );
                      const newIndex = classicSettings.sectionOrder.indexOf(
                        over.id
                      );
                      const newOrder = arrayMove(
                        classicSettings.sectionOrder,
                        oldIndex,
                        newIndex
                      );

                      setClassicSettings((prev) => ({
                        ...prev,
                        sectionOrder: newOrder,
                      }));
                    }}
                  >
                    <SortableContext
                      items={classicSettings.sectionOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1.5">
                        {classicSettings.sectionOrder.map((id) => (
                          <SortableItem key={id} id={id} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resume Preview */}
      <div
        className="m-2.5 md:flex  border border-gray-200 mx-2.5 mb-2.5 bg-white/60 backdrop-blur-md  shadow-xl"
        style={{
          backgroundColor: classicSettings.backgroundColor || "#ffffff",
        }}
      >
        <div
          ref={contentRef}
          className="w-full md:min-h-[1050px] flexs mx-auto p-2.5  text-sm leading-relaxed  "
          style={{
            fontFamily: classicSettings.fontFamily || "Inter",
            backgroundColor: classicSettings.backgroundColor || "#ffffff",
            flexDirection: "column",
          }}
        >
          {/* Inner Resume Container */}
          <div
            className="h-full  flex flex-col min-h-[1097px]"
            style={{
              border:
                classicSettings.borderWidth &&
                classicSettings.borderWidth !== "0px"
                  ? `${classicSettings.borderWidth} ${
                      classicSettings.borderStyle || "solid"
                    } ${classicSettings.borderColor || "#cbd5e1"}`
                  : "none",
              borderRadius: classicSettings.borderRadius || "0px",
            }}
          >
            <div
              className="flex flex-col flex-1  overflow-hidden"
              style={{
                padding: classicSettings.padding || "0px",

                rowGap: `${classicSettings.sectionGap ?? 16}px`,
              }}
            >
              {Array.isArray(classicSettings?.sectionOrder) &&
                classicSettings.sectionOrder.map(
                  (sectionKey) =>
                    classicSettings.visibleSections?.[sectionKey] && (
                      <div
                        key={sectionKey}
                        className="break-inside-avoid" // Prevents breaking within sections
                        style={{ pageBreakInside: "avoid" }} // For print
                      >
                        {sectionMap[sectionKey]}
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
