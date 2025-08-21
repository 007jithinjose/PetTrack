// File: src/server.ts
import app from './app';
import { connectDB } from './config/db';
import logger from './utils/logger';
import { PORT } from './config/config';
import swaggerDocs from './config/swagger'; 

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      swaggerDocs(app, PORT); 
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});