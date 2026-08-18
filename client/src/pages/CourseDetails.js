import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MaterialCard from "../components/MaterialCard";
import {
  checkEnrollment,
  enrollInCourse,
  getChaptersByCourse,
  getCourseById,
  getMaterialsByCourse,
  getQuizzesByCourse,
} from "../services/api";
import "../styles/Course.css";
import { capitalize, getErrorMessage } from "../utils/helpers";

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedChapters, setExpandedChapters] = useState(new Set());

  async function loadData() {
    try {
      const [courseRes, materialsRes, chaptersRes, quizzesRes, enrollRes] =
        await Promise.all([
          getCourseById(id),
          getMaterialsByCourse(id),
          getChaptersByCourse(id),
          getQuizzesByCourse(id),
          checkEnrollment(id),
        ]);
      setCourse(courseRes.data);
      setMaterials(materialsRes.data);
      setChapters(chaptersRes.data);
      setQuizzes(quizzesRes.data);
      setEnrolled(enrollRes.data.enrolled);
      if (chaptersRes.data.length > 0) {
        setExpandedChapters(new Set([chaptersRes.data[0]._id]));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleEnroll() {
    setEnrolling(true);
    setError("");
    try {
      await enrollInCourse(id);
      setEnrolled(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEnrolling(false);
    }
  }

  function toggleChapter(chapterId) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  }

  if (loading) return <p className="container">Loading course...</p>;
  if (error && !course) return <p className="container form-error">{error}</p>;
  if (!course) return <p className="container">Course not found.</p>;

  const materialsForTopic = (topicId) => materials.filter((m) => m.topicId === topicId);
  const materialsForSubtopic = (subtopicId) => materials.filter((m) => m.subtopicId === subtopicId);
  const untaggedMaterials = materials.filter((m) => !m.topicId && !m.subtopicId);

  const quizzesForTopic = (topicId) => {
    const list = quizzes.filter((q) => q.topicId === topicId);
    const grouped = {};
    LEVEL_ORDER.forEach((lvl) => {
      const atLevel = list.filter((q) => (q.level || "beginner") === lvl);
      if (atLevel.length) grouped[lvl] = atLevel;
    });
    return grouped;
  };
  const untaggedQuizzes = quizzes.filter((q) => !q.topicId);

  return (
    <div className="container">
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {error && <p className="form-error">{error}</p>}

      {!enrolled && (
        <button className="btn btn-primary" onClick={handleEnroll} disabled={enrolling}>
          {enrolling ? "Enrolling..." : "Enroll in this Course"}
        </button>
      )}

      {chapters.length > 0 && (
        <>
          <h2 className="section-heading">Course Content</h2>
          {chapters.map((chapter) => {
            const isOpen = expandedChapters.has(chapter._id);
            return (
              <div key={chapter._id} className="chapter-block">
                <button
                  className="chapter-header"
                  onClick={() => toggleChapter(chapter._id)}
                  type="button"
                >
                  <span>📘 {chapter.title}</span>
                  <span className="chapter-toggle">{isOpen ? "▲ Collapse" : "▼ Expand"}</span>
                </button>

                {isOpen && (
                  <div className="chapter-body">
                    {chapter.topics?.length === 0 && (
                      <p className="muted" style={{ marginLeft: 8 }}>No topics added yet.</p>
                    )}
                    {chapter.topics?.map((topic) => {
                      const groupedQuizzes = quizzesForTopic(topic._id);
                      return (
                        <div key={topic._id} className="topic-block">
                          <strong>📄 {topic.title}</strong>

                          {materialsForTopic(topic._id).length > 0 && (
                            <div className="grid" style={{ marginTop: 8 }}>
                              {materialsForTopic(topic._id).map((m) => (
                                <MaterialCard key={m._id} material={m} />
                              ))}
                            </div>
                          )}

                          {Object.keys(groupedQuizzes).length > 0 && enrolled && (
                            <div style={{ marginTop: 10 }}>
                              {LEVEL_ORDER.filter((lvl) => groupedQuizzes[lvl]).map((lvl) => (
                                <div key={lvl} style={{ marginTop: 6 }}>
                                  <span className="badge">{capitalize(lvl)}</span>
                                  {groupedQuizzes[lvl].map((q) => (
                                    <Link
                                      key={q._id}
                                      to={`/courses/${id}/quiz/${q._id}`}
                                      className="btn btn-secondary"
                                      style={{ marginLeft: 8, marginTop: 4, display: "inline-block" }}
                                    >
                                      {q.title}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}

                          {topic.subtopics?.length > 0 && (
                            <div className="subtopic-list">
                              {topic.subtopics.map((sub) => (
                                <div key={sub._id} className="subtopic-block">
                                  <span>• {sub.title}</span>
                                  {materialsForSubtopic(sub._id).length > 0 && (
                                    <div className="grid" style={{ marginTop: 8 }}>
                                      {materialsForSubtopic(sub._id).map((m) => (
                                        <MaterialCard key={m._id} material={m} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {enrolled && untaggedQuizzes.length > 0 && (
        <>
          <h2 className="section-heading">Other Quizzes</h2>
          <div className="grid">
            {untaggedQuizzes.map((q) => (
              <div key={q._id} className="card">
                <h4>{q.title}</h4>
                <span className="badge">{capitalize(q.level || "beginner")}</span>
                <p className="muted">{q.questions?.length || 0} questions</p>
                <Link to={`/courses/${id}/quiz/${q._id}`} className="btn btn-primary">
                  Attempt Quiz
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="section-heading">Learning Materials</h2>
      {untaggedMaterials.length === 0 && materials.length > 0 && (
        <p className="muted">
          All materials for this course are linked to specific topics above.
        </p>
      )}
      {materials.length === 0 && (
        <p className="muted">No materials added yet for this course.</p>
      )}
      {/* <div className="grid">
        {untaggedMaterials.map((m) => (
          <MaterialCard key={m._id} material={m} />
        ))}
      </div> */}
      <div className="materials-list">
        {untaggedMaterials.map((m) => (
          <MaterialCard key={m._id} material={m} />
        ))}
      </div>
      
    </div>
  );
}