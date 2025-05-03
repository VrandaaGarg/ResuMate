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
import ResumeEditor from "./Pages/ResumeEditor";
import Resumes from "./Pages/Resumes";
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
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="resume/:resumeId" element={<ResumeEditor />} />
      </Route>
    </Routes>
  );
};

export default App;
