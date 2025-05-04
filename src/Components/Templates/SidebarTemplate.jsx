// src/Components/Templates/SidebarTemplate.jsx
import React from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";
import { FaPhone } from "react-icons/fa6";
import { MdEmail, MdOutlineMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const SidebarTemplate = ({ resume, onChange }) => {
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
    <div className="min-h-screen flex font-sans text-sm text-gray-800">
      {/* Sidebar */}
      <aside className="w-1/3 bg-blue-900 text-white p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {renderInput(
              "text",
              resume.name,
              (e) => handleRootChange("name", e.target.value),
              "bg-transparent w-full text-center outline-none"
            )}
          </h1>
        </div>

        <div>
          <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
            Details
          </h2>
          <div className="flex flex-col space-y-1">
            {isEditable || resume.contact.location ? (
              <div className="flex items-start text-sm gap-2">
                <CiLocationOn className="flex-shrink-0 text-lg mt-1" />
                {renderInput(
                  "text",
                  resume.contact.location || "",
                  (e) => handleChange("contact", "location", e.target.value),
                  "bg-transparent outline-none w-full break-words"
                )}
              </div>
            ) : null}

            {isEditable || resume.contact.phone ? (
              <div className="flex items-center text-sm">
                <CiPhone className="mr-2 text-lg" />
                {renderInput(
                  "text",
                  resume.contact.phone || "",
                  (e) => handleChange("contact", "phone", e.target.value),
                  "bg-transparen outline-none w-full"
                )}
              </div>
            ) : null}

            {isEditable || resume.contact.email ? (
              <div className="flex items-center text-sm">
                <MdOutlineMailOutline className="mr-2 text-lg" />
                {renderInput(
                  "text",
                  resume.contact.email || "",
                  (e) => handleChange("contact", "email", e.target.value),
                  "bg-transparent outline-none w-full"
                )}
              </div>
            ) : null}

            {isEditable || resume.contact.linkedin ? (
              <div className="flex items-start text-sm gap-2">
                <FaLinkedinIn className="flex-shrink-0 text-lg mt-1" />
                {renderInput(
                  "text",
                  resume.contact.linkedin || "",
                  (e) => handleChange("contact", "linkedin", e.target.value),
                  "bg-transparent outline-none w-full break-words"
                )}
              </div>
            ) : null}

            {isEditable || resume.contact.github ? (
              <div className="flex items-center text-sm">
                <FaGithub className="mr-2 text-lg" />
                {renderInput(
                  "text",
                  resume.contact.github || "",
                  (e) => handleChange("contact", "github", e.target.value),
                  "bg-transparent outline-none w-full"
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="font-semibold uppercase tracking-wide text-blue-200 mb-2">
            Description
          </h2>
          {renderInput(
            "textarea",
            resume.description,
            (e) => handleRootChange("description", e.target.value),
            "bg-transparent outline-none w-full",
            { rows: 4 }
          )}
        </div>

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
              const percentage = Math.round((domainCount / totalSkills) * 100);

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
      <main className="w-2/3 bg-white p-8 space-y-6">
        {/* Experience */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-2">
            Professional Experience
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {renderInput(
                    "text",
                    exp.company,
                    (e) =>
                      handleArrayChange(
                        "experience",
                        i,
                        "company",
                        e.target.value
                      ),
                    "outline-none"
                  )}
                </p>
                <p className="italic">
                  {renderInput(
                    "text",
                    exp.years,
                    (e) =>
                      handleArrayChange(
                        "experience",
                        i,
                        "years",
                        e.target.value
                      ),
                    "outline-none"
                  )}
                </p>
              </div>
              {renderInput(
                "textarea",
                exp.description,
                (e) =>
                  handleArrayChange(
                    "experience",
                    i,
                    "description",
                    e.target.value
                  ),
                "w-full bg-gray-100 p-2 mt-1 rounded",
                { rows: 3 }
              )}
            </div>
          ))}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-2">Projects</h2>

          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-4">
              {/* Project Name */}
              <p className="font-semibold">
                {renderInput(
                  "text",
                  proj.name,
                  (e) =>
                    handleArrayChange("projects", i, "name", e.target.value),
                  "outline-none"
                )}
              </p>

              {/* Links */}
              <div className="text-blue-600 text-sm space-x-3">
                {renderInput(
                  "text",
                  proj.demo,
                  (e) =>
                    handleArrayChange("projects", i, "demo", e.target.value),
                  "underline outline-none"
                )}
                {renderInput(
                  "text",
                  proj.github,
                  (e) =>
                    handleArrayChange("projects", i, "github", e.target.value),
                  "underline outline-none"
                )}
              </div>

              {/* Description */}
              {isEditable ? (
                renderInput(
                  "textarea",
                  proj.description,
                  (e) =>
                    handleArrayChange(
                      "projects",
                      i,
                      "description",
                      e.target.value
                    ),
                  "w-full bg-gray-100 p-2 mt-1 rounded",
                  { rows: 3 }
                )
              ) : (
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                  {proj.description?.split("\n").map((line, idx) => (
                    <p key={idx} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-2">Education</h2>
          <p className="font-semibold">
            {renderInput(
              "text",
              resume.education.college,
              (e) => handleChange("education", "college", e.target.value),
              "outline-none"
            )}
          </p>
          <p className="italic">
            {renderInput(
              "text",
              resume.education.startYear,
              (e) => handleChange("education", "startYear", e.target.value),
              "outline-none w-16"
            )}
            {" - "}
            {renderInput(
              "text",
              resume.education.endYear,
              (e) => handleChange("education", "endYear", e.target.value),
              "outline-none w-16"
            )}
          </p>
          <p>
            CGPA:{" "}
            {renderInput(
              "text",
              resume.education.cgpa,
              (e) => handleChange("education", "cgpa", e.target.value),
              "outline-none w-20"
            )}
          </p>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-2">Achievements</h2>
          <ul className="list-disc pl-5 space-y-2">
            {resume.achievements.map((ach, i) => (
              <li key={i}>
                <strong>
                  {renderInput(
                    "text",
                    ach.title,
                    (e) =>
                      handleArrayChange(
                        "achievements",
                        i,
                        "title",
                        e.target.value
                      ),
                    "outline-none"
                  )}
                </strong>{" "}
                –{" "}
                {renderInput(
                  "text",
                  ach.description,
                  (e) =>
                    handleArrayChange(
                      "achievements",
                      i,
                      "description",
                      e.target.value
                    ),
                  "outline-none"
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default SidebarTemplate;
