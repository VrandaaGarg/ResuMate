// src/Components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
