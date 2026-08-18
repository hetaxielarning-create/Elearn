import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { getAnalyticsOverview } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAnalyticsOverview();
        setData(res.data);
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
      <h1>Analytics</h1>
      <AdminNav />

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading analytics...</p>}

      {data && (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-number">{data.counts.students}</div>
              <div>Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.counts.instructors}</div>
              <div>Instructors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.counts.courses}</div>
              <div>Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.counts.quizzes}</div>
              <div>Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.counts.quizAttempts}</div>
              <div>Quiz Attempts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.averageScore}%</div>
              <div>Average Score</div>
            </div>
          </div>

          <h2 className="section-heading">Recommendation Level Breakdown</h2>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#e67e22" }}>
                {data.levelBreakdown.beginner}
              </div>
              <div>Beginner</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#2980b9" }}>
                {data.levelBreakdown.intermediate}
              </div>
              <div>Intermediate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#27ae60" }}>
                {data.levelBreakdown.advanced}
              </div>
              <div>Advanced</div>
            </div>
          </div>

          <h2 className="section-heading">Most Attempted Courses</h2>
          {data.topCourses.length === 0 ? (
            <p className="muted">No quiz attempts recorded yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {data.topCourses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.title}</td>
                    <td>{c.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
