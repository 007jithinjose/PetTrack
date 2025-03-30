//File: src/middlewares/errorHandler.ts
import { ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';
import logger from '../utils/logger';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req,
  res,
  next
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code
    }));
    
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details })
    });
    return;
  }

  // Handle unexpected errors
  logger.error('Unhandled error:', err);
  
  const errorMessage = err instanceof Error ? err.message : 'Internal server error';
  const response: Record<string, unknown> = {
    success: false,
    message: errorMessage
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err instanceof Error ? err.stack : undefined;
  }

  res.status(500).json(response);
};