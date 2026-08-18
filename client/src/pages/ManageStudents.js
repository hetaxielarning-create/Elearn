import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getStudents,
  deleteStudent,
  toggleUserActive,
  getAllResults,
} from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [studentsRes, resultsRes] = await Promise.all([
        getStudents(),
        getAllResults(),
      ]);
      setStudents(studentsRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Remove this student account? This cannot be undone."))
      return;
    try {
      await deleteStudent(id);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleToggleActive(id) {
    try {
      await toggleUserActive(id);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function resultsForStudent(studentId) {
    return results.filter((r) => r.student?._id === studentId);
  }

  return (
    <div className="container">
      <h1>Manage Students</h1>
      <AdminNav />

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Quiz Attempts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{formatDate(s.createdAt)}</td>
                <td>{s.isActive === false ? "Deactivated" : "Active"}</td>
                <td>{resultsForStudent(s._id).length}</td>
                <td>
                  <button
                    className="icon-btn edit"
                    onClick={() => handleToggleActive(s._id)}
                  >
                    {s.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(s._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section-heading">All Quiz Results</h2>
      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <p className="muted">No quiz attempts yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Level</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td>{r.course?.title}</td>
                <td>{r.quiz?.title}</td>
                <td>
                  {r.score}/{r.totalQuestions} ({r.percentage}%)
                </td>
                <td>{r.recommendedLevel}</td>
                <td>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
