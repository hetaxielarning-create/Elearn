import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getCourses,
  getMaterialsByCourse,
  getChaptersByCourse,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

const emptyForm = {
  course: "",
  title: "",
  type: "text",
  content: "",
  level: "beginner",
  chapter: "",
  topicId: "",
  subtopicId: "",
};

export default function ManageMaterials() {
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  async function loadMaterials(courseId) {
    if (!courseId) return;
    setLoading(true);
    try {
      const [materialsRes, chaptersRes] = await Promise.all([
        getMaterialsByCourse(courseId),
        getChaptersByCourse(courseId),
      ]);
      setMaterials(materialsRes.data);
      setChapters(chaptersRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      setForm((f) => ({ ...f, course: selectedCourse }));
      loadMaterials(selectedCourse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Changing the chapter resets topic/subtopic, since they belong to
  // whichever chapter was previously selected.
  function handleChapterChange(e) {
    setForm({ ...form, chapter: e.target.value, topicId: "", subtopicId: "" });
  }
  function handleTopicChange(e) {
    setForm({ ...form, topicId: e.target.value, subtopicId: "" });
  }

  function startEdit(material) {
    setEditingId(material._id);
    setFile(null);
    setForm({
      course: material.course,
      title: material.title,
      type: material.type,
      content: material.content || "",
      level: material.level,
      chapter: material.chapter || "",
      topicId: material.topicId || "",
      subtopicId: material.subtopicId || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFile(null);
    setForm({ ...emptyForm, course: selectedCourse });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!file && !form.content.trim()) {
      setError("Either upload a file or paste a link/text in Content.");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("course", form.course);
      payload.append("title", form.title);
      payload.append("type", form.type);
      payload.append("level", form.level);
      if (form.content) payload.append("content", form.content);
      if (file) payload.append("file", file);
      if (form.chapter) payload.append("chapter", form.chapter);
      if (form.topicId) payload.append("topicId", form.topicId);
      if (form.subtopicId) payload.append("subtopicId", form.subtopicId);

      if (editingId) {
        await updateMaterial(editingId, payload);
      } else {
        await createMaterial(payload);
      }
      setForm({ ...emptyForm, course: selectedCourse });
      setFile(null);
      setEditingId(null);
      await loadMaterials(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this material?")) return;
    try {
      await deleteMaterial(id);
      await loadMaterials(selectedCourse);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const selectedChapter = chapters.find((c) => c._id === form.chapter);
  const selectedTopic = selectedChapter?.topics?.find((t) => t._id === form.topicId);

  return (
    <div className="container">
      <h1>Manage Learning Materials</h1>
      <AdminNav />

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

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Material" : "Add New Material"}</h3>

        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="text">Text / Note</option>
          <option value="note">Note</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>

        <label>Attach to Chapter (optional)</label>
        <select value={form.chapter} onChange={handleChapterChange}>
          <option value="">-- Not linked to a chapter (flat list) --</option>
          {chapters.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {selectedChapter && (
          <>
            <label>Topic (optional)</label>
            <select value={form.topicId} onChange={handleTopicChange}>
              <option value="">-- Whole chapter, no specific topic --</option>
              {selectedChapter.topics?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedTopic && (
          <>
            <label>Subtopic (optional)</label>
            <select
              value={form.subtopicId}
              onChange={(e) => setForm({ ...form, subtopicId: e.target.value })}
            >
              <option value="">-- Whole topic, no specific subtopic --</option>
              {selectedTopic.subtopics?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
          </>
        )}

        {editingId && form.content && !file && (
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Currently attached: {form.content}
          </p>
        )}

        <label>Upload File (PDF, PPT/PPTX, DOC/DOCX, MP4, image — max 20MB)</label>
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.png,.jpg,.jpeg"
          onChange={(e) => {
            const selected = e.target.files[0] || null;
            setFile(selected);
            if (selected) setForm((f) => ({ ...f, content: "" }));
          }}
        />
        {file && (
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Selected: {file.name} (this will replace any existing link/file)
          </p>
        )}

        <label>Or paste a link / plain text (used only if no file is selected above)</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={2}
          placeholder="https://... or plain note text"
          disabled={!!file}
        />

        <label>Level (used by the recommendation engine)</label>
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add Material"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading materials...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Level</th>
              <th>Linked To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m._id}>
                <td>{m.title}</td>
                <td>{m.type}</td>
                <td>{m.level}</td>
                <td>{m.topicId || m.subtopicId ? "Topic/Subtopic" : m.chapter ? "Chapter" : "—"}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => startEdit(m)}>
                    Edit
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(m._id)}
                  >
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
