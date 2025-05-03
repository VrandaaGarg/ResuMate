// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import HomeLayout from './Layouts/HomeLayout';
import DashboardLayout from './Layouts/DashboardLayout';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import ProfileForm from './Pages/ProfileForm';
import ResumeList from './Pages/ResumeList';
// import TemplateGallery from './Pages/TemplateGallery';
import ProtectedRoute from './Contexts/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="resumes" element={<ResumeList />} />
        {/* <Route path="templates" element={<TemplateGallery />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
