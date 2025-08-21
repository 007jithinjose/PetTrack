// File: src/config/db.ts
import mongoose from 'mongoose';
import logger from '../utils/logger';

const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pettrack';

export async function connectDB() {
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    logger.info(`Database connected successfully to ${DB_URI}`);
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
}

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from DB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed due to app termination');
  process.exit(0);
});

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('Database disconnected');
}