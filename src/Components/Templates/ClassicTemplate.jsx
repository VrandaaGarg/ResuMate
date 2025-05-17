// src/Components/Templates/ClassicTemplate.jsx
import React from "react";
import { useEditResume } from "../../Contexts/EditResumeContext";

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

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto font-sans text-sm leading-relaxed space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">
          {renderInput(
            "text",
            resume.name,
            (e) => updateRoot("name", e.target.value),
            "w-full text-center border-b border-dashed outline-none"
          )}
        </h1>
        <p className="text-sm">
          {renderInput(
            "text",
            resume.contact.phone,
            (e) => updateField("contact", "phone", e.target.value),
            "w-1/4 text-center outline-none"
          )}
          {" | "}
          {renderInput(
            "email",
            resume.contact.email,
            (e) => updateField("contact", "email", e.target.value),
            "w-1/3 text-blue-600 text-center outline-none"
          )}
          {" | "}
          {renderInput(
            "location",
            resume.contact.location,
            (e) => updateField("contact", "location", e.target.value),
            "w-1/3 text-blue-600 text-center outline-none"
          )}
        </p>
        <div className="text-sm text-blue-600 space-x-3">
          {renderInput(
            "url",
            resume.contact.github,
            (e) => updateField("contact", "github", e.target.value),
            "underline w-1/3 text-center outline-none"
          )}
          {renderInput(
            "url",
            resume.contact.linkedin,
            (e) => updateField("contact", "linkedin", e.target.value),
            "underline w-1/3 text-center outline-none"
          )}
        </div>
      </div>

      {/* Profile */}
      <Section title="PROFILE">
        {renderInput(
          "textarea",
          resume.description,
          (e) => updateRoot("description", e.target.value),
          "w-full outline-none bg-gray-100 p-2 rounded",
          { rows: 3 }
        )}
      </Section>

      {/* Education */}
      <Section title="EDUCATION">
        <p className="font-semibold">
          {renderInput(
            "text",
            resume.education.college,
            (e) => updateField("education", "college", e.target.value),
            "outline-none"
          )}
        </p>
        <p className="italic">
          {renderInput(
            "text",
            resume.education.startYear,
            (e) => updateField("education", "startYear", e.target.value),
            "outline-none w-16"
          )}
          {" – "}
          {renderInput(
            "text",
            resume.education.endYear,
            (e) => updateField("education", "endYear", e.target.value),
            "outline-none w-16"
          )}
          {" — "}
          {renderInput(
            "text",
            resume.education.cgpa,
            (e) => updateField("education", "cgpa", e.target.value),
            "outline-none w-16"
          )}{" "}
          CGPA
        </p>
      </Section>

      {/* Skills */}
      <Section title="SKILLS">
        {resume.skills.map((skill, i) => (
          <div key={i}>
            <span className="font-semibold">
              {renderInput(
                "text",
                skill.domain,
                (e) => updateArray("skills", i, "domain", e.target.value),
                "outline-none font-semibold mr-2"
              )}
              :
            </span>
            {renderInput(
              "text",
              skill.languages.join(", "),
              (e) =>
                updateArray(
                  "skills",
                  i,
                  "languages",
                  e.target.value.split(",").map((s) => s.trim())
                ),
              "outline-none"
            )}
          </div>
        ))}
      </Section>

      {/* Projects */}
      <Section title="PROJECTS">
        {resume.projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between">
              <span className="font-bold">
                {renderInput(
                  "text",
                  proj.name,
                  (e) => updateArray("projects", i, "name", e.target.value),
                  "outline-none"
                )}
              </span>
              <span className="italic">
                {renderInput(
                  "text",
                  proj.month,
                  (e) => updateArray("projects", i, "month", e.target.value),
                  "outline-none w-16"
                )}{" "}
                {renderInput(
                  "text",
                  proj.year,
                  (e) => updateArray("projects", i, "year", e.target.value),
                  "outline-none w-12"
                )}
              </span>
            </div>
            <div className="text-sm text-blue-600 space-x-2">
              {renderInput(
                "url",
                proj.demo,
                (e) => updateArray("projects", i, "demo", e.target.value),
                "underline outline-none w-1/3"
              )}
              {renderInput(
                "url",
                proj.github,
                (e) => updateArray("projects", i, "github", e.target.value),
                "underline outline-none w-1/3"
              )}
            </div>
            {renderInput(
              "textarea",
              proj.description,
              (e) => updateArray("projects", i, "description", e.target.value),
              "w-full outline-none bg-gray-100 p-2 mt-1 rounded",
              { rows: 2 }
            )}
          </div>
        ))}
      </Section>

      {/* Experince */}
      <Section title="EXPERIENCE">
        <ul className="list-disc pl-5 space-y-2">
          {resume.experience.map((a, i) => (
            <li key={i}>
              <span className="">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {renderInput(
                      "text",
                      a.company,
                      (e) =>
                        updateArray("experience", i, "company", e.target.value),
                      "outline-none"
                    )}
                  </span>

                  <span className="italic">
                    {renderInput(
                      "text",
                      a.years,
                      (e) =>
                        updateArray("experience", i, "years", e.target.value),
                      "outline-none w-16"
                    )}{" "}
                  </span>
                </div>
              </span>{" "}
              {renderInput(
                "text",
                a.description,
                (e) =>
                  updateArray("achievements", i, "description", e.target.value),
                "outline-none w-2/3"
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* Achievements */}
      <Section title="ACHIEVEMENTS">
        <ul className="list-disc pl-5 space-y-2">
          {resume.achievements.map((a, i) => (
            <li key={i}>
              <span className="font-semibold">
                {renderInput(
                  "text",
                  a.title,
                  (e) =>
                    updateArray("achievements", i, "title", e.target.value),
                  "outline-none"
                )}
              </span>{" "}
              —{" "}
              {renderInput(
                "text",
                a.description,
                (e) =>
                  updateArray("achievements", i, "description", e.target.value),
                "outline-none w-2/3"
              )}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    {children}
  </section>
);

export default ClassicTemplate;
