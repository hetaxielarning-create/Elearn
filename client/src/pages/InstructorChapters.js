import React, { useEffect, useState } from "react";
import InstructorNav from "../components/InstructorNav";
import {
  getMyCourses,
  getChaptersByCourse,
  createChapter,
  updateChapter,
  deleteChapter,
  addTopic,
  updateTopic,
  deleteTopic,
  addSubtopic,
  updateSubtopic,
  deleteSubtopic,
} from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

// Reorganized around the requested hierarchy: Course -> Chapter -> Topic ->
// Subtopic, with the currently selected Course/Chapter shown as a
// breadcrumb so it's always clear what you're adding to. Every level now
// has Add, Edit, and Delete (previously only Add + Delete existed).
export default function InstructorChapters() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");

  const [topicDrafts, setTopicDrafts] = useState({});
  const [editingTopic, setEditingTopic] = useState(null); // { chapterId, topicId }
  const [editingTopicTitle, setEditingTopicTitle] = useState("");

  const [subtopicDrafts, setSubtopicDrafts] = useState({});
  const [editingSubtopic, setEditingSubtopic] = useState(null); // { chapterId, topicId, subtopicId }
  const [editingSubtopicTitle, setEditingSubtopicTitle] = useState("");

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

  async function loadChapters(courseId) {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await getChaptersByCourse(courseId);
      setChapters(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCourse) loadChapters(selectedCourse);
  }, [selectedCourse]);

  const currentCourseName = courses.find((c) => c._id === selectedCourse)?.title;

  // ---------- Chapters ----------
  async function handleAddChapter(e) {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    try {
      await createChapter({ course: selectedCourse, title: newChapterTitle, order: chapters.length });
      setNewChapterTitle("");
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEditChapter(chapter) {
    setEditingChapterId(chapter._id);
    setEditingChapterTitle(chapter.title);
  }

  async function saveChapterEdit(chapterId) {
    if (!editingChapterTitle.trim()) return;
    try {
      await updateChapter(chapterId, { title: editingChapterTitle });
      setEditingChapterId(null);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteChapter(chapterId) {
    if (!window.confirm("Delete this chapter and everything inside it?")) return;
    try {
      await deleteChapter(chapterId);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  // ---------- Topics ----------
  async function handleAddTopic(chapterId) {
    const title = topicDrafts[chapterId];
    if (!title?.trim()) return;
    try {
      await addTopic(chapterId, { title });
      setTopicDrafts({ ...topicDrafts, [chapterId]: "" });
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEditTopic(chapterId, topic) {
    setEditingTopic({ chapterId, topicId: topic._id });
    setEditingTopicTitle(topic.title);
  }

  async function saveTopicEdit() {
    if (!editingTopicTitle.trim()) return;
    try {
      await updateTopic(editingTopic.chapterId, editingTopic.topicId, { title: editingTopicTitle });
      setEditingTopic(null);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteTopic(chapterId, topicId) {
    if (!window.confirm("Delete this topic and its subtopics?")) return;
    try {
      await deleteTopic(chapterId, topicId);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  // ---------- Subtopics ----------
  async function handleAddSubtopic(chapterId, topicId) {
    const key = `${chapterId}-${topicId}`;
    const draft = subtopicDrafts[key];
    if (!draft?.title?.trim()) return;
    try {
      await addSubtopic(chapterId, topicId, { title: draft.title, content: draft.content || "" });
      setSubtopicDrafts({ ...subtopicDrafts, [key]: { title: "", content: "" } });
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function startEditSubtopic(chapterId, topicId, subtopic) {
    setEditingSubtopic({ chapterId, topicId, subtopicId: subtopic._id });
    setEditingSubtopicTitle(subtopic.title);
  }

  async function saveSubtopicEdit() {
    if (!editingSubtopicTitle.trim()) return;
    try {
      await updateSubtopic(
        editingSubtopic.chapterId,
        editingSubtopic.topicId,
        editingSubtopic.subtopicId,
        { title: editingSubtopicTitle }
      );
      setEditingSubtopic(null);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteSubtopic(chapterId, topicId, subtopicId) {
    try {
      await deleteSubtopic(chapterId, topicId, subtopicId);
      await loadChapters(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>Chapters, Topics &amp; Subtopics</h1>
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

      {currentCourseName && (
        <p className="muted" style={{ marginTop: -8 }}>
          Managing content for: <strong>{currentCourseName}</strong>
        </p>
      )}

      <form className="admin-form" onSubmit={handleAddChapter}>
        <h3>+ Add Chapter</h3>
        <input
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="Chapter title"
          required
        />
        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit">
            Add Chapter
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <p className="muted">No chapters yet — add one above.</p>
      ) : (
        chapters.map((chapter) => (
          <div key={chapter._id} className="card">
            {/* ---- Chapter row: view or edit ---- */}
            {editingChapterId === chapter._id ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={editingChapterTitle}
                  onChange={(e) => setEditingChapterTitle(e.target.value)}
                  style={{ flex: 1, padding: 6 }}
                />
                <button className="btn btn-primary" onClick={() => saveChapterEdit(chapter._id)}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingChapterId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>📘 {chapter.title}</h3>
                <div>
                  <button className="icon-btn edit" onClick={() => startEditChapter(chapter)}>
                    Edit
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDeleteChapter(chapter._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* ---- Topics under this chapter ---- */}
            {chapter.topics?.map((topic) => (
              <div key={topic._id} style={{ marginLeft: 20, marginTop: 14, borderLeft: "3px solid #ecf0f1", paddingLeft: 12 }}>
                {editingTopic?.topicId === topic._id ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={editingTopicTitle}
                      onChange={(e) => setEditingTopicTitle(e.target.value)}
                      style={{ flex: 1, padding: 6 }}
                    />
                    <button className="btn btn-primary" onClick={saveTopicEdit}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingTopic(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>📄 {topic.title}</strong>
                    <div>
                      <button className="icon-btn edit" onClick={() => startEditTopic(chapter._id, topic)}>
                        Edit
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteTopic(chapter._id, topic._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* ---- Subtopics under this topic ---- */}
                <ul style={{ marginTop: 8 }}>
                  {topic.subtopics?.map((sub) => (
                    <li key={sub._id} style={{ marginBottom: 6 }}>
                      {editingSubtopic?.subtopicId === sub._id ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            value={editingSubtopicTitle}
                            onChange={(e) => setEditingSubtopicTitle(e.target.value)}
                            style={{ flex: 1, padding: 6 }}
                          />
                          <button className="btn btn-primary" onClick={saveSubtopicEdit}>
                            Save
                          </button>
                          <button className="btn btn-secondary" onClick={() => setEditingSubtopic(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>• {sub.title}</span>
                          <span>
                            <button
                              className="icon-btn edit"
                              onClick={() => startEditSubtopic(chapter._id, topic._id, sub)}
                            >
                              Edit
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() => handleDeleteSubtopic(chapter._id, topic._id, sub._id)}
                            >
                              Delete
                            </button>
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* ---- Add subtopic, right under this topic's own subtopics ---- */}
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <input
                    type="text"
                    placeholder={`+ New subtopic under "${topic.title}"`}
                    value={subtopicDrafts[`${chapter._id}-${topic._id}`]?.title || ""}
                    onChange={(e) =>
                      setSubtopicDrafts({
                        ...subtopicDrafts,
                        [`${chapter._id}-${topic._id}`]: {
                          ...subtopicDrafts[`${chapter._id}-${topic._id}`],
                          title: e.target.value,
                        },
                      })
                    }
                    style={{ flex: 1, padding: 6 }}
                  />
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleAddSubtopic(chapter._id, topic._id)}
                  >
                    + Subtopic
                  </button>
                </div>
              </div>
            ))}

            {/* ---- Add topic, right under this chapter's own topics ---- */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, marginLeft: 20 }}>
              <input
                type="text"
                placeholder={`+ New topic under "${chapter.title}"`}
                value={topicDrafts[chapter._id] || ""}
                onChange={(e) => setTopicDrafts({ ...topicDrafts, [chapter._id]: e.target.value })}
                style={{ flex: 1, padding: 6 }}
              />
              <button className="btn btn-secondary" type="button" onClick={() => handleAddTopic(chapter._id)}>
                + Topic
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
