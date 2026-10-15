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
  Settings,
  ShieldCheck,
  FileText,
  Radio,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../app/providers';
import { hasPermission, PERMISSIONS, ROLE_LABELS } from '../../lib/permissions';

const allNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard', permission: PERMISSIONS.VIEW_DASHBOARD },
  { label: 'Leads CRM', icon: Users2, path: '/app/leads', badge: '12', permission: PERMISSIONS.MANAGE_LEADS },
  { label: 'Customers', icon: Building2, path: '/app/customers', permission: PERMISSIONS.VIEW_CUSTOMERS },
  { label: 'Dialer Softphone', icon: Headphones, path: '/app/dialer', pulse: true, permission: PERMISSIONS.CALL_DIALER },
  { label: 'Call History', icon: PhoneCall, path: '/app/calls', permission: PERMISSIONS.VIEW_CALLS },
  { label: 'Follow-ups', icon: CalendarCheck2, path: '/app/follow-ups', badge: '5', permission: PERMISSIONS.MANAGE_LEADS },
  { label: 'Campaigns', icon: FolderKanban, path: '/app/campaigns', permission: PERMISSIONS.VIEW_CAMPAIGNS },
  { label: 'QA & Reviews', icon: CheckCircle, path: '/app/qa', permission: PERMISSIONS.VIEW_QA },
  { label: 'Reports', icon: BarChart3, path: '/app/reports', permission: PERMISSIONS.VIEW_REPORTS },
  { label: 'Audit Logs', icon: FileText, path: '/app/audit-logs', permission: PERMISSIONS.VIEW_AUDIT_LOGS },
  { label: 'Integrations', icon: Radio, path: '/app/integrations', permission: PERMISSIONS.MANAGE_INTEGRATIONS },
  { label: 'Settings', icon: Settings, path: '/app/settings', permission: PERMISSIONS.MANAGE_SETTINGS },
];

export function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'super_admin';

  const visibleNav = allNavItems.filter((item) =>
    hasPermission(userRole, item.permission)
  );

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

        {/* Current Active Role Badge */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate font-semibold text-white">
              {ROLE_LABELS[userRole] || userRole}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-3 py-3 overflow-y-auto max-h-[calc(100vh-190px)]">
          {visibleNav.map((item) => {
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

      {/* User profile card at bottom */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-bold text-white shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Sarah Miller'}</p>
              <p className="text-[11px] text-slate-400 truncate">{ROLE_LABELS[userRole] || userRole}</p>
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
