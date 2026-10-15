'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MoreHorizontal, User, Circle, Loader2, Check } from 'lucide-react';
import clsx from 'clsx';
import Badge from '../ui/Badge.jsx';

const STATUS_CONFIG = {
  new:       { label: 'Prospect',    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  qualified: { label: 'Meeting',     badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Negotiations',badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  converted: { label: 'Closed Deal', badge: 'bg-emerald-600 text-white border-transparent' },
  lost:      { label: 'Unqualified', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  archived:  { label: 'Archived',    badge: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function LeadTable({
  leads = [],
  loading = false,
  onCall,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  if (loading) {
    return (
      <div className="card text-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
        <p className="text-xs text-slate-500 mt-2 font-medium">Loading leads database...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="card text-center py-16 text-slate-500">
        <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-800">No leads found in this stage</p>
        <p className="text-xs text-slate-400 mt-1">Try switching pipeline stages or search query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile Stacked Card View (< 768px) */}
      <div className="block md:hidden space-y-3">
        {leads.map((lead) => {
          const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
          return (
            <div
              key={lead.id}
              className="card p-4 space-y-3 transition-all duration-150 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                    {lead.full_name?.[0]?.toUpperCase() || 'L'}
                  </div>
                  <div>
                    <Link href={`/leads/${lead.id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600">
                      {lead.full_name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{lead.company || 'Enterprise Account'}</p>
                  </div>
                </div>
                <span className={clsx('text-[11px] font-bold px-2.5 py-0.5 rounded-full border', cfg.badge)}>
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-mono text-slate-600">{lead.phone || 'No phone'}</span>
                <span>Product: <strong className="text-slate-800 font-semibold">{lead.campaigns?.name || 'Lander CRM'}</strong></span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {lead.phone && onCall && (
                  <button
                    type="button"
                    onClick={() => onCall(lead.phone, lead)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call via Softphone</span>
                  </button>
                )}
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/leads/${lead.id}`}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                  title="View Details"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop & Tablet Table (>= 768px) matching Image 3 Cleomind CRM */}
      <div className="hidden md:block table-container bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs">
              <th className="w-10 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={selectedIds.size === leads.length && leads.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100 cursor-pointer"
                />
              </th>
              <th>Date Added</th>
              <th>Contact Name</th>
              <th>Company</th>
              <th>Status</th>
              <th>Product / Queue</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
              const isSelected = selectedIds.has(lead.id);

              return (
                <tr
                  key={lead.id}
                  className={clsx(
                    'transition-all duration-150 group',
                    isSelected
                      ? 'bg-blue-50/60'
                      : 'hover:bg-slate-50/80 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)]'
                  )}
                >
                  {/* Row Checkbox */}
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(lead.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100 cursor-pointer"
                    />
                  </td>

                  {/* Date Added */}
                  <td className="text-xs text-slate-500 font-mono">
                    {new Date(lead.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Name with Round Avatar & Title */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                        {lead.full_name?.[0]?.toUpperCase() || 'L'}
                      </div>
                      <div>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 text-xs sm:text-sm block leading-snug"
                        >
                          {lead.full_name}
                        </Link>
                        <span className="text-[11px] text-slate-400 block">
                          {lead.priority ? `${lead.priority.toUpperCase()} Priority Account` : 'Prospect Lead'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="text-xs font-semibold text-slate-800">
                    {lead.company || 'Private Account'}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={clsx('text-[11px] font-bold px-3 py-1 rounded-full border inline-block', cfg.badge)}>
                      {cfg.label}
                    </span>
                  </td>

                  {/* Product / Queue */}
                  <td className="text-xs text-slate-600 font-medium">
                    {lead.campaigns?.name || 'Lander CRM Enterprise'}
                  </td>

                  {/* Quick Action Icons: Email, Phone, 3-dots */}
                  <td className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {lead.phone && onCall && (
                        <button
                          type="button"
                          onClick={() => onCall(lead.phone, lead)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Call Lead via Softphone"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        href={`/leads/${lead.id}`}
                        className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="More Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
