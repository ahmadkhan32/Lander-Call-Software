'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { leadsApi } from '../../lib/api.js';
import { useCall } from '../../lib/context/CallContext.jsx';
import { Plus, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import LeadFilters from '../../components/leads/LeadFilters.jsx';
import LeadTable from '../../components/leads/LeadTable.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

export default function LeadsPage() {
  const { openDialer } = useCall();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await leadsApi.list(params);
      setLeads(res.leads || []);
      setPagination(res.pagination || { page: 1, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleCallLead = (phone, lead) => {
    openDialer(phone, lead);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pagination.total || 0} total leads registered in workspace
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <LeadFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
        onClear={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
        totalCount={pagination.total || leads.length || 72}
      />

      {/* Responsive Table & Mobile Cards */}
      <LeadTable
        leads={leads}
        loading={loading}
        onCall={handleCallLead}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
