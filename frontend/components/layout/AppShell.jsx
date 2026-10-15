'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import SoftphoneDialer from '../SoftphoneDialer.jsx';
import { CallProvider } from '../../lib/context/CallContext.jsx';
import { createClient } from '../../lib/supabase/client.js';

function ShellLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check Supabase session first
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lander_demo_user');
        if (stored) {
          try { setUser(JSON.parse(stored)); } catch {}
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />

      {/* Main Content Area */}
      <div className="min-h-screen min-w-0 lg:pl-64 flex flex-col flex-1">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
        />

        <main className="mx-auto w-full min-w-0 max-w-[1600px] p-4 sm:p-6 lg:p-8 flex-1 animate-in">
          {children}
        </main>
      </div>

      {/* Floating Softphone Dialer (Available globally across all pages) */}
      <SoftphoneDialer />
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <CallProvider>
      <ShellLayout>{children}</ShellLayout>
    </CallProvider>
  );
}
