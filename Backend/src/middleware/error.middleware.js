import { AppError } from "../utils/appError.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Custom AppError 
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Generic / Unhandled Error 
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};