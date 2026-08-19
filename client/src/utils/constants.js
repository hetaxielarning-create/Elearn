// App constants
// Set the API URL for your backend

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "elearn_token";
export const USER_KEY = "elearn_user";

// Matches the learning levels used in the backend
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
