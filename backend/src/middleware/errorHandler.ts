import { Request, Response, NextFunction } from "express";
import { ValidationError as ExpressValidationError } from "express-validator";
import mongoose from "mongoose";
import { logger } from "../config/logger";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

// Custom error classes
export class AppError extends Error implements CustomError {
  statusCode: number;
  code: string;
  isOperational: boolean;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class CustomValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

// Handle Mongoose validation errors
const handleValidationError = (
  error: mongoose.Error.ValidationError,
): AppError => {
  const errors = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
    value: (err as any).value,
  }));

  return new CustomValidationError("Validation failed", errors);
};

// Handle Mongoose cast errors (invalid ObjectId, etc.)
const handleCastError = (error: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400, "INVALID_DATA");
};

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (error: any): AppError => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue?.[field];
  const message = `${field} '${value}' already exists`;

  return new ConflictError(message);
};

// Handle JWT errors
const handleJWTError = (): AppError => {
  return new AuthenticationError("Invalid token");
};

const handleJWTExpiredError = (): AppError => {
  return new AuthenticationError("Token has expired");
};

// Send error response in development
const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.code || "INTERNAL_ERROR",
    message: err.message,
    details: err.details,
    stack: err.stack,
  });
};

// Send error response in production
const sendErrorProd = (err: CustomError, res: Response) => {
  // Only send operational errors to client in production
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.code || "INTERNAL_ERROR",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  } else {
    // Don't leak error details in production for non-operational errors
    logger.error("Programming error:", err);

    res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Main error handling middleware
const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  logger.error(`Error ${error.statusCode || 500}: ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    stack: error.stack,
  });

  // Mongoose bad ObjectId
  if (error.name === "CastError") {
    err = handleCastError(error);
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    err = handleValidationError(error);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    err = handleDuplicateKeyError(error);
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    err = handleJWTError();
  }

  if (error.name === "TokenExpiredError") {
    err = handleJWTExpiredError();
  }

  // Express-validator errors
  if (error.array && typeof error.array === "function") {
    const validationErrors = error.array().map((err: any) => ({
      field: err.param || err.path,
      message: err.msg,
      value: err.value,
    }));
    err = new CustomValidationError("Validation failed", validationErrors);
  }

  // Multer errors (file upload)
  if (error.code === "LIMIT_FILE_SIZE") {
    err = new AppError("File too large", 413, "FILE_TOO_LARGE");
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    err = new AppError(
      "Unexpected field in file upload",
      400,
      "UNEXPECTED_FILE_FIELD",
    );
  }

  // Handle specific error codes
  if (error.code === "ECONNREFUSED") {
    err = new AppError(
      "Database connection failed",
      503,
      "DATABASE_CONNECTION_ERROR",
    );
  }

  if (error.code === "ETIMEDOUT") {
    err = new AppError("Request timeout", 408, "REQUEST_TIMEOUT");
  }

  // Send error response
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

export default errorHandler;
