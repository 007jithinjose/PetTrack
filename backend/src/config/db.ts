// File: src/config/db.ts
import mongoose from 'mongoose';
import logger from '../utils/logger';

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pettrack';

export async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('Database disconnected');
}