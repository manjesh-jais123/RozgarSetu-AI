import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import { config } from './config';
import { setupSocketIO } from './services/socket';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = createApp();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: config.corsOrigins,
        credentials: true,
      },
      path: '/socket.io',
    });

    setupSocketIO(io);

    app.set('io', io);

    server.listen(config.port, () => {
      logger.info(`RozgarSetu AI Backend running in ${config.nodeEnv} mode on port ${config.port}`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
