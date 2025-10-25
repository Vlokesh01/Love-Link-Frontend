import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component for regular users
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Helper function to save user info to localStorage after login
export function saveUserToLocalStorage(user) {
  localStorage.setItem("token", user.token);
  localStorage.setItem("userId", user._id);
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
}
