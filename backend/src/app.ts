// File: src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { rateLimiter } from './middlewares/rateLimiter';
import logger from './utils/logger';
import mongoose from 'mongoose';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', rateLimiter);

// Database connection
connectDB().catch(err => {
  logger.error('Failed to connect to DB:', err);
  process.exit(1);
});

// Routes
app.use('/api/v1', routes);

// Health check with DB status
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const status = dbStatus === 1 ? 'healthy' : 'unhealthy';
  res.status(dbStatus === 1 ? 200 : 503).json({ 
    status,
    database: dbStatus === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling
app.use(errorHandler);

export default app;