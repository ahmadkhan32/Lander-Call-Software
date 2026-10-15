import winston from 'winston';
import config from '../config/index.js';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'lander-backend' },
  transports: [
    new winston.transports.Console({
      format: config.isDevelopment ? combine(colorize(), simple()) : combine(timestamp(), json()),
    }),
  ],
});

export default logger;
