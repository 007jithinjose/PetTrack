// File: src/config/config.ts
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';

dotenv.config();

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const PORT = parseInt(process.env.PORT || '5000', 10);
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pettrack';
export const JWT_SECRET = getRequiredEnvVar('JWT_SECRET');
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as StringValue;
export const JWT_EXPIRES_IN_MS = ms(JWT_EXPIRES_IN);