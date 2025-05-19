// src/Components/Templates/ClassicTemplate.jsx
import React, { useEffect, useState } from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { BsBorderWidth, BsBoundingBoxCircles } from "react-icons/bs";
import { TbBorderCornerPill } from "react-icons/tb";
import { BiShowAlt } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaFillDrip, FaFont } from "react-icons/fa";
import { IoReorderThreeSharp } from "react-icons/io5";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignRight,
  MdOutlineTextDecrease,
  MdOutlineTextIncrease,
} from "react-icons/md";
import {
  DndContext,
  closestCenter,
  PointerSensor,
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

const ClassicTemplate = ({ resume, onChange }) => {
  const { isEditable } = useEditResume();
  const sensors = useSensors(useSensor(PointerSensor));
  const [openDropdown, setOpenDropdown] = useState(null); // values: "toggle", "font", "reorder", etc.
  if (!resume) return null;
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
        className="flex items-center justify-between px-2 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs cursor-grab max-w-full hover:bg-gray-100 transition"
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
    if (!resume.visibleSections) {
      onChange((prev) => ({
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

  const sectionMap = {
    name: (
      <div className="text-center">
        <h1
          className={`${getScaledFontClass(
            "text-4xl",
            resume.fontScaleLevel || 0
          )} font-bold w-full inline-block`}
        >
          {resume.name}
        </h1>
      </div>
    ),
    details: (
      <div className="text-center space-y-1">
        {/* Contact Line */}
        <p
          className={`${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )} text-gray-700`}
        >
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
        <div
          className={` ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )} text-blue-600 space-x-1`}
        >
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
              {resume.contact.linkedin && (
                <span className="text-gray-700">|</span>
              )}
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
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          PROFILE
        </h2>
        <p
          className={`text-gray-700 ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )}`}
        >
          {resume.description}
        </p>
      </div>
    ),

    education: (
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          EDUCATION
        </h2>
        <div
          className={`flex gap-6 w-full ${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )} ${
            resume.descriptionAlign === "center"
              ? "justify-center"
              : resume.descriptionAlign === "right"
              ? "justify-end"
              : resume.descriptionAlign === "justify"
              ? "justify-between"
              : "justify-start"
          }`}
        >
          <p className="font-semibold">{resume.education.college}</p>
          <p className="italic">
            {" "}
            {resume.education.startYear} – {resume.education.endYear}
          </p>
        </div>
        <p
          className={`${getScaledFontClass(
            "text-sm",
            resume.fontScaleLevel || 0
          )}`}
        >
          {resume.education.cgpa} CGPA
        </p>
      </div>
    ),

    skills: (
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          SKILLS
        </h2>
        {resume.skills.map((skill, i) => (
          <div
            key={i}
            className={`${getScaledFontClass(
              "text-sm",
              resume.fontScaleLevel || 0
            )}`}
          >
            <span className="font-semibold mr-2">{skill.domain}:</span>{" "}
            <span>{skill.languages.join(", ")}</span>
          </div>
        ))}
      </div>
    ),

    projects: (
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          PROJECTS
        </h2>
        {resume.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <div
              className={`flex gap-6 w-full ${getScaledFontClass(
                "text-sm",
                resume.fontScaleLevel || 0
              )} ${
                resume.descriptionAlign === "center"
                  ? "justify-center"
                  : resume.descriptionAlign === "right"
                  ? "justify-end"
                  : resume.descriptionAlign === "justify"
                  ? "justify-between"
                  : "justify-start"
              }`}
            >
              <span className="font-bold">{proj.name}</span>
              <div>
                {(proj.demo || proj.github) && (
                  <span>
                    (
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-900"
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
                        className="underline text-blue-900"
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
            <p
              className={`mt-1 text-gray-700 ${getScaledFontClass(
                "text-sm",
                resume.fontScaleLevel || 0
              )}`}
            >
              {proj.description?.split("\n").map((line, idx) => (
                <p key={idx} className="mb-1">
                  {line}
                </p>
              ))}
            </p>
          </div>
        ))}
      </div>
    ),

    experience: (
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          EXPERIENCE
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {resume.experience.map((a, i) => (
            <li
              key={i}
              className={`${getScaledFontClass(
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
      <div style={{ textAlign: resume.descriptionAlign || "left" }}>
        <h2
          className={`${getScaledFontClass(
            "text-lg",
            resume.fontScaleLevel || 0
          )} font-bold text-gray-800`}
        >
          ACHIEVEMENTS
        </h2>
        <ul className="list-disc pl-5 space-y-2 ">
          {resume.achievements.map((a, i) => (
            <li
              key={i}
              className={`${getScaledFontClass(
                "text-sm",
                resume.fontScaleLevel || 0
              )}`}
            >
              <span className="font-semibold">{a.title}</span> —{" "}
              <span className="text-gray-700">{a.description}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  return (
    <div className="">
      {isEditable && (
        <div className="w-full bg-white justify-center border border-gray-200 shadow-sm rounded-md px-6 py-3 mb-6 flex flex-wrap items-center gap-3">
          {/* Resume Background Color */}
          <div className="relative">
            {/* Color Icon Button */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 transition relative group"
              title={`Background Color`}
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "bgColor" ? null : "bgColor"
                )
              }
            >
              <FaFillDrip className="text-xl text-gray-700" />
              <span
                className="absolute w-4 h-4 rounded-full border border-gray-300 right-1 top-1"
                style={{ backgroundColor: resume.backgroundColor || "#ffffff" }}
              ></span>
            </button>

            {/* Color Picker Panel */}
            {openDropdown === "bgColor" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-fit right-1/2">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Background Color
                </p>

                <div className="flex items-center gap-4">
                  {/* Fixed Swatches (Left) */}
                  <div className="flex gap-2">
                    {[
                      "#ffffff",
                      "#f1f5f9",
                      "#fef3c7",
                      "#e0f2fe",
                      "#fce7f3",
                    ].map((clr) => (
                      <button
                        key={clr}
                        className={`w-6 h-6 rounded-full border transition-all hover:scale-105 ${
                          clr === resume.backgroundColor
                            ? "ring-2 ring-offset-1 ring-sky-500"
                            : ""
                        }`}
                        style={{ backgroundColor: clr }}
                        onClick={() =>
                          onChange((prev) => ({
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
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border cursor-pointer group">
                    <div
                      className="absolute inset-0 z-0 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: resume.backgroundColor || "#ffffff",
                      }}
                    >
                      <FaFillDrip className="text-gray-600/50 text-sm drop-shadow group-hover:scale-110 transition" />
                    </div>

                    <input
                      type="color"
                      value={resume.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        onChange((prev) => ({
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

          {/* Font Selector */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === "font" ? null : "font"))
              }
              title="Change Font"
              className="p-2 rounded-md hover:bg-gray-100 transition"
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

          {/* Border Width Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderWidth" ? null : "borderWidth"
                )
              }
              title="Border Width"
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <BsBorderWidth className="text-gray-700 text-lg" />
            </button>

            {openDropdown === "borderWidth" && (
              <div className="absolute z-50 mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-lg p-3 w-56 max-w-[90vw]">
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
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
                          onChange((prev) => ({
                            ...prev,
                            borderWidth: w.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`w-full justify-center h-5 px-1 py-1.5 rounded-xs flex items-center gap-5 hover:bg-sky-50 transition ${
                          resume.borderWidth === w.value
                            ? "bg-sky-100"
                            : "text-gray-800"
                        }`}
                      >
                        {w.value === "0px" ? (
                          <span className="text-sm text-center text-gray-500">
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
          </div>

          {/*border style and color*/}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderStyles" ? null : "borderStyles"
                )
              }
              title="Border style and color"
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <BsBoundingBoxCircles className="text-gray-700 text-lg" />
            </button>

            {openDropdown === "borderStyles" && (
              <div className="absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-64 right-0">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Border Settings
                </p>

                {/* Border Style */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1">
                    Style
                  </label>
                  <select
                    value={resume.borderStyle || "solid"}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        borderStyle: e.target.value,
                      }))
                    }
                    className="w-full border text-sm rounded px-2 py-1 focus:outline-none"
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

                {/* Border Color */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={resume.borderColor || "#cbd5e1"}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        borderColor: e.target.value,
                      }))
                    }
                    className="w-full h-8 rounded border cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Border Radius Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "borderRadius" ? null : "borderRadius"
                )
              }
              title="Border Radius"
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <TbBorderCornerPill className="text-gray-700 text-lg" />
            </button>

            {openDropdown === "borderRadius" && (
              <div className="absolute z-50 mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-lg p-3 w-56 max-w-[90vw]">
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
                          onChange((prev) => ({
                            ...prev,
                            borderRadius: r.value,
                          }));
                          setOpenDropdown(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-sm flex items-center gap-3 hover:bg-gray-50 transition ${
                          resume.borderRadius === r.value
                            ? "bg-sky-50 "
                            : "text-gray-800"
                        }`}
                      >
                        {/* Text label */}
                        <span className="text-xs w-12 text-left text-gray-600">
                          {r.value}
                        </span>

                        {/* Preview Box */}
                        <div
                          className="h-6 flex-1 border border-gray-300 bg-white"
                          style={{
                            borderRadius: r.value,
                          }}
                        ></div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Toggle Visibility Dropdown */}
          <div className="relative">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Show/Hide Sections"
              onClick={() =>
                setOpenDropdown((prev) => (prev === "toggle" ? null : "toggle"))
              }
            >
              <BiShowAlt className="text-xl text-gray-700" />
            </button>

            {openDropdown === "toggle" && (
              <div className="absolute right-0 mt-2 z-50 w-72 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaEye className="text-blue-600" />
                    Show/Hide Sections
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(resume.visibleSections).map((key) => {
                      const isVisible = resume.visibleSections[key];
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

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
                          className={`flex items-center justify-between px-3 py-1.5 rounded-md border text-xs transition-all ${
                            isVisible
                              ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate w-24 text-left">
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
                      const newOrder = arrayMove(
                        resume.sectionOrder,
                        oldIndex,
                        newIndex
                      );

                      onChange((prev) => ({
                        ...prev,
                        sectionOrder: newOrder,
                      }));
                    }}
                  >
                    <SortableContext
                      items={resume.sectionOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1.5">
                        {resume.sectionOrder.map((id) => (
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
        className="max-w-4xl mx-auto p-5 text-sm leading-relaxed space-y-5 border border-gray-200 shadow-md"
        style={{
          fontFamily: resume.fontFamily || "Inter",
          backgroundColor: resume.backgroundColor || "#ffffff",
        }}
      >
        {/* Inner Resume Container */}
        <div
          className="p-7 flex flex-col gap-5"
          style={{
            border:
              resume.borderWidth && resume.borderWidth !== "0px"
                ? `${resume.borderWidth} ${resume.borderStyle || "solid"} ${
                    resume.borderColor || "#cbd5e1"
                  }`
                : "none",
            borderRadius: resume.borderRadius || "0px",
          }}
        >
          {/* Dynamically Render Sections */}
          {resume.sectionOrder.map(
            (sectionKey) =>
              resume.visibleSections[sectionKey] && (
                <div key={sectionKey}>{sectionMap[sectionKey]}</div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
