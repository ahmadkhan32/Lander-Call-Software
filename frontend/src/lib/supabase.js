import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://syfywfxqujvnhtsbsuwd.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Znl3ZnhxdWp2bmh0c2JzdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzAzMjYsImV4cCI6MjEwNzU0NjMyNn0.-5Ek0iI44RX3lwJXNbQCje-yVIkVhJIOaPDgmZ0Pb3A';

export const isSupabaseLive = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('mock') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
