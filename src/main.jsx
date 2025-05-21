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
                    <div className="overflow-x-hidden [font-family:'Raleway',sans-serif]">
                      <App />
                    </div>
                  </EditResumeProvider>
                </SidebarSettingProvider>
              </ClassicSettingProvider>
            </StandardSettingProvider>
          </ModernSettingProvider>
        </ResumeDataProvider>
      </AuthProvider>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#f0f9ff",
            color: "#0369a1",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
            padding: "12px 16px",
            fontWeight: "500",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
