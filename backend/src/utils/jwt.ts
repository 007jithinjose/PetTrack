// File: src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config';
import logger from './logger';

export interface JwtPayload {
  id: string;
  _id: string;
  role: string;
  iat?: number;
  exp?: number;
  pets?: string[];
}

export function generateToken(id: string, _id: string, role: string): string {
  return jwt.sign(
    { id, _id, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return null;
  }
}