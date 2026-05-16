function sendSuccess(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null
  });
}

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: { code, message }
  });
}

module.exports = {
  sendSuccess,
  sendError
};
