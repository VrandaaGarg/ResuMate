// src/Contexts/ResumeDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ResumeDataContext = createContext();

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
