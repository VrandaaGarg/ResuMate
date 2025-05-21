// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Contexts/AuthContext";
import { EditResumeProvider } from "./Contexts/EditResumeContext";
import { ResumeDataProvider } from "./Contexts/ResumeDataContext";
import { ClassicSettingProvider } from "./Contexts/ClassicSettingContext";
import { SidebarSettingProvider } from "./Contexts/SidebarSettingContext";
import { StandardSettingProvider } from "./Contexts/StandardSettingContext";
import { ModernSettingProvider } from "./Contexts/ModernSettingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeDataProvider>
          <ModernSettingProvider>
            <StandardSettingProvider>
              <ClassicSettingProvider>
                <SidebarSettingProvider>
                  <EditResumeProvider>
                    <div className="overflow-x-hidden">
                      <App />
                    </div>
                  </EditResumeProvider>
                </SidebarSettingProvider>
              </ClassicSettingProvider>
            </StandardSettingProvider>
          </ModernSettingProvider>
        </ResumeDataProvider>
      </AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  </React.StrictMode>
);
