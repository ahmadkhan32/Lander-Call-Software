'use client';

import { Search, Filter, Calendar, SlidersHorizontal, X } from 'lucide-react';
import clsx from 'clsx';

const PIPELINE_TABS = [
  { id: '', label: 'All', count: 72 },
  { id: 'new', label: 'Prospects', count: 38 },
  { id: 'qualified', label: 'Meetings', count: 12 },
  { id: 'contacted', label: 'Negotiations', count: 6 },
  { id: 'converted', label: 'Closed Deals', count: 7 },
  { id: 'lost', label: 'Unqualified', count: 9 },
];

export default function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalCount = 72,
}) {
  return (
    <div className="space-y-4">
      {/* Top Pipeline Stage Tabs Bar matching Cleomind CRM Image 3 */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 text-white overflow-x-auto no-scrollbar shadow-sm">
        {PIPELINE_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={clsx(
                  'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                )}
              >
                {tab.id === '' ? totalCount : tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subheader Filter Bar: Search, Date Range, Filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-800 text-sm">Leads</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold font-mono">
            {totalCount}
          </span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline">Showing entries with real-time sync</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Date Range Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Last 90 Days</span>
          </div>

          {/* Quick Filter Button */}
          <button
            type="button"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
            title="Advanced Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
