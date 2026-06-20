export const successResponse = (
  res,
  statusCode,
  success = true,
  message,
  data = null,
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const errorResponse = (res, statusCode, success = false, message) => {
  return res.status(statusCode).json({
    success,
    message,
  });
};
