// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Or "user" if you store user info

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the protected page
  return children;
};

export default ProtectedRoute;

