// src/Contexts/ClassicSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ClassicSettingContext = createContext();

export const ClassicSettingProvider = ({ children }) => {
  const [classicSettings, setClassicSettings] = useState(() => {
    const local = localStorage.getItem("ClassicSetting");
    return local ? JSON.parse(local) : {};
  });

  useEffect(() => {
    localStorage.setItem("ClassicSetting", JSON.stringify(classicSettings));
  }, [classicSettings]);

  return (
    <ClassicSettingContext.Provider
      value={{ classicSettings, setClassicSettings }}
    >
      {children}
    </ClassicSettingContext.Provider>
  );
};

export const useClassicSetting = () => useContext(ClassicSettingContext);
