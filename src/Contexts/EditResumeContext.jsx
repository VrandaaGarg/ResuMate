// src/Contexts/EditResumeContext.jsx
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const EditResumeContext = createContext();

export const EditResumeProvider = ({ children }) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditing = useCallback(() => {
    setIsEditable((prev) => !prev);
  }, []);

  const contextValue = useMemo(() => ({
    isEditable,
    toggleEditing,
  }), [isEditable, toggleEditing]);

  return (
    <EditResumeContext.Provider value={contextValue}>
      {children}
    </EditResumeContext.Provider>
  );
};

export const useEditResume = () => useContext(EditResumeContext);
