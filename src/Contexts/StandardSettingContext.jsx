// src/Contexts/StandardSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const StandardSettingContext = createContext();

export const StandardSettingProvider = ({ children }) => {
  const [standardSettings, setStandardSettings] = useState(() => {
    const local = localStorage.getItem("StandardSetting");
    return local ? JSON.parse(local) : {};
  });

  useEffect(() => {
    localStorage.setItem("StandardSetting", JSON.stringify(standardSettings));
  }, [standardSettings]);

  return (
    <StandardSettingContext.Provider
      value={{ standardSettings, setStandardSettings }}
    >
      {children}
    </StandardSettingContext.Provider>
  );
};

export const useStandardSetting = () => useContext(StandardSettingContext);
