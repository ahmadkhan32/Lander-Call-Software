import React from 'react';
import { Search, Bell, HelpCircle, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../../app/providers';

export function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="flex h-16 items-center justify-between px-4 sm:px-6 bg-[#0F172A] text-white border-b border-slate-800">
      {/* Left side: Mobile Menu Button + Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search (matching Image 1) */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Global Search... (Press ⌘K)"
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
          />
        </div>
      </div>

      {/* Right side: Notifications, Help, User Avatar (matching Image 1) */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0F172A]" />
        </button>

        <button
          type="button"
          title="Help & Support"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:inline-flex"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Pill (matching Image 1) */}
        <div className="flex items-center gap-3 cursor-pointer pl-1">
          <div className="w-9 h-9 rounded-full bg-slate-200 text-[#0F172A] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-white/20">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SM'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Sarah Miller'}</p>
            <p className="text-[11px] text-slate-400 leading-tight capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
