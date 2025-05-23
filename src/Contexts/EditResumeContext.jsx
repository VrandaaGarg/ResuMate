// src/Contexts/EditResumeContext.jsx
import React, { createContext, useContext, useState } from "react";
import showSuccessToast from "../Components/showSuccessToast";

const EditResumeContext = createContext();

export const EditResumeProvider = ({ children }) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditing = () => {
    setIsEditable((prev) => {
      const newState = !prev;
      if (!newState) showSuccessToast("Changes saved"); // only show when turning off edit mode
      return newState;
    });
  };

  return (
    <EditResumeContext.Provider value={{ isEditable, toggleEditing }}>
      {children}
    </EditResumeContext.Provider>
  );
};

export const useEditResume = () => useContext(EditResumeContext);
