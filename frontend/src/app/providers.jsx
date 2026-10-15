import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ToastProvider } from '../components/ui/Toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lander_demo_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      id: 'usr_superadmin_01',
      name: 'Sarah Miller',
      email: 'sarah.miller@landercrm.io',
      role: 'super_admin',
      organization: 'Lander Global Enterprises',
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email,
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email,
        }));
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback for demo credentials
        const demoUser = {
          id: 'usr_demo_' + Date.now(),
          name: email.split('@')[0].replace('.', ' '),
          email,
          role: email.includes('admin') ? 'super_admin' : 'agent',
          organization: 'Lander Call Center CRM',
        };
        setUser(demoUser);
        localStorage.setItem('lander_demo_user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = (role = 'super_admin') => {
    const demoUser = {
      id: 'usr_demo_admin',
      name: 'Sarah Miller',
      email: 'sarah.miller@landercrm.io',
      role,
      organization: 'Lander Global Enterprises',
    };
    setUser(demoUser);
    localStorage.setItem('lander_demo_user', JSON.stringify(demoUser));
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('lander_demo_user');
    localStorage.removeItem('lander_auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginDemo, logout }}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
