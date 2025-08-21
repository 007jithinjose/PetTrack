//File: src/validations/validate.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';
import { BadRequestError } from '../errors/ApiError';

export const validate = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestError(error.errors[0].message);
      }
      throw error;
    }
  };