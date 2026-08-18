import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getAllNotifications,
  createNotification,
  deleteNotification,
} from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

const emptyForm = { title: "", message: "", audience: "all" };

export default function ManageAnnouncements() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const res = await getAllNotifications();
      setNotifications(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createNotification(form);
      setForm(emptyForm);
      await loadNotifications();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>Manage Announcements</h1>
      <AdminNav />

      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>New Announcement</h3>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          required
        />

        <label>Audience</label>
        <select name="audience" value={form.audience} onChange={handleChange}>
          <option value="all">Everyone</option>
          <option value="students">Students only</option>
          <option value="instructors">Instructors only</option>
        </select>

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.audience}</td>
                <td>{formatDate(n.createdAt)}</td>
                <td>
                  <button className="icon-btn delete" onClick={() => handleDelete(n._id)}>
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
