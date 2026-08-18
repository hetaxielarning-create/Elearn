import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getInstructors,
  createInstructor,
  deleteInstructor,
  toggleUserActive,
} from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

const emptyForm = { name: "", email: "", password: "" };

export default function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function loadInstructors() {
    try {
      const res = await getInstructors();
      setInstructors(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInstructors();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);
    try {
      await createInstructor(form);
      setSuccessMsg(
        `Instructor account created. Share these credentials with them: ${form.email} / (the password you set)`
      );
      setForm(emptyForm);
      await loadInstructors();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id) {
    try {
      await toggleUserActive(id);
      await loadInstructors();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this instructor account?")) return;
    try {
      await deleteInstructor(id);
      await loadInstructors();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>Manage Instructors</h1>
      <AdminNav />
      <p className="muted">
        Instructor accounts are created by admin — instructors don't
        self-register. Assign credentials here, then share them directly
        with the instructor.
      </p>

      {error && <p className="form-error">{error}</p>}
      {successMsg && <p style={{ color: "#27ae60" }}>{successMsg}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Add New Instructor</h3>

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Instructor Account"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((i) => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.email}</td>
                <td>{formatDate(i.createdAt)}</td>
                <td>{i.isActive === false ? "Deactivated" : "Active"}</td>
                <td>
                  <button
                    className="icon-btn edit"
                    onClick={() => handleToggleActive(i._id)}
                  >
                    {i.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(i._id)}>
                    Remove
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
