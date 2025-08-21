import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { rateLimiter } from './middlewares/rateLimiter';
import logger from './utils/logger';
import mongoose from 'mongoose';
import { 
  PORT, 
  CLIENT_URL, 
  NODE_ENV,
  MONGODB_URI
} from './config/config';
import path from 'path';
import swaggerDocs from './config/swagger';

const app = express();

// 1) Global Middlewares

// Enhanced Security HTTP headers with Swagger UI support
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
      fontSrc: ["'self'", 'fonts.gstatic.com']
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Enable CORS with proper configuration for Swagger
app.use(cors({
  origin: NODE_ENV === 'development' 
    ? [CLIENT_URL, 'http://localhost:5000'] 
    : CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept'
  ]
}));

// Handle preflight requests
app.options('*', cors());

// Development logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API (excluding Swagger docs)
app.use('/api', rateLimiter);

// Body parser with extended limit for file uploads
app.use(express.json({
  limit: '10mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize()); // Against NoSQL query injection
app.use(xss());           // Against XSS

// Prevent parameter pollution with whitelist
app.use(hpp({
  whitelist: [
    'sort',
    'page',
    'limit',
    'fields',
    'populate',
    'status'
  ]
}));

// Compression middleware
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 2) Database connection
connectDB().catch(err => {
  logger.error('Failed to connect to DB:', err);
  process.exit(1);
});

// 3) Routes
app.use('/api/v1', routes);

// 4) Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const status = dbStatus === 1 ? 'healthy' : 'unhealthy';
  
  res.status(dbStatus === 1 ? 200 : 503).json({ 
    status,
    database: dbStatus === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: require('../../package.json').version
  });
});

// 5) Swagger documentation (Development only)
if (NODE_ENV === 'development') {
  swaggerDocs(app, PORT);
}

// 6) Error handling middleware
app.use(errorHandler);

// 7) Handle 404 - Must be last route
app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
      documentation: NODE_ENV === 'development' 
        ? `http://localhost:${PORT}/api/v1/docs` 
        : undefined
    });
  } else {
    res.type('txt').status(404).send('404 Not Found');
  }
});

export default app;