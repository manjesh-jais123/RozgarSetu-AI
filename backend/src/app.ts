import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { logger } from './utils/logger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { globalRateLimiter } from './middleware/rateLimiter';
import { sanitize } from './middleware/validation';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...config.corsOrigins, "ws:", "wss:"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
  }));

  app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(sanitize);

  if (config.nodeEnv !== 'production') {
    app.use(morgan('dev', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));
  }

  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'RozgarSetu AI Backend is healthy',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      error: null,
    });
  });

  app.use(globalRateLimiter);

  app.use('/api', routes);

  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
      data: null,
      error: { code: 'NOT_FOUND', details: 'Endpoint does not exist' },
    });
  });

  app.use(errorHandler);

  return app;
}
