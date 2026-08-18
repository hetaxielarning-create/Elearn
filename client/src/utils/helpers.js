// Small reusable helper functions used across pages/components.

// Format an ISO date string into a readable date, e.g. "7 Aug 2026"
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "beginner" -> "Beginner", for display only. Backend values stay lowercase.
export function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Simple percentage calculator, guards against divide-by-zero.
export function toPercentage(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

// Pull a friendly error message out of an axios error object.
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
