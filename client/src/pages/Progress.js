import React, { useEffect, useState } from "react";
import { getMyProgress } from "../services/api";
import { formatDate, capitalize, getErrorMessage } from "../utils/helpers";
import "../styles/Dashboard.css";

export default function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyProgress();
        setProgress(res.data);
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
      <h1>My Progress</h1>

      {loading && <p>Loading progress...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && progress.length === 0 && (
        <p className="muted">
          No progress yet — attempt a quiz in any course to see it tracked
          here.
        </p>
      )}

      <div className="grid">
        {progress.map((p) => (
          <div key={p._id} className="card">
            <h4>{p.course?.title || "Course"}</h4>
            {p.course?.category && (
              <span className="badge">{p.course.category}</span>
            )}
            <p>
              Latest score: {p.latestScore != null ? `${p.latestScore}%` : "-"}
            </p>
            <p>
              Latest level:{" "}
              {p.latestLevel ? capitalize(p.latestLevel) : "-"}
            </p>
            <p>Quizzes attempted: {p.quizzesAttempted}</p>
            <p className="muted">
              Last attempt: {formatDate(p.lastAttemptDate)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
