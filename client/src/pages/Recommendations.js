import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCourses, getRecommendationForCourse } from "../services/api";
import RecommendationCard from "../components/RecommendationCard";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Dashboard.css";


// Shows the latest recommendation for a course
// after the student has attempted a quiz
export default function Recommendations() {
  const location = useLocation();
  const courseIdFromQuiz = location.state?.courseId;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
  if (courseIdFromQuiz && courses.length > 0) {
    handleSelectCourse(courseIdFromQuiz);
  }
}, [courseIdFromQuiz, courses]);

  async function handleSelectCourse(courseId) {
    setSelectedCourse(courseId);
    setRecommendation(null);
    setError("");
    if (!courseId) return;

    setFetching(true);
    try {
      const res = await getRecommendationForCourse(courseId);
      setRecommendation(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="container">
      <h1>My Recommendations</h1>
      <p className="muted">
        Pick a course you've attempted a quiz in to see your latest
        rule-based recommendation.
      </p>

      {loading && <p>Loading courses...</p>}

      {!loading && (
        <select
          className="search-input"
          value={selectedCourse}
          onChange={(e) => handleSelectCourse(e.target.value)}
        >
          <option value="">-- Select a course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      )}

      {fetching && <p>Loading recommendation...</p>}
      {error && <p className="form-error">{error}</p>}

      {recommendation && (
        <>
          <RecommendationCard recommendation={recommendation} />

          <h2 className="section-heading">Recommended Materials</h2>
          {recommendation.materials?.length === 0 && (
            <p className="muted">No materials tagged at this level yet.</p>
          )}
          <div className="materials-list">
            {recommendation.materials?.map((m) => (
              <div key={m._id} className="card">
                <h4>{m.title}</h4>
                <span className="badge">{m.type}</span>
                <p className="material-content">{m.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
