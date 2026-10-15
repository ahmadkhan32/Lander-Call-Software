import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routers
import leadsRouter     from './modules/leads/leadsRouter.js';
import callsRouter     from './modules/calls/callsRouter.js';
import campaignsRouter from './modules/campaigns/campaignsRouter.js';
import followUpsRouter from './modules/follow-ups/followUpsRouter.js';
import reportsRouter   from './modules/reports/reportsRouter.js';
import usersRouter     from './modules/users/usersRouter.js';
import webhooksRouter  from './modules/webhooks/webhooksRouter.js';

const app = express();

// ── Security & CORS ───────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = config.cors.allowedOrigins;
    if (allowed.includes('*')) return callback(null, true);

    const isExplicitlyAllowed = allowed.includes(origin);
    const isVercelDomain = origin.endsWith('.vercel.app');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

    if (isExplicitlyAllowed || isVercelDomain || isLocalhost) {
      callback(null, true);
    } else {
      logger.warn(`CORS warning: Origin ${origin} not in whitelist, accepting for development/preview`);
      // Allow the origin or respond with true to prevent hard crash
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'apikey', 'Prefer', 'X-Client-Info'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please try again later' },
}));

// ── Parsing ───────────────────────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan(config.isDevelopment ? 'dev' : 'combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'lander-backend' });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/leads',       leadsRouter);
app.use('/api/calls',       callsRouter);
app.use('/api/campaigns',   campaignsRouter);
app.use('/api/follow-ups',  followUpsRouter);
app.use('/api/reports',     reportsRouter);
app.use('/api/users',       usersRouter);
app.use('/api/webhooks',    webhooksRouter);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
