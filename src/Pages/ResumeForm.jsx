import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RxCrossCircled, RxCross1, RxCross2 } from "react-icons/rx";
import { useResumeData } from "../Contexts/ResumeDataContext";
import RichTextInput from "../Components/RichTextInput";
import { GoLocation } from "react-icons/go";
import { GiBookCover } from "react-icons/gi";
import { GrTechnology } from "react-icons/gr";
import {
  FiUser,
  FiBookOpen,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiPhone,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiMapPin,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaLink,
  FaGithub,
  FaPlus,
  FaArrowRight,
  FaBookReader,
  FaArrowLeft,
  FaRegUser,
} from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import showSuccessToast from "../Components/showSuccessToast";
import { createResume } from "../config/database"; // 🔥 Firestore function

const steps = [
  "Personal Info",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Achievements",
  "Contact",
];

const ResumeForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  // const [formData, setFormData] = useState(() => {
  //   const saved = localStorage.getItem("resumeData");
  //   return saved
  //     ? JSON.parse(saved)
  //     : {
  //         name: "",
  //         description: "",
  //         education: {
  //           college: "",
  //           degree: "",
  //           specialization: "",
  //           location: "",
  //           startYear: "",
  //           endYear: "",
  //           cgpa: "",
  //           school: "",
  //           tenth: "",
  //           twelfth: "",
  //         },
  //         skills: [{ domain: "", languages: [""] }],
  //         projects: [{ name: "", description: "", github: "", demo: "" }],
  //         experience: [
  //           {
  //             company: "",
  //             role: "",
  //             technologies: "",
  //             years: "",
  //             description: "",
  //           },
  //         ],
  //         achievements: [{ title: "", description: "", year: "", month: "" }],
  //         contact: {
  //           phone: "",
  //           email: "",
  //           github: "",
  //           linkedin: "",
  //           location: "",
  //         },
  //       };
  // });

  // useEffect(() => {
  //   localStorage.setItem("resumeData", JSON.stringify(formData));
  // }, [formData]);

  const defaultResumeData = {
    name: "",
    description: "",
    education: {
      college: "",
      degree: "",
      specialization: "",
      location: "",
      startYear: "",
      endYear: "",
      cgpa: "",
      school: "",
      tenth: "",
      twelfth: "",
    },
    skills: [{ domain: "", languages: [""] }],
    projects: [{ name: "", description: "", github: "", demo: "" }],
    experience: [
      {
        company: "",
        role: "",
        technologies: "",
        years: "",
        description: "",
      },
    ],
    achievements: [{ title: "", description: "", year: "", month: "" }],
    contact: {
      phone: "",
      email: "",
      github: "",
      linkedin: "",
      location: "",
    },
  };

  const { resume, setResume } = useResumeData();

  const [formData, setFormData] = useState(() => resume || defaultResumeData);

  const handleChange = (e, path) => {
    const keys = path.split(".");
    const updated = { ...formData };
    let curr = updated;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) curr[key] = e.target.value;
      else curr = curr[key];
    });
    setFormData(updated);
    setResume(updated);
  };

  const addItem = (section, domainIndex = null) => {
    if (section === "skills") {
      if (domainIndex !== null) {
        const updatedSkills = [...formData.skills];
        updatedSkills[domainIndex].languages.push("");
        setFormData({ ...formData, skills: updatedSkills });
      } else {
        const newDomain = { domain: "", languages: [""] };
        setFormData({ ...formData, skills: [...formData.skills, newDomain] });
      }
    } else {
      const newItem =
        section === "projects"
          ? { name: "", description: "", github: "", demo: "" }
          : section === "experience"
          ? {
              company: "",
              role: "",
              technologies: "",
              years: "",
              description: "",
            }
          : { title: "", description: "", year: "", month: "" };

      setFormData({ ...formData, [section]: [...formData[section], newItem] });
    }
  };

  const handleSkillChange = (domainIndex, langIndex, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[domainIndex].languages[langIndex] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleDomainChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].domain = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const handleSingleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const removeItem = (section, index) => {
    if (!Array.isArray(formData[section])) return;
    const updatedSection = [...formData[section]];
    updatedSection.splice(index, 1);
    setFormData((prev) => ({ ...prev, [section]: updatedSection }));
  };

  const removeSkill = (domainIndex, langIndex) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[domainIndex].languages.splice(langIndex, 1);
    if (updatedSkills[domainIndex].languages.length === 0) {
      updatedSkills.splice(domainIndex, 1);
    }
    setFormData({ ...formData, skills: updatedSkills });
  };

  const nextStep = () => {
    if (step === 0 && !formData.name.trim())
      return toast.error("Name is required!");
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const saveResumeToFirebase = async () => {
    try {
      await createResume(formData);
      setResume(formData);
      showSuccessToast("Resume saved successfully!");
      navigate("/resume");
    } catch (err) {
      toast.error("Failed to save resume!");
      console.error("Firestore error:", err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      // Personal Info
      case 0:
        return (
          <div className="space-y-10">
            {/* Full Name */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <FiUser className="absolute top-9 left-3 text-gray-500" />
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Short Description
              </label>

              <RichTextInput
                value={formData.description}
                onChange={(html) =>
                  handleChange({ target: { value: html } }, "description")
                }
                placeholder="A brief personal summary or tagline"
              />
            </div>
          </div>
        );

      // Education
      case 1:
        return (
          <div className="space-y-5">
            {/* College Name */}
            <div className="relative">
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                College Name
              </label>
              <FiBookOpen className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder="e.g., MIT"
                value={formData.education.college}
                onChange={(e) => handleChange(e, "education.college")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Degree Or Program
              </label>
              <FaBookReader className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder="e.g., B.Tech in Computer Science"
                value={formData.education.degree}
                onChange={(e) => handleChange(e, "education.degree")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specialization if any
              </label>
              <GiBookCover className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder="e.g., Artificial Intelligence"
                value={formData.education.specialization}
                onChange={(e) => handleChange(e, "education.specialization")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <GoLocation className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="college"
                type="text"
                placeholder="City and state/country of the college"
                value={formData.education.location}
                onChange={(e) => handleChange(e, "education.location")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            {/* Start & End Year */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label
                  htmlFor="startYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Year
                </label>
                <FiCalendar className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="startYear"
                  type="text"
                  placeholder="e.g., 2021"
                  value={formData.education.startYear}
                  onChange={(e) => handleChange(e, "education.startYear")}
                  className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
                />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="endYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Year
                </label>
                <FiCalendar className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="endYear"
                  type="text"
                  placeholder="e.g., 2025"
                  value={formData.education.endYear}
                  onChange={(e) => handleChange(e, "education.endYear")}
                  className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
                />
              </div>
            </div>

            {/* CGPA */}
            <div className="relative">
              <label
                htmlFor="cgpa "
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                College CGPA
              </label>
              <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="cgpa"
                type="text"
                placeholder="e.g., 9.0"
                value={formData.education.cgpa}
                onChange={(e) => handleChange(e, "education.cgpa")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            {/* School Name */}
            <div className="relative">
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                School Name
              </label>
              <FiBookOpen className="absolute top-9 left-3 text-gray-500 text-sm" />
              <input
                id="school"
                type="text"
                placeholder="e.g., DPS Delhi"
                value={formData.education.school}
                onChange={(e) => handleChange(e, "education.school")}
                className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
              />
            </div>

            <div className="flex flex-row gap-4">
              {/* 10th Percentage */}
              <div className="relative flex-1">
                <label
                  htmlFor="tenth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  10th Percentage
                </label>
                <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="tenth"
                  type="text"
                  placeholder="e.g., 92%"
                  value={formData.education.tenth}
                  onChange={(e) => handleChange(e, "education.tenth")}
                  className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
                />
              </div>

              {/* 12th Percentage */}
              <div className="relative flex-1">
                <label
                  htmlFor="twelfth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  12th Percentage
                </label>
                <FiBarChart2 className="absolute top-9 left-3 text-gray-500 text-sm" />
                <input
                  id="twelfth"
                  type="text"
                  placeholder="e.g., 89%"
                  value={formData.education.twelfth}
                  onChange={(e) => handleChange(e, "education.twelfth")}
                  className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
                />
              </div>
            </div>
          </div>
        );

      // Skills
      case 2:
        return (
          <div className="space-y-6">
            {formData.skills.map((skill, domainIndex) => (
              <div
                key={domainIndex}
                className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm"
              >
                {/* Domain Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Domain {domainIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("skills", domainIndex)}
                    className="text-red-600 hover:text-red-700 hover:scale-110 transition"
                  >
                    <RxCross1 size={18} />
                  </button>
                </div>

                {/* Domain Input */}
                <input
                  type="text"
                  placeholder="e.g., Frontend, Backend, DevOps"
                  value={skill.domain}
                  onChange={(e) =>
                    handleDomainChange(domainIndex, e.target.value)
                  }
                  className="w-full mb-4 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                />

                {/* Skills List */}
                {skill.languages.map((lang, langIndex) => (
                  <div key={langIndex} className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Skill ${langIndex + 1}`}
                      value={lang}
                      onChange={(e) =>
                        handleSkillChange(
                          domainIndex,
                          langIndex,
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(domainIndex, langIndex)}
                      className="text-red-600 hover:text-red-700 hover:scale-110 transition"
                    >
                      <RxCrossCircled size={18} />
                    </button>
                  </div>
                ))}

                {/* Add Skill Button */}
                <button
                  type="button"
                  onClick={() => addItem("skills", domainIndex)}
                  className="mt-4 text-sm px-4 py-1.5 border border-sky-700 text-sky-700 rounded-md hover:bg-sky-700 hover:text-white transition"
                >
                  + Add Skill
                </button>
              </div>
            ))}

            {/* Add New Domain Button */}
            <button
              type="button"
              onClick={() => addItem("skills")}
              className="w-full py-2 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
            >
              + Add New Domain
            </button>
          </div>
        );

      // Projects
      case 3:
        return (
          <div>
            {formData.projects.map((project, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-200 bg-white p-5 rounded-xl shadow-sm relative"
              >
                {/* Remove Button */}
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem("projects", index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition text-sm flex items-center gap-1"
                  >
                    <RxCross1 size={18} />
                  </button>
                )}

                <div className="mb-3 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <div className="relative">
                    <FaLink className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Portfolio Website"
                      value={project.name}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                </div>

                <div className="mb-3 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <RichTextInput
                      value={project.description}
                      onChange={(html) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "description",
                          html
                        )
                      }
                      placeholder="A brief personal summary or tagline"
                    />
                  </div>
                </div>

                <div className="mb-3 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Link
                  </label>
                  <div className="relative">
                    <FaGithub className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="https://github.com/username/repo"
                      value={project.github}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "github",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live Demo Link
                  </label>
                  <div className="relative">
                    <TbWorld className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="https://project-demo.com"
                      value={project.demo}
                      onChange={(e) =>
                        handleArrayChange(
                          "projects",
                          index,
                          "demo",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects")}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
            >
              <FaPlus /> Add Project
            </button>
          </div>
        );

      // Experience
      case 4:
        return (
          <div>
            <div className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm relative"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem("experience", index)}
                    className="absolute top-2 right-2 text-red-600 hover:scale-110 transition"
                  >
                    <RxCross1 />
                  </button>

                  {/* Company Name */}
                  <div className="relative mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <FiBriefcase className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g., Google"
                      value={exp.company}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div className="relative mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <FaRegUser className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g., Event Manager"
                      value={exp.role}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "role",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div className="relative mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <GrTechnology className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g., React, Node.js, MongoDB"
                      value={exp.technologies}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "technologies",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Duration */}
                  <div className="relative mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Years)
                    </label>
                    <FiCalendar className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g., 2021 - 2023"
                      value={exp.years}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "years",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>

                    <RichTextInput
                      value={exp.description}
                      onChange={(html) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "description",
                          html
                        )
                      }
                      placeholder="e.g., Worked on scalable frontend apps..."
                    />
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => addItem("experience")}
                className="w-full py-2 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
              >
                + Add Experience
              </button>
            </div>
          </div>
        );

      // Achievements
      case 5:
        return (
          <div>
            <div className="space-y-6">
              {formData.achievements.map((achieve, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 bg-white p-5 rounded-xl shadow-sm"
                >
                  {/* Remove Achievement */}
                  <button
                    type="button"
                    onClick={() => removeItem("achievements", index)}
                    className="absolute top-2 right-2 text-red-600 hover:scale-110 transition"
                  >
                    <RxCross1 />
                  </button>

                  {/* Title */}
                  <div className="relative mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Achievement Title
                    </label>
                    <FiAward className="absolute top-9 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g., Hackathon Winner"
                      value={achieve.title}
                      onChange={(e) =>
                        handleArrayChange(
                          "achievements",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="pl-10 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
                    />
                  </div>

                  {/* Description */}
                  <div className="relative mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <RichTextInput
                      value={achieve.description}
                      onChange={(html) =>
                        handleArrayChange(
                          "achievements",
                          index,
                          "description",
                          html
                        )
                      }
                      placeholder="e.g., Secured 1st place among 100+ teams"
                    />
                  </div>

                  {/* Month & Year */}
                  <div className="flex gap-2">
                    <div className="relative w-1/2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Month
                      </label>
                      <FiCalendar className="absolute top-9 left-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g., March"
                        value={achieve.month}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "month",
                            e.target.value
                          )
                        }
                        className="pl-10 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
                      />
                    </div>

                    <div className="relative w-1/2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <FiCalendar className="absolute top-9 left-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g., 2024"
                        value={achieve.year}
                        onChange={(e) =>
                          handleArrayChange(
                            "achievements",
                            index,
                            "year",
                            e.target.value
                          )
                        }
                        className="pl-10 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => addItem("achievements")}
                className="w-full mt-4 py-2 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition"
              >
                + Add Achievement
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            {/* Phone */}
            <div className="relative mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <FiPhone className="absolute top-9 left-3 text-gray-500" />
              <input
                id="phone"
                type="text"
                placeholder="e.g., +91 98765 43210"
                value={formData.contact.phone}
                onChange={(e) =>
                  handleSingleChange("contact", "phone", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border rounded focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <FiMail className="absolute top-9 left-3 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="e.g., you@example.com"
                value={formData.contact.email}
                onChange={(e) =>
                  handleSingleChange("contact", "email", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border rounded focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>

            {/* GitHub */}
            <div className="relative mb-4">
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                GitHub Profile
              </label>
              <FiGithub className="absolute top-9 left-3 text-gray-500" />
              <input
                id="github"
                type="text"
                placeholder="e.g., https://github.com/yourhandle"
                value={formData.contact.github}
                onChange={(e) =>
                  handleSingleChange("contact", "github", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border rounded focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>

            {/* LinkedIn */}
            <div className="relative mb-4">
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LinkedIn Profile
              </label>
              <FiLinkedin className="absolute top-9 left-3 text-gray-500" />
              <input
                id="linkedin"
                type="text"
                placeholder="e.g., https://linkedin.com/in/yourname"
                value={formData.contact.linkedin}
                onChange={(e) =>
                  handleSingleChange("contact", "linkedin", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border rounded focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>

            {/* Location */}
            <div className="relative mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <FiMapPin className="absolute top-9 left-3 text-gray-500" />
              <input
                id="location"
                type="text"
                placeholder="e.g., Jaipur, India"
                value={formData.contact.location}
                onChange={(e) =>
                  handleSingleChange("contact", "location", e.target.value)
                }
                className="w-full px-4 py-2 pl-10 border rounded focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
          </div>
        );
      // You can add similar UI for Projects, Experience, Achievements, and Contact here...
      default:
        return (
          <p className="text-center text-gray-500">More sections coming…</p>
        );
    }
  };

  return (
    <motion.div className="max-w-xl mx-auto px-6 py-10 bg-gradient-to-br from-white via-sky-50 to-white rounded-2xl border-1 shadow-xl border-gray-200">
      <h2 className="text-3xl text-sky-700 [font-family:'Lilita_One',cursive] text-center mb-6">
        {steps[step]}
      </h2>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        {renderStep()}
      </motion.div>

      <div className="flex justify-between items-center mt-8">
        {/* Back Button */}
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow transition ${
            step === 0
              ? "bg-sky-700/15 text-white cursor-not-allowed"
              : "bg-neutral-900 hover:bg-neutral-700 text-white"
          }`}
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Next / Finish Button */}
        {step === steps.length - 1 ? (
          <button
            onClick={saveResumeToFirebase}
            className="inline-flex items-center gap-2 px-5 py-2 bg-sky-700 hover:bg-sky-600 text-white font-semibold rounded-md shadow transition"
          >
            <FaCheckCircle className="text-white" />
            Build Resume
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="inline-flex items-center gap-2 px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-md shadow transition"
          >
            Next
            <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeForm;
