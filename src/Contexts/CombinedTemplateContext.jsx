import React, { createContext, useContext, useEffect, useState } from "react";
import { getClassicSettings } from "../db/database";

const CombinedTemplateContext = createContext();

export const CombinedTemplateProvider = ({ children }) => {
  const [classicSettings, setClassicSettings] = useState(() => {
    const stored = localStorage.getItem("ClassicTemplateSetting");
    return stored ? JSON.parse(stored) : {};
  });

  const [modernSettings, setModernSettings] = useState(() => {
    const local = localStorage.getItem("modernSettings");
    return local ? JSON.parse(local) : {};
  });

  const [standardSettings, setStandardSettings] = useState(() => {
    const local = localStorage.getItem("standardSettings");
    return local ? JSON.parse(local) : {};
  });

  const [sidebarSettings, setSidebarSettings] = useState(() => {
    const local = localStorage.getItem("sidebarSettings");
    return local ? JSON.parse(local) : {};
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const cloudData = await getClassicSettings();
      if (!localStorage.getItem("ClassicTemplateSetting") && cloudData) {
        setClassicSettings(cloudData);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem("ClassicTemplateSetting", JSON.stringify(classicSettings));
  }, [classicSettings]);

  useEffect(() => {
    localStorage.setItem("modernSettings", JSON.stringify(modernSettings));
  }, [modernSettings]);

  useEffect(() => {
    localStorage.setItem("standardSettings", JSON.stringify(standardSettings));
  }, [standardSettings]);

  useEffect(() => {
    localStorage.setItem("sidebarSettings", JSON.stringify(sidebarSettings));
  }, [sidebarSettings]);

  const value = {
    classicSettings,
    setClassicSettings,
    modernSettings,
    setModernSettings,
    standardSettings,
    setStandardSettings,
    sidebarSettings,
    setSidebarSettings,
  };

  return (
    <CombinedTemplateContext.Provider value={value}>
      {!loading && children}
    </CombinedTemplateContext.Provider>
  );
};

export const useClassicSetting = () => {
  const context = useContext(CombinedTemplateContext);
  if (!context) {
    throw new Error('useClassicSetting must be used within CombinedTemplateProvider');
  }
  return { 
    classicSettings: context.classicSettings || {}, 
    setClassicSettings: context.setClassicSettings 
  };
};

export const useModernSetting = () => {
  const context = useContext(CombinedTemplateContext);
  if (!context) {
    throw new Error('useModernSetting must be used within CombinedTemplateProvider');
  }
  return { 
    modernSettings: context.modernSettings || {}, 
    setModernSettings: context.setModernSettings 
  };
};

export const useStandardSetting = () => {
  const context = useContext(CombinedTemplateContext);
  if (!context) {
    throw new Error('useStandardSetting must be used within CombinedTemplateProvider');
  }
  return { 
    standardSettings: context.standardSettings || {}, 
    setStandardSettings: context.setStandardSettings 
  };
};

export const useSidebarSetting = () => {
  const context = useContext(CombinedTemplateContext);
  if (!context) {
    throw new Error('useSidebarSetting must be used within CombinedTemplateProvider');
  }
  return { 
    sidebarSettings: context.sidebarSettings || {}, 
    setSidebarSettings: context.setSidebarSettings 
  };
};