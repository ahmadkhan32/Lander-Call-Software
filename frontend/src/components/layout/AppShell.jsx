import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { Drawer } from '../ui/Drawer';

export function AppShell({ children }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-navy flex flex-col font-sans">
      {/* Topbar */}
      <header className="sticky top-0 z-30 w-full shrink-0">
        <Topbar onMenuClick={() => setMobileDrawerOpen(true)} />
      </header>

      {/* Main Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (hidden on tablet/mobile) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-navy text-white border-r border-slate-800 h-[calc(100vh-64px)] sticky top-16 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Mobile / Tablet Drawer */}
        <Drawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          side="left"
          title="Navigation"
          className="p-0 bg-navy"
        >
          <div className="h-full">
            <Sidebar onClose={() => setMobileDrawerOpen(false)} />
          </div>
        </Drawer>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
