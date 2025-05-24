// src/Contexts/ClassicSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getClassicSettings } from "../db/database";

const ClassicSettingContext = createContext();

export const ClassicSettingProvider = ({ children }) => {
  const LOCAL_KEY = "ClassicTemplateSetting";

  const [classicSettings, setClassicSettings] = useState(() => {
    // Load from localStorage first
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const cloudData = await getClassicSettings();
      // Only use cloud data if nothing was in localStorage
      if (!localStorage.getItem(LOCAL_KEY) && cloudData) {
        setClassicSettings(cloudData);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  // Auto sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(classicSettings));
  }, [classicSettings]);

  return (
    <ClassicSettingContext.Provider
      value={{ classicSettings, setClassicSettings }}
    >
      {!loading && children}
    </ClassicSettingContext.Provider>
  );
};

export const useClassicSetting = () => useContext(ClassicSettingContext);
