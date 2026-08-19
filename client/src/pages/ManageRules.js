import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
} from "../services/api";
import { getErrorMessage, capitalize } from "../utils/helpers";
import "../styles/Admin.css";

const emptyForm = { minScore: "", maxScore: "", level: "beginner", message: "" };

// Manage recommendation rules based on the student's score
export default function ManageRules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadRules() {
    try {
      const res = await getRules();
      setRules(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(rule) {
    setEditingId(rule._id);
    setForm({
      minScore: rule.minScore,
      maxScore: rule.maxScore,
      level: rule.level,
      message: rule.message,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      minScore: Number(form.minScore),
      maxScore: Number(form.maxScore),
    };

    if (payload.minScore > payload.maxScore) {
      setError("Min score cannot be greater than max score.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateRule(editingId, payload);
      } else {
        await createRule(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadRules();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this rule?")) return;
    try {
      await deleteRule(id);
      await loadRules();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="container">
      <h1>Manage Recommendation Rules</h1>
      <AdminNav />
      <p className="muted">
        These IF&ndash;THEN rules drive the recommendation engine, e.g. "IF
        score is 0&ndash;39 THEN recommend beginner materials."
      </p>

      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Rule" : "Add New Rule"}</h3>

        <label>Min Score (%)</label>
        <input
          type="number"
          name="minScore"
          min="0"
          max="100"
          value={form.minScore}
          onChange={handleChange}
          required
        />

        <label>Max Score (%)</label>
        <input
          type="number"
          name="maxScore"
          min="0"
          max="100"
          value={form.maxScore}
          onChange={handleChange}
          required
        />

        <label>Recommended Level</label>
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label>Message shown to student</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={2}
          required
        />

        <div className="admin-form-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Rule" : "Add Rule"}
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
        <p>Loading rules...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Range</th>
              <th>Level</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r._id}>
                <td>
                  {r.minScore}% - {r.maxScore}%
                </td>
                <td>{capitalize(r.level)}</td>
                <td>{r.message}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(r._id)}
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
