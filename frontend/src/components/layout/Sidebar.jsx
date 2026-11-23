import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Mail,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../app/providers';
import { hasPermission, PERMISSIONS, ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from '../../lib/permissions';

const navSections = [
  {
    title: 'Platform & Admin',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard', permission: PERMISSIONS.VIEW_DASHBOARD },
      { label: 'Organizations', icon: Globe, path: '/app/organizations', permission: PERMISSIONS.MANAGE_ORGANIZATIONS },
      { label: 'Users & Passwords', icon: Users2, path: '/app/users', permission: PERMISSIONS.MANAGE_USERS },
      { label: 'Invitations', icon: Mail, path: '/app/invitations', permission: PERMISSIONS.MANAGE_USERS },
      { label: 'Roles & Permissions', icon: ShieldCheck, path: '/app/roles-permissions', permission: PERMISSIONS.MANAGE_ROLES_PERMISSIONS },
    ],
  },
  {
    title: 'CRM & Telephony',
    items: [
      { label: 'Leads CRM', icon: Users2, path: '/app/leads', badge: '12', permission: PERMISSIONS.MANAGE_LEADS },
      { label: 'Customers', icon: Building2, path: '/app/customers', permission: PERMISSIONS.VIEW_CUSTOMERS },
      { label: 'Dialer Softphone', icon: Headphones, path: '/app/dialer', pulse: true, permission: PERMISSIONS.CALL_DIALER },
      { label: 'Call History', icon: PhoneCall, path: '/app/calls', permission: PERMISSIONS.VIEW_CALLS },
      { label: 'WhatsApp Inbox', icon: MessageSquare, path: '/app/whatsapp', badge: '3', permission: PERMISSIONS.MANAGE_LEADS },
      { label: 'Follow-ups', icon: CalendarCheck2, path: '/app/follow-ups', badge: '5', permission: PERMISSIONS.MANAGE_LEADS },
    ],
  },
  {
    title: 'Intelligence & Ops',
    items: [
      { label: 'Campaigns', icon: FolderKanban, path: '/app/campaigns', permission: PERMISSIONS.VIEW_CAMPAIGNS },
      { label: 'QA & Reviews', icon: CheckCircle, path: '/app/qa', permission: PERMISSIONS.VIEW_QA },
      { label: 'Reports', icon: BarChart3, path: '/app/reports', permission: PERMISSIONS.VIEW_REPORTS },
      { label: 'Audit Logs', icon: FileText, path: '/app/audit-logs', permission: PERMISSIONS.VIEW_AUDIT_LOGS },
    ],
  },
  {
    title: 'System & Configuration',
    items: [
      { label: 'Integrations', icon: Radio, path: '/app/integrations', permission: PERMISSIONS.MANAGE_INTEGRATIONS },
      { label: 'Settings', icon: Settings, path: '/app/settings', permission: PERMISSIONS.MANAGE_SETTINGS },
    ],
  },
];

export function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userRole = user?.role || 'super_admin';

  const roleDashboardRoute = ROLE_DASHBOARD_ROUTES?.[userRole] || '/app/dashboard';

  const isItemActive = (item) => {
    const current = location.pathname;
    if (item.label === 'Dashboard') {
      return (
        current === '/app/dashboard' ||
        current === roleDashboardRoute ||
        current === '/' ||
        current.endsWith('/dashboard')
      );
    }
    if (item.path === '/app/organizations') {
      return current === '/app/organizations' || current.includes('/organizations');
    }
    if (item.path === '/app/users') {
      return current === '/app/users' || current.includes('/users');
    }
    if (item.path === '/app/invitations') {
      return current === '/app/invitations' || current.includes('/invitations');
    }
    if (item.path === '/app/roles-permissions') {
      return current === '/app/roles-permissions' || current.includes('/roles');
    }
    if (item.path === '/app/leads') {
      return current === '/app/leads' || current.startsWith('/app/leads/');
    }
    if (item.path === '/app/customers') {
      return current === '/app/customers';
    }
    if (item.path === '/app/dialer') {
      return current === '/app/dialer' || current.includes('/dialer');
    }
    if (item.path === '/app/calls') {
      return current === '/app/calls' || current.includes('/calls');
    }
    if (item.path === '/app/whatsapp') {
      return current === '/app/whatsapp' || current.includes('/whatsapp');
    }
    if (item.path === '/app/audit-logs') {
      return current === '/app/audit-logs' || current.includes('/audit');
    }
    return current === item.path || current.startsWith(item.path + '/');
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-full flex-col bg-navy text-white w-64 select-none overflow-hidden">
      {/* Brand Header & Role Badge (Fixed Top) */}
      <div className="shrink-0 border-b border-slate-800">
        <div className="flex h-14 items-center gap-3 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white font-extrabold text-base shadow-sm">
            L
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider text-white">LANDER</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-tight">CRM & Operations</span>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-3 pb-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate font-semibold text-white">
              {ROLE_LABELS[userRole] || userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links (Scrollable with custom smooth scrollbar) */}
      <nav className="flex-1 min-h-0 space-y-3 px-2.5 py-2 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
        {navSections.map((section) => {
          const visibleItems = section.items
            .filter((item) => hasPermission(userRole, item.permission))
            .map((item) => {
              if (item.label === 'Dashboard') {
                return { ...item, path: roleDashboardRoute };
              }
              return item;
            });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-0.5">
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                {section.title}
              </div>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);
                return (
                  <NavLink
                    key={item.label + item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'bg-brand text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-blue-300">
                        {item.badge}
                      </span>
                    )}
                    {item.pulse && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User profile card at bottom (Fixed Bottom, always visible!) */}
      <div className="shrink-0 p-2.5 border-t border-slate-800 bg-slate-900/95">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-bold text-white shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Sarah Miller'}</p>
              <p className="text-[10px] text-slate-400 truncate">{ROLE_LABELS[userRole] || userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
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
