// src/Contexts/StandardSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getStandardSettings } from "../db/database";

const StandardSettingContext = createContext();

export const StandardSettingProvider = ({ children }) => {
  const LOCAL_KEY = "StandardTemplateSetting";

  const [standardSettings, setStandardSettings] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const cloudData = await getStandardSettings();
        if (!localStorage.getItem(LOCAL_KEY) && cloudData) {
          setStandardSettings(cloudData);
        }
      } catch (error) {
        console.error("Failed to fetch standard settings:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(standardSettings));
  }, [standardSettings]);

  return (
    <StandardSettingContext.Provider
      value={{ standardSettings, setStandardSettings }}
    >
      {!loading && children}
    </StandardSettingContext.Provider>
  );
};

export const useStandardSetting = () => useContext(StandardSettingContext);
