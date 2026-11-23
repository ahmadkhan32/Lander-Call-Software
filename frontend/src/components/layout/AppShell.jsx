import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { Drawer } from '../ui/Drawer';

export function AppShell({ children }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-page text-navy flex flex-col font-sans overflow-hidden">
      {/* Topbar (Fixed height at top) */}
      <header className="h-16 shrink-0 z-30 w-full border-b border-slate-800 bg-[#0F172A]">
        <Topbar onMenuClick={() => setMobileDrawerOpen(true)} />
      </header>

      {/* Main Body (Fills remaining screen height exactly) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (Fixed left rail, fits 100% height without overflowing screen) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-navy text-white border-r border-slate-800 h-full overflow-hidden select-none">
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

        {/* Main Content Area (Independent scrollable viewport) */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
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
