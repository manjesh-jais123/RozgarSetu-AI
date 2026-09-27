import pino from 'pino';
import { config } from '../config';

const logger = config.nodeEnv !== 'production'
  ? pino({
      level: config.logLevel,
      base: { service: 'udyamsetu-ai-backend' },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    })
  : pino({
      level: config.logLevel,
      base: { service: 'udyamsetu-ai-backend' },
    });

export { logger };

export const createChildLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};
