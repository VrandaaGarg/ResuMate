// src/Contexts/SidebarSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const SidebarSettingContext = createContext();

export const SidebarSettingProvider = ({ children }) => {
  const [sidebarSettings, setSidebarSettings] = useState(() => {
    const local = localStorage.getItem("SidebarSetting");
    return local ? JSON.parse(local) : {};
  });

  useEffect(() => {
    localStorage.setItem("SidebarSetting", JSON.stringify(sidebarSettings));
  }, [sidebarSettings]);

  return (
    <SidebarSettingContext.Provider
      value={{ sidebarSettings, setSidebarSettings }}
    >
      {children}
    </SidebarSettingContext.Provider>
  );
};

export const useSidebarSetting = () => useContext(SidebarSettingContext);
