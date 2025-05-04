// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Contexts/AuthContext";
import { EditResumeProvider } from "./Contexts/EditResumeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EditResumeProvider>
          <App />
        </EditResumeProvider>
      </AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  </React.StrictMode>
);
