import React, { useEffect, useState } from "react";
import {
  getMyEnrollments,
  getMyCertificates,
  issueCertificate,
  downloadCertificate,
} from "../services/api";
import { formatDate, getErrorMessage } from "../utils/helpers";
import "../styles/Dashboard.css";

export default function Certificates() {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimingId, setClaimingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  async function loadData() {
    try {
      const [enrollRes, certRes] = await Promise.all([
        getMyEnrollments(),
        getMyCertificates(),
      ]);
      setEnrollments(enrollRes.data);
      setCertificates(certRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function certificateForCourse(courseId) {
    return certificates.find((c) => c.course?._id === courseId);
  }

  async function handleClaim(courseId) {
    setError("");
    setClaimingId(courseId);
    try {
      await issueCertificate(courseId);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setClaimingId(null);
    }
  }

  async function handleDownload(certificateId) {
    setError("");
    setDownloadingId(certificateId);
    try {
      const res = await downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="container">
      <h1>My Certificates</h1>
      <p className="muted">
        Certificates unlock once a course's quiz result reaches the
        "advanced" recommendation level.
      </p>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && enrollments.length === 0 && (
        <p className="muted">Enroll in a course to start earning certificates.</p>
      )}

      <div className="grid">
        {enrollments.map((e) => {
          const cert = certificateForCourse(e.course?._id);
          return (
            <div key={e._id} className="card">
              <h4>{e.course?.title}</h4>
              {cert ? (
                <>
                  <p className="muted">
                    Issued {formatDate(cert.issuedAt)} &middot; {cert.certificateId}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(cert._id)}
                    disabled={downloadingId === cert._id}
                  >
                    {downloadingId === cert._id ? "Preparing PDF..." : "Download PDF"}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleClaim(e.course._id)}
                  disabled={claimingId === e.course._id}
                >
                  {claimingId === e.course._id
                    ? "Checking..."
                    : "Check Eligibility & Claim"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
