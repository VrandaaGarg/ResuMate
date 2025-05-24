import React, { createContext, useContext, useEffect, useState } from "react";
import { getResumeData } from "../db/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ResumeDataContext = createContext();

export const ResumeDataProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getResumeData();
          setResume(data || null);
        } catch (err) {
          console.error("Failed to fetch resume:", err.message);
          setResume(null);
        }
      } else {
        setResume(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ResumeDataContext.Provider value={{ resume, setResume, loading }}>
      {!loading && children}
    </ResumeDataContext.Provider>
  );
};

export const useResumeData = () => useContext(ResumeDataContext);
