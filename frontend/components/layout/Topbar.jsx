'use client';

import { useState } from 'react';
import { Menu, Bell, Phone, Search, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCall } from '../../lib/context/CallContext.jsx';
import clsx from 'clsx';

export default function Topbar({ onMenuClick, user }) {
  const pathname = usePathname();
  const { openDialer, callState } = useCall();
  const [agentStatus, setAgentStatus] = useState('active');

  // Convert pathname to clean breadcrumb
  const pageName = pathname === '/dashboard' ? 'Dashboard' : pathname.replace('/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/90 shadow-subtle">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open mobile menu"
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="hidden sm:inline">Workspace</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-sm font-bold text-slate-900 capitalize">{pageName}</span>
        </div>
      </div>

      {/* Right: Agent Status, Softphone, Notifications, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Agent Status Dropdown */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              agentStatus === 'active' ? 'bg-emerald-500 animate-pulse' :
              agentStatus === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
            )}
          />
          <select
            value={agentStatus}
            onChange={(e) => setAgentStatus(e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="active">Available</option>
            <option value="busy">On Call</option>
            <option value="away">Away</option>
            <option value="inactive">Offline</option>
          </select>
        </div>

        {/* Softphone Dialer Trigger */}
        <button
          onClick={() => openDialer()}
          className={clsx(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm active:scale-95',
            callState === 'in_call'
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{callState === 'in_call' ? 'Call Active' : 'Softphone'}</span>
        </button>

        {/* Notifications */}
        <a
          href="/notifications"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </a>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.email?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.full_name || 'Super Admin'}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              {user?.role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
