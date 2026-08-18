import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portal = searchParams.get("portal"); // "instructor" | "admin" | null (student/default)

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (result.success) {
      // FIXED: previously instructors fell through to /dashboard (student view).
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message);
    }
  }

  const heading =
    portal === "instructor"
      ? "Instructor Login"
      : portal === "admin"
      ? "Admin Login"
      : "Login";

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{heading}</h2>

        {error && <p className="form-error">{error}</p>}

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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {portal === "instructor" || portal === "admin" ? (
          <p className="auth-switch muted" style={{ fontSize: "0.85rem" }}>
            {portal === "instructor"
              ? "Instructor accounts are created by the platform administrator — there's no self-registration. If you don't have credentials yet, contact your admin."
              : "This is the fixed administrator account for this platform — set via the server's .env file, not created through this site."}
          </p>
        ) : (
          <>
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p className="auth-switch muted" style={{ fontSize: "0.8rem" }}>
              Instructor and Admin accounts are provisioned by the platform
              administrator — this form works for those roles too, once your
              account has been created.
            </p>
          </>
        )}
      </form>
    </div>
  );
}
