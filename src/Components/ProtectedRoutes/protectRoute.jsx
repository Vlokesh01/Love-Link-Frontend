import React from "react";
import { Navigate } from "react-router-dom";

// Helper function to save user info to localStorage after login


// ProtectedRoute component for regular users
export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");

  // If no token, redirect to login
  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

