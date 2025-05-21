// src/Contexts/ModernSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ModernSettingContext = createContext();

export const ModernSettingProvider = ({ children }) => {
  const [modernSettings, setModernSettings] = useState(() => {
    const local = localStorage.getItem("modernSettings");
    return local ? JSON.parse(local) : {};
  });

  useEffect(() => {
    localStorage.setItem("modernSettings", JSON.stringify(modernSettings));
  }, [modernSettings]);

  return (
    <ModernSettingContext.Provider
      value={{ modernSettings, setModernSettings }}
    >
      {children}
    </ModernSettingContext.Provider>
  );
};

export const useModernSetting = () => useContext(ModernSettingContext);
