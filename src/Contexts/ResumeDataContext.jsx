// src/Contexts/ResumeDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ResumeDataContext = createContext();

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

export const ResumeDataProvider = ({ children }) => {
  const [resume, setResume] = useState(() => {
    const local = localStorage.getItem("resumeData");
    return local ? JSON.parse(local) : defaultResumeData;
  });

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resume));
  }, [resume]);

  return (
    <ResumeDataContext.Provider value={{ resume, setResume }}>
      {children}
    </ResumeDataContext.Provider>
  );
};

export const useResumeData = () => useContext(ResumeDataContext);

// defaultResumeData is your original structure without settings like backgroundColor etc.
