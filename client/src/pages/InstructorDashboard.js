import React, { useEffect, useState } from "react";
import InstructorNav from "../components/InstructorNav";
import { getMyCourses } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container">
      <h1>Instructor Dashboard</h1>
      <InstructorNav />

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-number">{courses.length}</div>
            <div>My Courses</div>
          </div>
        </div>
      )}

      <h2 className="section-heading">My Courses</h2>
      <div className="grid">
        {courses.map((c) => (
          <div key={c._id} className="card">
            <h4>{c.title}</h4>
            <p>{c.description?.slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
