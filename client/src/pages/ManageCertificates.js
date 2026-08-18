import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { getAllCertificates } from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Admin.css";

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllCertificates();
        setCertificates(res.data);
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
      <h1>Issued Certificates</h1>
      <AdminNav />
      <p className="muted">
        Certificates are issued automatically once a student's progress in a
        course reaches the "advanced" level.
      </p>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : certificates.length === 0 ? (
        <p className="muted">No certificates issued yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Issued</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c) => (
              <tr key={c._id}>
                <td>{c.certificateId}</td>
                <td>{c.student?.name}</td>
                <td>{c.course?.title}</td>
                <td>{formatDate(c.issuedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
