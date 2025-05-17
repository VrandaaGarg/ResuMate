// src/Contexts/EditResumeContext.jsx
import React, { createContext, useContext, useState } from "react";

const EditResumeContext = createContext();

export const EditResumeProvider = ({ children }) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditing = () => setIsEditable((prev) => !prev);

  return (
    <EditResumeContext.Provider value={{ isEditable, toggleEditing }}>
      {children}
    </EditResumeContext.Provider>
  );
};

export const useEditResume = () => useContext(EditResumeContext);
