'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Target, Phone, Calendar,
  BarChart3, Settings, LogOut, PhoneCall, Radio,
  ShieldCheck, Bell, Shield, X, Contact, Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { createClient } from '../../lib/supabase/client.js';

const navSections = [
  {
    title: 'Core CRM',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/leads', label: 'Leads', icon: Target },
      { href: '/contacts', label: 'Contacts', icon: Contact },
      { href: '/follow-ups', label: 'Follow-ups & Tasks', icon: Calendar },
    ],
  },
  {
    title: 'Telephony & Outreach',
    items: [
      { href: '/dialer', label: 'Softphone Dialer', icon: Radio },
      { href: '/calls', label: 'Call Records', icon: Phone },
      { href: '/campaigns', label: 'Campaigns', icon: PhoneCall },
      { href: '/agents', label: 'Agent Roster', icon: Users },
      { href: '/teams', label: 'Queues & Teams', icon: ShieldCheck },
    ],
  },
  {
    title: 'Management & Ops',
    items: [
      { href: '/quality-assurance', label: 'QA & Scoring', icon: Sparkles },
      { href: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/audit-logs', label: 'Audit Trail', icon: Shield },
      { href: '/settings', label: 'System Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ mobileMenuOpen, onClose, user, isMobileOnly = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = 'lander_demo_user=; path=/; max-age=0;';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lander_demo_user');
      localStorage.removeItem('lander_demo_token');
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push('/login');
    router.refresh();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 bg-[#0B1120]">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight leading-none block">
              LANDER
            </span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
              Call Center CRM
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {section.title}
            </p>
            {section.items.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User info & Sign out */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B1120]">
        <div className="px-3 py-2 rounded-xl bg-slate-800/50 mb-2 border border-slate-700/40 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">
              {user?.email || 'superadmin@lander.crm'}
            </p>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              {user?.role || 'Super Admin'}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="Online" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  if (isMobileOnly) {
    return navContent;
  }

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-800 shadow-xl">
        {navContent}
      </aside>

      {/* Mobile Off-canvas Slide-out Drawer */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </div>
    </>
  );
}
