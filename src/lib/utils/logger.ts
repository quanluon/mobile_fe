import pino from 'pino';

const isDevelopment = import.meta.env.DEV;

/**
 * Pino logger instance configured for the admin application
 * 
 * In development: Uses pino-pretty for human-readable output
 * In production: Uses JSON format for structured logging
 */
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  browser: {
    asObject: true,
  },
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

/**
 * Create a child logger with additional context
 * @param context - Additional context to include in all log messages
 */
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};

export default logger;

