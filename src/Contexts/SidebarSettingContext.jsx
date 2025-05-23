// src/Contexts/SidebarSettingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSidebarSettings, editSidebarSettings } from "../config/database";

const SidebarSettingContext = createContext();

export const SidebarSettingProvider = ({ children }) => {
  const [sidebarSettings, setSidebarSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch settings from Firestore on load
  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSidebarSettings();
      if (data) setSidebarSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  // Sync changes to Firestore
  useEffect(() => {
    if (!loading) editSidebarSettings(sidebarSettings);
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
