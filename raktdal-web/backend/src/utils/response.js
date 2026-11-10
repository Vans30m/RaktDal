/**
 * Standardized HTTP response helpers for RaktDal controllers.
 * Ensures consistent JSON responses and reduces boilerplate across controllers.
 */

export function sendSuccess(res, data = null, message = null, statusCode = 200) {
  const payload = { success: true };
  if (message) payload.message = message;
  if (data !== null && data !== undefined) {
    if (typeof data === "object" && !Array.isArray(data) && !data.data) {
      Object.assign(payload, data);
    } else {
      payload.data = data;
    }
  }
  return res.status(statusCode).json(payload);
}

export function sendError(res, message, statusCode = 400, errors = null) {
  const payload = {
    success: false,
    message: message || "An unexpected error occurred."
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

