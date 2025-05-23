import React, { createContext, useContext, useEffect, useState } from "react";
import { getResumeData } from "../config/database";

const ResumeDataContext = createContext();

export const ResumeDataProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const data = await getResumeData();
      if (data) setResume(data);
      setLoading(false);
    };
    fetchResume();
  }, []);

  return (
    <ResumeDataContext.Provider value={{ resume, setResume, loading }}>
      {!loading && children}
    </ResumeDataContext.Provider>
  );
};

export const useResumeData = () => useContext(ResumeDataContext);
