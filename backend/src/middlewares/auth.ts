// File: src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/ApiError';
import logger from '../utils/logger';
import { User, PetOwner } from '../models';
import { IRequestUser } from '../interfaces';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IRequestUser;
  }
}

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1) Get token and check if it exists
      let token: string | undefined;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies?.token) {
        token = req.cookies.token;
      }

      if (!token) {
        throw new UnauthorizedError('Authentication required');
      }

      // 2) Verify token
      const decoded = await verifyToken(token);
      if (!decoded) {
        throw new UnauthorizedError('Invalid token');
      }

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        throw new UnauthorizedError('User no longer exists');
      }

      // 4) Check roles
      if (roles.length && !roles.includes(currentUser.role)) {
        throw new UnauthorizedError('Unauthorized access');
      }

      // 5) Prepare user object with proper typing
      const userObject: IRequestUser = {
        _id: currentUser._id.toString(),
        id: currentUser.id,
        role: currentUser.role as 'doctor' | 'petOwner',
      };

      // Add pets if user is a petOwner
      if (currentUser.role === 'petOwner') {
        const petOwner = await PetOwner.findById(currentUser._id).select('pets');
        if (petOwner) {
          userObject.pets = petOwner.pets;
        }
      }

      // Grant access to protected route
      req.user = userObject;

      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Authentication error: ${error.message}`);
      } else {
        logger.error('Authentication error: An unknown error occurred');
      }
      next(error);
    }
  };
};

export const protect = auth();
export const restrictTo = (...roles: string[]) => auth(...roles);