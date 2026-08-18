import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page element with this to require login.
// adminOnly: only admins may pass.
// instructorOnly: instructors OR admins may pass (admins can see everything).
export default function ProtectedRoute({
  children,
  adminOnly = false,
  instructorOnly = false,
}) {
  const { isAuthenticated, isAdmin, isInstructor, loading } = useAuth();

  if (loading) return <p className="page-loading">Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (instructorOnly && !isInstructor && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
