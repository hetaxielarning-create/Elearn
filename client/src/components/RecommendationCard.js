import React from "react";
import { LEVEL_COLORS } from "../utils/constants";
import { capitalize } from "../utils/helpers";

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  const { level, message, score } = recommendation;
  const color = LEVEL_COLORS[level] || "#555";

  return (
    <div className="card recommendation-card" style={{ borderLeft: `6px solid ${color}` }}>
      <h3>
        Recommended Level: <span style={{ color }}>{capitalize(level)}</span>
      </h3>
      {typeof score === "number" && <p>Your quiz score: {score}%</p>}
      <p>{message}</p>
    </div>
  );
}
