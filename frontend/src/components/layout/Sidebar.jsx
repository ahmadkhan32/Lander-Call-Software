import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  Building2,
  PhoneCall,
  CalendarCheck2,
  FolderKanban,
  Headphones,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  LogOut,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../app/providers';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { label: 'Leads', icon: Users2, path: '/app/leads', badge: '12' },
  { label: 'Contacts', icon: Building2, path: '/app/customers' },
  { label: 'Dialer Softphone', icon: Headphones, path: '/app/dialer', pulse: true },
  { label: 'Call History', icon: PhoneCall, path: '/app/calls' },
  { label: 'Follow-ups', icon: CalendarCheck2, path: '/app/follow-ups', badge: '5' },
  { label: 'Campaigns', icon: FolderKanban, path: '/app/campaigns' },
  { label: 'QA & Reviews', icon: CheckCircle, path: '/app/qa' },
  { label: 'Reports', icon: BarChart3, path: '/app/reports' },
  { label: 'Settings', icon: Settings, path: '/app/settings' },
];

export function Sidebar({ onClose }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col justify-between bg-navy text-white w-64 select-none">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white font-extrabold text-lg shadow-sm">
            L
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-white">LANDER</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-tight">CRM & Operations</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                    {item.badge}
                  </span>
                )}
                {item.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile card at bottom (matching Image 2) */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-bold text-white shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Sarah Miller'}</p>
              <p className="text-[11px] text-slate-400 truncate capitalize">{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
