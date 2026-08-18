import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isAuthenticated, isAdmin, isInstructor, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        E-Learn
      </Link>

      <div className="navbar-links">
        <Link to="/courses">Courses</Link>

        {isAuthenticated && !isAdmin && !isInstructor && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/certificates">Certificates</Link>
          </>
        )}

        {isAuthenticated && (
          <Link to="/notifications">Notifications</Link>
        )}

        {isAuthenticated && isInstructor && (
          <Link to="/instructor/dashboard">Instructor Dashboard</Link>
        )}

        {isAuthenticated && isAdmin && (
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        )}

        {isAuthenticated && (
          <Link to="/profile">Profile</Link>
        )}

        {isAuthenticated ? (
          <>
            <span className="navbar-user">Hi, {user?.name || "User"}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
