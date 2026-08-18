import React, { useEffect, useState } from "react";
import { getMyNotifications } from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Dashboard.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyNotifications();
        setNotifications(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container">
      <h1>Notifications</h1>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p className="muted">No announcements yet.</p>
      )}

      {notifications.map((n) => (
        <div key={n._id} className="card">
          <h4>{n.title}</h4>
          <p>{n.message}</p>
          <p className="muted">{formatDate(n.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
