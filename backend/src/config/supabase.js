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

const supabase = createClient(
  config.supabase.url || 'https://test.supabase.co',
  config.supabase.serviceRoleKey || 'test-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabase;

