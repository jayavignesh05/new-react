// ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to={'/login'} replace />;
  }
  // If authenticated, render the Outlet, which will render the nested routes
  return <Outlet />;
};

export default ProtectedRoutes;