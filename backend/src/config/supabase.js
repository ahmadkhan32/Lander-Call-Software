import { createClient } from '@supabase/supabase-js';
import config from './index.js';

/**
 * Privileged Supabase client using the service role key.
 * ONLY use on the server. Never expose this key to the frontend.
 * This client bypasses RLS — the backend MUST enforce authorization.
 */
export const isSupabaseConfigured = Boolean(
  config.supabase.url &&
  !config.supabase.url.includes('demo-project-ref') &&
  !config.supabase.url.includes('test.supabase.co') &&
  !config.supabase.url.includes('your-project')
);

export const supabase = createClient(
  config.supabase.url || 'https://syfywfxqujvnhtsbsuwd.supabase.co',
  config.supabase.serviceRoleKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Znl3ZnhxdWp2bmh0c2JzdXdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTk3MDMyNiwiZXhwIjoyMTA3NTQ2MzI2fQ.BWGlis7bev_k1NFPHLmrMnQzm6HqqvFYJsmiVCYM8e8',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const supabaseAdmin = supabase;
export default supabase;
