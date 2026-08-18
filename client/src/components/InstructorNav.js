import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Admin.css";

export default function InstructorNav() {
  return (
    <nav className="admin-nav">
      <NavLink to="/instructor/dashboard">Dashboard</NavLink>
      <NavLink to="/instructor/courses">My Courses</NavLink>
      <NavLink to="/instructor/chapters">Chapters &amp; Topics</NavLink>
      <NavLink to="/instructor/materials">Materials</NavLink>
      <NavLink to="/instructor/quizzes">Quizzes</NavLink>
      <NavLink to="/instructor/results">Student Results</NavLink>
    </nav>
  );
}
