import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Headphones, BarChart2, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const tabs = [
    { label: 'Home', icon: Home, path: '/app/dashboard' },
    { label: 'Leads', icon: Users, path: '/app/leads' },
    { label: 'Dialer', icon: Headphones, path: '/app/dialer' },
    { label: 'Reports', icon: BarChart2, path: '/app/reports' },
    { label: 'Profile', icon: User, path: '/app/settings' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 safe-bottom shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150',
                  isActive
                    ? 'text-brand font-semibold'
                    : 'text-slate-400 hover:text-slate-700'
                )
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
