/**
 * Utility to send standardized API responses across all controllers.
 */
export const sendResponse = (res, statusCode, success, message, data = null, pagination = null) => {
  const responsePayload = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    responsePayload.data = data;
  }

  if (pagination !== null) {
    responsePayload.pagination = pagination;
  }

  return res.status(statusCode).json(responsePayload);
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const payload = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
