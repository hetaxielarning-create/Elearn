import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/api";
import "../styles/Admin.css";
import { getErrorMessage } from "../utils/helpers";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function startEdit(category) {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name, description });
      } else {
        await createCategory({ name, description });
      }
      cancelEdit();
      await loadCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category? Courses already using this name will keep the text, but it will no longer appear in the dropdown.")) return;
    try {
      await deleteCategory(id);
      if (editingId === id) cancelEdit();
      await loadCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>Manage Categories</h1>
      <AdminNav />
      <p className="muted">
        A controlled list of category names used to organise Courses —
        instructors and admins pick from this list (as a dropdown) when
        creating a course, instead of typing free text.
      </p>

      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Category" : "Add Category"}</h3>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Used for</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>Courses</td>
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