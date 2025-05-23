// src/Contexts/ClassicSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getClassicSettings, editClassicSettings } from "../config/database";

const ClassicSettingContext = createContext();

export const ClassicSettingProvider = ({ children }) => {
  const [classicSettings, setClassicSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getClassicSettings();
      if (data) setClassicSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  // Auto sync to Firestore when classicSettings change
  useEffect(() => {
    if (!loading) editClassicSettings(classicSettings);
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
