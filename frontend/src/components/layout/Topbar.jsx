import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Menu, ChevronDown, Shield, Check } from 'lucide-react';
import { useAuth } from '../../app/providers';
import { ROLE_LABELS } from '../../lib/permissions';

export function Topbar({ onMenuClick }) {
  const { user, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const currentRole = user?.role || 'super_admin';

  const allRoles = Object.entries(ROLE_LABELS);

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

        {/* Global Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Global Search... (Press ⌘K)"
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition"
          />
        </div>
      </div>

      {/* Right side: Interactive Role Switcher + Notifications + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">{ROLE_LABELS[currentRole] || currentRole}</span>
            <span className="md:hidden">Role</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 p-2 shadow-elevated z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role (11 Roles)
                </p>
                <p className="text-[10px] text-slate-500">Preview RBAC permissions live</p>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5">
                {allRoles.map(([roleKey, roleLabel]) => {
                  const isSelected = currentRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => {
                        switchRole(roleKey);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-left transition ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{roleLabel}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0F172A]" />
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-1">
          <div className="w-9 h-9 rounded-full bg-slate-200 text-[#0F172A] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-white/20">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SM'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Sarah Miller'}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{ROLE_LABELS[currentRole] || currentRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
