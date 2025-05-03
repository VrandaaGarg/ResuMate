// src/Pages/ResumeForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const allResumes = JSON.parse(localStorage.getItem("resumes")) || {};

  const [step, setStep] = useState(0);
  const [resumeId] = useState(() => `resume-${Date.now()}`);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    education: {
      college: "",
      startYear: "",
      endYear: "",
      cgpa: "",
      school: "",
      schoolEndYear: "",
      tenth: "",
      twelfth: "",
    },
    skills: [{ domain: "", languages: [""] }],
    projects: [{ name: "", description: "", github: "", demo: "" }],
    experience: [{ company: "", years: "", description: "" }],
    achievements: [{ title: "", description: "", year: "", month: "" }],
    contact: { phone: "", email: "", github: "", linkedin: "", location: "" },
  });

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e, path) => {
    const keys = path.split(".");
    const updated = { ...formData };
    let curr = updated;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) curr[key] = e.target.value;
      else curr = curr[key];
    });
    setFormData(updated);
  };

  const addItem = (section, domainIndex = null) => {
    if (section === "skills") {
      if (domainIndex !== null) {
        // Add a skill to an existing domain
        const updatedSkills = [...formData.skills];
        updatedSkills[domainIndex].languages.push("");
        setFormData({ ...formData, skills: updatedSkills });
      } else {
        // Add a new domain
        const newDomain = { domain: "", languages: [""] };
        setFormData({ ...formData, skills: [...formData.skills, newDomain] });
      }
    } else {
      const newItem =
        section === "projects"
          ? { name: "", description: "", github: "", demo: "" }
          : section === "experience"
          ? { company: "", years: "", description: "" }
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
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const nextStep = () => {
    if (step === 0 && !formData.name.trim())
      return toast.error("Name is required!");
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const saveResumeToLocal = () => {
    const allResumes = JSON.parse(localStorage.getItem("resumes")) || {};
    allResumes[resumeId] = formData;
    localStorage.setItem("resumes", JSON.stringify(allResumes));
    toast.success("Resume saved successfully!");
    navigate("/resumes");
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              className="input"
            />
            <textarea
              placeholder="Short Description"
              value={formData.description}
              onChange={(e) => handleChange(e, "description")}
              className="input"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="College Name"
              value={formData.education.college}
              onChange={(e) => handleChange(e, "education.college")}
              className="input"
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Start Year"
                value={formData.education.startYear}
                onChange={(e) => handleChange(e, "education.startYear")}
                className="input"
              />
              <input
                type="text"
                placeholder="End Year"
                value={formData.education.endYear}
                onChange={(e) => handleChange(e, "education.endYear")}
                className="input"
              />
            </div>

            <input
              type="text"
              placeholder="College CGPA"
              value={formData.education.cgpa}
              onChange={(e) => handleChange(e, "education.cgpa")}
              className="input"
            />

            <input
              type="text"
              placeholder="School Name"
              value={formData.education.school}
              onChange={(e) => handleChange(e, "education.school")}
              className="input"
            />

            <input
              type="text"
              placeholder="School End Year"
              value={formData.education.schoolEndYear}
              onChange={(e) => handleChange(e, "education.schoolEndYear")}
              className="input"
            />

            <input
              type="text"
              placeholder="10th %"
              value={formData.education.tenth}
              onChange={(e) => handleChange(e, "education.tenth")}
              className="input"
            />

            <input
              type="text"
              placeholder="12th %"
              value={formData.education.twelfth}
              onChange={(e) => handleChange(e, "education.twelfth")}
              className="input"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Skills Section */}
            {formData.skills.map((skill, domainIndex) => (
              <div
                key={domainIndex}
                className="mb-6 border p-4 rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Domain (e.g., Frontend)"
                  value={skill.domain}
                  onChange={(e) =>
                    handleDomainChange(domainIndex, e.target.value)
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />

                {skill.languages.map((lang, langIndex) => (
                  <input
                    key={langIndex}
                    type="text"
                    placeholder={`Skill #${langIndex + 1}`}
                    value={lang}
                    onChange={(e) =>
                      handleSkillChange(domainIndex, langIndex, e.target.value)
                    }
                    className="w-full mb-2 px-3 py-2 border rounded"
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addItem("skills", domainIndex)}
                  className="px-4 py-1 bg-sky-700 text-white rounded hover:bg-sky-800 text-sm"
                >
                  + Add Skill
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("skills")}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Domain
            </button>

            {/* <button onClick={() => addItem('skills')} className="btn"><FaPlus className="mr-2" /> Add Domain</button> */}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
              Step 3: Projects
            </h2>

            {formData.projects.map((project, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-200 p-4 rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) =>
                    handleArrayChange("projects", index, "name", e.target.value)
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={project.github}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      "github",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Live Demo Link"
                  value={project.demo}
                  onChange={(e) =>
                    handleArrayChange("projects", index, "demo", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              + Add Project
            </button>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
              Step 4: Experience
            </h2>

            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-200 p-4 rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "company",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Years (e.g., 2020 - 2023)"
                  value={exp.years}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "years",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("experience")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              + Add Experience
            </button>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
              Step 5: Achievements
            </h2>

            {formData.achievements.map((achieve, index) => (
              <div
                key={index}
                className="mb-6 border border-gray-200 p-4 rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={achieve.title}
                  onChange={(e) =>
                    handleArrayChange(
                      "achievements",
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={achieve.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "achievements",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Month (e.g., March)"
                    value={achieve.month}
                    onChange={(e) =>
                      handleArrayChange(
                        "achievements",
                        index,
                        "month",
                        e.target.value
                      )
                    }
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Year (e.g., 2024)"
                    value={achieve.year}
                    onChange={(e) =>
                      handleArrayChange(
                        "achievements",
                        index,
                        "year",
                        e.target.value
                      )
                    }
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("achievements")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              + Add Achievement
            </button>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
              Step 6: Contact Information
            </h2>

            <input
              type="text"
              placeholder="Phone Number"
              value={formData.contact.phone}
              onChange={(e) =>
                handleSingleChange("contact", "phone", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={formData.contact.email}
              onChange={(e) =>
                handleSingleChange("contact", "email", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <input
              type="text"
              placeholder="GitHub Profile Link"
              value={formData.contact.github}
              onChange={(e) =>
                handleSingleChange("contact", "github", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <input
              type="text"
              placeholder="LinkedIn Profile Link"
              value={formData.contact.linkedin}
              onChange={(e) =>
                handleSingleChange("contact", "linkedin", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <input
              type="text"
              placeholder="Location (City, Country)"
              value={formData.contact.location}
              onChange={(e) =>
                handleSingleChange("contact", "location", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
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
    <motion.div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">{steps[step]}</h2>

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

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="btn-secondary"
        >
          <FaArrowLeft /> Back
        </button>

        {step === steps.length - 1 ? (
          <button onClick={saveResumeToLocal} className="btn-primary">
            Finish & Save
          </button>
        ) : (
          <button onClick={nextStep} className="btn-primary">
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeForm;
