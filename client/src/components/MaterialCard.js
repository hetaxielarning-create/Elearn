import React from "react";

// FIXED: detection no longer depends on the "type" dropdown matching what
// was actually uploaded (instructors can forget to change it). Instead we
// detect a file/link directly from the content value itself:
// - starts with "/uploads/" -> a file uploaded to this server
// - starts with "http"      -> an external link
// - anything else            -> plain note text
export default function MaterialCard({ material }) {
  const content = material.content || "";
  const isUploadedFile = content.startsWith("/uploads/");
  const isExternalLink = content.startsWith("http");
  const isLinkType = isUploadedFile || isExternalLink;

  const API_ORIGIN =
    process.env.REACT_APP_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:5000";

  const href = isUploadedFile ? `${API_ORIGIN}${content}` : content;

  return (
    <div className="card material-card">
      <h4>{material.title}</h4>
      {material.type && <span className="badge">{material.type}</span>}

      {isLinkType ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          {isUploadedFile ? "Open File" : "Open Link"}
        </a>
      ) : (
        // <p>{content}</p>
        <p className="material-content">{content}</p>
      )}
    </div>
  );
}
