'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ArrowUpDown, ChevronDown, Download, Plus,
  SlidersHorizontal, Check, X, Filter, Users, Globe, Star, Tag, Building2
} from 'lucide-react';
import clsx from 'clsx';

export default function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalCount = 120,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState('Descending');
  const [companyFilterOpen, setCompanyFilterOpen] = useState(false);
  const [engagedFilterOpen, setEngagedFilterOpen] = useState(false);
  const [countryFilterOpen, setCountryFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Header Row matching Screenshot 3 Lucidity CRM */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">CRM Table</h2>
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 rounded-lg hover:text-slate-900 cursor-pointer">My Leads</span>
            <span className="px-3 py-1 rounded-lg hover:text-slate-900 cursor-pointer">Message</span>
            <span className="px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm">CRM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <span>●</span>
            <span>30,000 credits</span>
          </div>

          <button
            onClick={() => alert('Exporting CSV...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download csv</span>
          </button>

          <Link
            href="/leads/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add lead</span>
          </Link>
        </div>
      </div>

      {/* Filter Pills Bar matching Screenshot 3 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        <span className="font-bold text-slate-900 whitespace-nowrap mr-1">
          My leads ({totalCount})
        </span>

        {/* Sort by pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Sort by</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {sortOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30">
              <button
                onClick={() => { setSortDirection('Ascending'); setSortOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Ascending</span>
                {sortDirection === 'Ascending' && <Check className="w-3 h-3 text-blue-600" />}
              </button>
              <button
                onClick={() => { setSortDirection('Descending'); setSortOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Descending</span>
                {sortDirection === 'Descending' && <Check className="w-3 h-3 text-blue-600" />}
              </button>
            </div>
          )}
        </div>

        {/* + Job Title */}
        <button className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          + Job title
        </button>

        {/* Company (2) with badge */}
        <button
          onClick={() => setCompanyFilterOpen(!companyFilterOpen)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap"
        >
          <span>Company</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">2</span>
        </button>

        {/* + Company Size */}
        <button className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          + Company size
        </button>

        {/* + Qualification */}
        <button
          onClick={() => onStatusChange(statusFilter ? '' : 'qualified')}
          className={clsx(
            'px-3 py-1.5 rounded-xl border shadow-sm whitespace-nowrap transition-colors',
            statusFilter ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          )}
        >
          + Qualification
        </button>

        {/* Engaged with (3) */}
        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          <span>Engaged with</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">3</span>
        </button>

        {/* + Label */}
        <button className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          + Label
        </button>

        {/* Country (12) */}
        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          <span>Country</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">12</span>
        </button>

        {/* + Score */}
        <button className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm whitespace-nowrap">
          + Score
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads by customer name, company, or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
