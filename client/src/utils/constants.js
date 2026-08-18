// Central place for constant values used across the app.
// Change API_BASE_URL to match your deployed/local backend.

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "elearn_token";
export const USER_KEY = "elearn_user";

// Matches the `level` enum on LearningMaterial / Progress / QuizResult /
// RecommendationRule models exactly — backend stores these lowercase.
export const LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

export const LEVEL_COLORS = {
  beginner: "#e67e22",
  intermediate: "#2980b9",
  advanced: "#27ae60",
};
