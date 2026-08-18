import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Admin.css";

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/analytics">Analytics</NavLink>
      <NavLink to="/admin/courses">Courses</NavLink>
      <NavLink to="/admin/categories">Categories</NavLink>
      <NavLink to="/admin/chapters">Chapters &amp; Topics</NavLink>
      <NavLink to="/admin/materials">Materials</NavLink>
      <NavLink to="/admin/quizzes">Quizzes</NavLink>
      <NavLink to="/admin/rules">Recommendation Rules</NavLink>
      <NavLink to="/admin/students">Students</NavLink>
      <NavLink to="/admin/instructors">Instructors</NavLink>
      <NavLink to="/admin/certificates">Certificates</NavLink>
      <NavLink to="/admin/announcements">Announcements</NavLink>
    </nav>
  );
}
