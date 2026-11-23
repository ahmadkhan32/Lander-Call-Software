import 'dotenv/config';

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  supabase: {
    url: process.env.SUPABASE_URL || 'https://syfywfxqujvnhtsbsuwd.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Znl3ZnhxdWp2bmh0c2JzdXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTk3MDMyNiwiZXhwIjoyMTA3NTQ2MzI2fQ.BWGlis7bev_k1NFPHLmrMnQzm6HqqvFYJsmiVCYM8e8',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Znl3ZnhxdWp2bmh0c2JzdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzAzMjYsImV4cCI6MjEwNzU0NjMyNn0.-5Ek0iI44RX3lwJXNbQCje-yVIkVhJIOaPDgmZ0Pb3A',
    jwtSecret: process.env.JWT_SECRET || 'lander-jwt-secret-secure-2026',
  },

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,*')
      .split(',')
      .map((o) => o.trim()),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  jobs: {
    reminderSchedule: process.env.CRON_REMINDER_SCHEDULE || '*/15 * * * *',
    overdueSchedule: process.env.CRON_OVERDUE_SCHEDULE || '0 * * * *',
  },
};

// Validate required keys on startup (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  const requiredKeys = ['supabase.url', 'supabase.serviceRoleKey', 'supabase.jwtSecret'];
  for (const key of requiredKeys) {
    const parts = key.split('.');
    let val = config;
    for (const part of parts) val = val[part];
    if (!val) {
      throw new Error(`Missing required environment variable for: ${key}`);
    }
  }
}


export default config;
