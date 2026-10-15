import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { startJobs } from './jobs/index.js';

const server = app.listen(config.port, () => {
  logger.info(`Lander backend started`, {
    port: config.port,
    env: config.nodeEnv,
    pid: process.pid,
  });

  // Start background cron jobs
  startJobs();
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { err });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});
