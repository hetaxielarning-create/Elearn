import React, { useEffect, useState } from "react";
import InstructorNav from "../components/InstructorNav";
import {
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
} from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

const emptyForm = { title: "", description: "", category: "" };

// Same as the admin course page, but only shows courses created by this instructor

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCourses() {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        getMyCourses(),
        getCategories(),
      ]);
      setCourses(coursesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(course) {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await updateCourse(editingId, form);
      } else {
        await createCourse(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>My Courses</h1>
      <InstructorNav />

      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Course" : "Add New Course"}</h3>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
        />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="muted" style={{ fontSize: "0.8rem" }}>
            No categories yet — ask your admin to add one.
          </p>
        )}

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Course" : "Add Course"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(c._id)}>
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
