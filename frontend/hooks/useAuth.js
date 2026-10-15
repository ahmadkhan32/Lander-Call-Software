'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lander_demo_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {}
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lander_demo_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    document.cookie = 'lander_demo_user=; path=/; max-age=0;';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lander_demo_user');
      localStorage.removeItem('lander_demo_token');
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, isAuthenticated: Boolean(user), logout };
}
