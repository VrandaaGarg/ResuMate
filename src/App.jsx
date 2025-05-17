import { Routes, Route } from "react-router-dom";
import HomeLayout from "./Layouts/HomeLayout";
import DashboardLayout from "./Layouts/DashboardLayout";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import ResumeForm from "./Pages/ResumeForm";
import ProtectedRoute from "./Contexts/ProtectedRoute";
import Resume from "./Pages/Resume";

import Templates from "./Pages/Templates";
const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Protected Routes - no /dashboard prefix */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-form" element={<ResumeForm />} />
        <Route path="/resume" element={<Resume />} />

        <Route path="/templates" element={<Templates />} />
      </Route>
    </Routes>
  );
};

export default App;
