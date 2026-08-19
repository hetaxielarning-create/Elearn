// Reusable helper functions
// Format a date into a readable format
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Capitalize the level name for display
export function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Calculate a percentage and avoid dividing by zero
export function toPercentage(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}
// Get a simple error message from an Axios error
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
