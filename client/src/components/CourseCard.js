import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="card course-card">
      <h3>{course.title}</h3>
      <p>{course.description?.slice(0, 100)}...</p>
      <Link to={`/courses/${course._id}`} className="btn btn-secondary">
        View Course
      </Link>
    </div>
  );
}
