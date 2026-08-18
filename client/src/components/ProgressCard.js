import React from "react";
import { formatDate } from "../utils/helpers";

export default function ProgressCard({ progress }) {
  return (
    <div className="card progress-card">
      <h4>{progress.course?.title || "Course"}</h4>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress.latestScore || 0}%` }}
        />
      </div>
      <p>Latest score: {progress.latestScore != null ? `${progress.latestScore}%` : "-"}</p>
      <p className="muted">Last updated: {formatDate(progress.updatedAt)}</p>
    </div>
  );
}
