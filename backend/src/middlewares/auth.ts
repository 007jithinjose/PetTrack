// File: src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/ApiError';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
      id: string;
      role: string;
    };
  }
}

export const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) throw new UnauthorizedError('Authentication required');

    const decoded = verifyToken(token);
    if (!decoded) throw new UnauthorizedError('Invalid token');
    if (roles.length && !roles.includes(decoded.role)) {
      throw new UnauthorizedError('Unauthorized access');
    }

    req.user = decoded;
    next();
  };
};