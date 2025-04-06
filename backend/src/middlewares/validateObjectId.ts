// src/middlewares/validateObjectId.ts
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import {ApiError} from '../errors/ApiError';

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isValidObjectId(req.params[paramName])) {
      return next(new ApiError(400, `Invalid ${paramName} ID format`));
    }
    next();
  };
};