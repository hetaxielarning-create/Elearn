import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourses, getMyProgress } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Dashboard.css";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, progressRes] = await Promise.all([
          getCourses(),
          getMyProgress(),
        ]);
        setCourses(coursesRes.data.slice(0, 4));
        setProgress(progressRes.data.slice(0, 3));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container">
      <h1>Welcome back{user?.name ? `, ${user.name}` : ""}</h1>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading dashboard...</p>}

      <section className="dashboard-section">
        <h2>Your Progress</h2>
        {progress.length === 0 && !loading && (
          <p className="muted">
            No progress yet — attempt a quiz to get started.
          </p>
        )}
        <div className="grid">
          {progress.map((p) => (
            <div key={p._id} className="card">
              <h4>{p.course?.title || "Course"}</h4>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${p.courseProgress || 0}%` }}
                />
              </div>
            <p>{p.courseProgress || 0}% complete</p>      
            <p>
            {p.completedQuizzes || 0} of {p.totalQuizzes || 0} quizzes completed
            </p>  
          </div>
          ))}
        </div>
        <Link to="/progress" className="link-more">
          View full progress &rarr;
        </Link>
      </section>

      <section className="dashboard-section">
        <h2>Available Courses</h2>
        <div className="grid">
          {courses.map((course) => (
            <div key={course._id} className="card">
              <h4>{course.title}</h4>
              <p>{course.description?.slice(0, 80)}...</p>
              <Link to={`/courses/${course._id}`} className="btn btn-secondary">
                Open
              </Link>
            </div>
          ))}
        </div>
        <Link to="/courses" className="link-more">
          Browse all courses &rarr;
        </Link>
      </section>

      <section className="dashboard-section dashboard-cta">
        <Link to="/recommendations" className="btn btn-primary">
          View My Recommendations
        </Link>
      </section>
    </div>
  );
}
