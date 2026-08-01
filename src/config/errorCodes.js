// src/utils/getErrorMessage.js
export function getErrorMessage(statusOrError) {
  const MESSAGES = {
    200: "Success.",
    400: "Bad request. Please check your input.",
    401: "Invalid username or password. Please try again.",
    403: "You don’t have permission to do that.",
    404: "We couldn’t find what you’re looking for.",
    409: "This already exists or conflicts with another record.",
    422: "Some fields are invalid. Please fix and try again.",
    429: "Too many requests. Please try again in a moment.",
    500: "Something went wrong on our side.",
    503: "Service is temporarily unavailable. Please try again soon.",
  };

  // Accept number/string code OR an error object (e.g., Axios)
  const code = Number(
    typeof statusOrError === "object"
      ? statusOrError?.response?.status ?? statusOrError?.status ?? statusOrError?.code
      : statusOrError
  );

  if (!Number.isFinite(code)) return "Something went wrong. Please try again.";

  // Exact match first
  if (MESSAGES[code]) return MESSAGES[code];

  // Series fallback (works for all other status codes)
  if (code >= 500) return "Server error. Please try again later.";
  if (code >= 400) return "Request error. Please check your input.";
  if (code >= 300) return "Redirection response.";
  if (code >= 200) return "Success.";
  return "Informational response.";
}

// Prefers the backend's actual error message over Axios's generic
// "Request failed with status code N", falling back to a status-code
// message and then a hardcoded default.
export function getApiErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    getErrorMessage(error) ||
    "An unexpected error occurred. Please try again."
  );
}


