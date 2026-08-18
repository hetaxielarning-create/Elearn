import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { getStudents, getCourses, getAllResults } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, results: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [studentsRes, coursesRes, resultsRes] = await Promise.all([
          getStudents(),
          getCourses(),
          getAllResults(),
        ]);
        setStats({
          students: studentsRes.data.length,
          courses: coursesRes.data.length,
          results: resultsRes.data.length,
        });
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
      <h1>Admin Dashboard</h1>
      <AdminNav />

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading stats...</p>}

      {!loading && (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-number">{stats.students}</div>
            <div>Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.courses}</div>
            <div>Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.results}</div>
            <div>Quiz Attempts</div>
          </div>
        </div>
      )}
    </div>
  );
}
