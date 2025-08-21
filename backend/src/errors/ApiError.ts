// File: src/errors/ApiError.ts
import httpStatus from 'http-status';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: Record<string, unknown> | unknown[];

  constructor(
    statusCode: number,
    message: string,
    options: {
      isOperational?: boolean;
      stack?: string;
      details?: Record<string, unknown> | unknown[];
    } = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;

    if (options.stack) {
      this.stack = options.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details?: Record<string, unknown> | unknown[]) {
    super(httpStatus.NOT_FOUND, message, { details });
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details?: Record<string, unknown> | unknown[]) {
    super(httpStatus.BAD_REQUEST, message, { details });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details?: Record<string, unknown> | unknown[]) {
    super(httpStatus.UNAUTHORIZED, message, { details });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, details?: Record<string, unknown> | unknown[]) {
    super(httpStatus.FORBIDDEN, message, { details });
  }
}