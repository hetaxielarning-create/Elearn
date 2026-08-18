import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Course.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const res = await getCourses(search.trim() || undefined);
        setCourses(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    // Debounce so we don't hit the backend on every keystroke
    const timeout = setTimeout(loadCourses, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="container">
      <h1>All Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading courses...</p>}

      {!loading && courses.length === 0 && (
        <p className="muted">No courses found.</p>
      )}

      <div className="grid">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
