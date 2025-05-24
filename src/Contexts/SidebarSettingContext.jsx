// src/Contexts/SidebarSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSidebarSettings } from "../db/database";

const SidebarSettingContext = createContext();

export const SidebarSettingProvider = ({ children }) => {
  const LOCAL_KEY = "SideBarTemplateSetting";

  const [sidebarSettings, setSidebarSettings] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const cloudData = await getSidebarSettings();
      // Use Firestore only if nothing in localStorage
      if (!localStorage.getItem(LOCAL_KEY) && cloudData) {
        setSidebarSettings(cloudData);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(sidebarSettings));
  }, [sidebarSettings]);

  return (
    <SidebarSettingContext.Provider
      value={{ sidebarSettings, setSidebarSettings }}
    >
      {!loading && children}
    </SidebarSettingContext.Provider>
  );
};

export const useSidebarSetting = () => useContext(SidebarSettingContext);
