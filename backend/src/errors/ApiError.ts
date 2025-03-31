//File: src/errors/ApiError.ts
import httpStatus from 'http-status';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any[]; // Add optional details field

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
    details?: any[] // Add details parameter
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details; // Assign details
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details?: any[]) {
    super(httpStatus.NOT_FOUND, message, true, '', details);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details?: any[]) {
    super(httpStatus.BAD_REQUEST, message, true, '', details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details?: any[]) {
    super(httpStatus.UNAUTHORIZED, message, true, '', details);
  }
}