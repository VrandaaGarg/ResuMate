// src/Contexts/StandardSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getStandardSettings, editStandardSettings } from "../config/database";

const StandardSettingContext = createContext();

export const StandardSettingProvider = ({ children }) => {
  const [standardSettings, setStandardSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getStandardSettings();
        if (data) setStandardSettings(data);
      } catch (error) {
        console.error("Failed to fetch standard settings:", error.message);
        setStandardSettings({}); // fallback to empty settings
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        editStandardSettings(standardSettings);
      } catch (err) {
        console.error("Failed to update standard settings:", err.message);
      }
    }
  }, [standardSettings, loading]);

  return (
    <StandardSettingContext.Provider
      value={{ standardSettings, setStandardSettings }}
    >
      {!loading && children}
    </StandardSettingContext.Provider>
  );
};

export const useStandardSetting = () => useContext(StandardSettingContext);
