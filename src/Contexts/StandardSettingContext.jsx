// src/Contexts/StandardSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getStandardSettings, editStandardSettings } from "../config/database";

const StandardSettingContext = createContext();

export const StandardSettingProvider = ({ children }) => {
  const [standardSettings, setStandardSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getStandardSettings();
      if (data) setStandardSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!loading) editStandardSettings(standardSettings);
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
