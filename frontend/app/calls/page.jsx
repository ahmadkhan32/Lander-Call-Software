'use client';

import { useState, useEffect } from 'react';
import { callsApi } from '../../lib/api.js';
import { useCall } from '../../lib/context/CallContext.jsx';
import { Phone, ArrowDownLeft, ArrowUpRight, Clock, Search, Loader2 } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { formatDuration, formatDate } from '../../lib/utils.js';

const STATUS_VARIANTS = {
  completed:   'green',
  in_progress: 'blue',
  initiated:   'yellow',
  failed:      'red',
  no_answer:   'gray',
  busy:        'gray',
  cancelled:   'gray',
};

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { openDialer } = useCall();

  useEffect(() => {
    setLoading(true);
    callsApi.list({ page, limit: 25 })
      .then((res) => {
        setCalls(res.calls || []);
        setPagination(res.pagination || { total: 0, pages: 1 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Call Records & Transcripts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pagination.total || 0} total inbound and outbound voice records logged
          </p>
        </div>
      </div>

      {/* Mobile Stacked Card View (< 768px) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="card text-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 mt-2 font-medium">Loading call records...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="card text-center py-16 text-slate-500">
            <Phone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">No calls recorded yet</p>
          </div>
        ) : (
          calls.map((call) => {
            const isInbound = call.direction === 'inbound';
            return (
              <div key={call.id} className="card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${isInbound ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {isInbound ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {call.leads?.full_name || 'Inbound Lead'}
                      </p>
                      <p className="text-xs font-mono text-slate-500">{call.phone_to || call.phone_from || '—'}</p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANTS[call.status] || 'gray'}>
                    {call.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {formatDuration(call.duration_seconds || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Disposition</span>
                    <span className="font-semibold text-slate-700">
                      {call.call_dispositions?.name || call.outcome || '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {call.started_at ? new Date(call.started_at).toLocaleString() : '—'}
                  </span>
                  {(call.phone_to || call.leads?.phone) && (
                    <button
                      type="button"
                      onClick={() => openDialer(call.phone_to || call.leads?.phone, call.leads)}
                      className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Redial</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop & Tablet Table (>= 768px) */}
      <div className="hidden md:block table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Direction</th>
              <th>Lead / Account</th>
              <th>Phone Number</th>
              <th>Agent</th>
              <th>Status</th>
              <th>Disposition</th>
              <th>Duration</th>
              <th>Date & Time</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Loading call records...</p>
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-500 text-sm">
                  No calls recorded yet
                </td>
              </tr>
            ) : (
              calls.map((call) => {
                const isInbound = call.direction === 'inbound';
                return (
                  <tr key={call.id}>
                    <td>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${isInbound ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {isInbound ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />}
                        <span className="capitalize">{call.direction}</span>
                      </div>
                    </td>
                    <td className="text-sm font-semibold text-slate-900">
                      {call.leads?.full_name || <span className="text-slate-400 italic">Unassigned Lead</span>}
                    </td>
                    <td className="text-xs font-mono text-slate-600">
                      {call.phone_to || call.phone_from || '—'}
                    </td>
                    <td className="text-xs text-slate-700">
                      {call.profiles?.full_name || <span className="text-slate-400">—</span>}
                    </td>
                    <td>
                      <Badge variant={STATUS_VARIANTS[call.status] || 'gray'}>
                        {call.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-slate-600">
                      {call.call_dispositions?.name || call.outcome || '—'}
                    </td>
                    <td className="text-xs font-mono text-slate-800 font-semibold">
                      {formatDuration(call.duration_seconds || 0)}
                    </td>
                    <td className="text-xs text-slate-500 font-mono">
                      {call.started_at ? new Date(call.started_at).toLocaleString() : '—'}
                    </td>
                    <td className="text-right">
                      {(call.phone_to || call.leads?.phone) && (
                        <button
                          type="button"
                          onClick={() => openDialer(call.phone_to || call.leads?.phone, call.leads)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                          title="Redial via Softphone"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
