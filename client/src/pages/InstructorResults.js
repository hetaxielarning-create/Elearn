import React, { useEffect, useState } from "react";
import InstructorNav from "../components/InstructorNav";
import {
  getMyCourses,
  getInstructorCourseResults,
  getInstructorCourseProgress,
} from "../services/api";
import { formatDate, capitalize, getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function InstructorResults() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
        if (res.data.length > 0) setSelectedCourse(res.data[0]._id);
        else setLoading(false);
      } catch (err) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    async function load() {
      if (!selectedCourse) return;
      setLoading(true);
      try {
        const [resultsRes, progressRes] = await Promise.all([
          getInstructorCourseResults(selectedCourse),
          getInstructorCourseProgress(selectedCourse),
        ]);
        setResults(resultsRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCourse]);

  return (
    <div className="container">
      <h1>Student Results &amp; Progress</h1>
      <InstructorNav />

      {error && <p className="form-error">{error}</p>}

      <label>Course</label>
      <select
        className="search-input"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      <h2 className="section-heading">Quiz Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="muted">No quiz attempts yet for this course.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td>{r.quiz?.title}</td>
                <td>
                  {r.score}/{r.totalQuestions} ({r.percentage}%)
                </td>
                <td>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-heading">Student Progress</h2>
      {loading ? (
        <p>Loading...</p>
      ) : progress.length === 0 ? (
        <p className="muted">No progress recorded yet for this course.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Latest Score</th>
              <th>Latest Level</th>
              <th>Quizzes Attempted</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => (
              <tr key={p._id}>
                <td>{p.student?.name}</td>
                <td>{p.latestScore != null ? `${p.latestScore}%` : "-"}</td>
                <td>{p.latestLevel ? capitalize(p.latestLevel) : "-"}</td>
                <td>{p.quizzesAttempted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
