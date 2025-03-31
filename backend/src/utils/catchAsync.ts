//File: src/utils/catchAsync.ts
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';

export const catchAsync = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };