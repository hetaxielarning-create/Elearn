import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getCourses,
  getChaptersByCourse,
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";
import { getErrorMessage, capitalize } from "../utils/helpers";
import "../styles/Admin.css";

function newQuestion() {
  return {
    questionText: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
  };
}

const emptyMeta = { title: "", level: "beginner", chapter: "", topicId: "" };

export default function ManageQuizzes() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [meta, setMeta] = useState(emptyMeta);
  const [questions, setQuestions] = useState([newQuestion()]);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
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

  async function loadCourseData(courseId) {
    if (!courseId) return;
    setLoading(true);
    try {
      const [quizzesRes, chaptersRes] = await Promise.all([
        getQuizzesByCourse(courseId),
        getChaptersByCourse(courseId),
      ]);
      setQuizzes(quizzesRes.data);
      setChapters(chaptersRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCourse) loadCourseData(selectedCourse);
  }, [selectedCourse]);

  const selectedChapter = chapters.find((c) => c._id === meta.chapter);

  function handleMetaChange(e) {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  }
  function handleChapterChange(e) {
    setMeta({ ...meta, chapter: e.target.value, topicId: "" });
  }

  function updateQuestionText(index, value) {
    const next = [...questions];
    next[index].questionText = value;
    setQuestions(next);
  }
  function updateOption(qIndex, optIndex, value) {
    const next = [...questions];
    next[qIndex].options[optIndex] = value;
    setQuestions(next);
  }
  function setCorrectAnswer(qIndex, optIndex) {
    const next = [...questions];
    next[qIndex].correctAnswerIndex = optIndex;
    setQuestions(next);
  }
  function addQuestion() {
    setQuestions([...questions, newQuestion()]);
  }
  function removeQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function resetForm() {
    setMeta(emptyMeta);
    setQuestions([newQuestion()]);
    setEditingQuizId(null);
  }

  async function handleEditClick(quizId) {
    setError("");
    setLoadingQuiz(true);
    try {
      const res = await getQuizById(quizId);
      setEditingQuizId(res.data._id);
      setMeta({
        title: res.data.title,
        level: res.data.level || "beginner",
        chapter: res.data.chapter || "",
        topicId: res.data.topicId || "",
      });
      setQuestions(
        res.data.questions.map((q) => ({
          questionText: q.questionText,
          options: [...q.options],
          correctAnswerIndex: q.correctAnswerIndex,
        }))
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingQuiz(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const invalid = questions.some(
      (q) => !q.questionText.trim() || q.options.some((o) => !o.trim())
    );
    if (invalid) {
      setError("Every question needs text and all 4 options filled in.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: meta.title,
        level: meta.level,
        chapter: meta.chapter || undefined,
        topicId: meta.topicId || undefined,
        questions,
      };
      if (editingQuizId) {
        await updateQuiz(editingQuizId, payload);
      } else {
        await createQuiz({ course: selectedCourse, ...payload });
      }
      resetForm();
      await loadCourseData(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(id);
      if (editingQuizId === id) resetForm();
      await loadCourseData(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function topicLabel(quiz) {
    if (!quiz.topicId) return "—";
    const chapter = chapters.find((c) => c._id === quiz.chapter);
    const topic = chapter?.topics?.find((t) => t._id === quiz.topicId);
    return topic ? `${chapter.title} → ${topic.title}` : "—";
  }

  return (
    <div className="container">
      <h1>Manage Quizzes</h1>
      <AdminNav />

      {error && <p className="form-error">{error}</p>}

      <label>Course</label>
      <select
        className="search-input"
        value={selectedCourse}
        onChange={(e) => {
          setSelectedCourse(e.target.value);
          resetForm();
        }}
      >
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      <form className="admin-form" style={{ maxWidth: 640 }} onSubmit={handleSubmit}>
        <h3>{editingQuizId ? "Edit Quiz" : "Create New Quiz"}</h3>
        {loadingQuiz && <p className="muted">Loading quiz...</p>}

        <label>Quiz Title</label>
        <input name="title" value={meta.title} onChange={handleMetaChange} required />

        <label>Difficulty Level</label>
        <select name="level" value={meta.level} onChange={handleMetaChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label>Attach to Chapter (optional)</label>
        <select value={meta.chapter} onChange={handleChapterChange}>
          <option value="">-- Not linked to a chapter --</option>
          {chapters.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {selectedChapter && (
          <>
            <label>Topic (optional)</label>
            <select
              value={meta.topicId}
              onChange={(e) => setMeta({ ...meta, topicId: e.target.value })}
            >
              <option value="">-- Whole chapter, no specific topic --</option>
              {selectedChapter.topics?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </>
        )}

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <label>Question {qIndex + 1}</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              placeholder="Question text"
              required
            />

            <p className="muted" style={{ fontSize: "0.8rem", marginTop: 10 }}>
              Fill in all 4 options, then click the radio button next to the
              correct one.
            </p>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="option-row">
                <span className="option-label">Option {optIndex + 1}</span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                  placeholder={`Option ${optIndex + 1} text`}
                  required
                />
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === optIndex}
                  onChange={() => setCorrectAnswer(qIndex, optIndex)}
                  title="Mark as correct answer"
                />
              </div>
            ))}

            {questions.length > 1 && (
              <button
                type="button"
                className="icon-btn delete"
                style={{ marginTop: 8 }}
                onClick={() => removeQuestion(qIndex)}
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <div className="admin-form-actions">
          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Add Question
          </button>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingQuizId ? "Update Quiz" : "Create Quiz"}
          </button>
          {editingQuizId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Topic</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q._id}>
                <td>{q.title}</td>
                <td>{capitalize(q.level || "beginner")}</td>
                <td>{topicLabel(q)}</td>
                <td>{q.questions?.length || 0}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => handleEditClick(q._id)}>
                    View / Edit
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(q._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
