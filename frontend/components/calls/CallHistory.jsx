'use client';

import { Phone, ArrowDownLeft, ArrowUpRight, Clock, User } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { formatDuration, formatDate } from '../../lib/utils.js';

export default function CallHistory({ calls = [], onRedial }) {
  if (calls.length === 0) {
    return (
      <div className="card text-center py-10 text-slate-500">
        <Phone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs">No call records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {calls.map((call) => {
        const isInbound = call.direction === 'inbound';
        return (
          <div
            key={call.id}
            className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm transition-all hover:border-blue-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2 rounded-xl flex-shrink-0 ${
                  isInbound ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}
              >
                {isInbound ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {call.leads?.full_name || call.contactName || 'Lead Call'}
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {call.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                  <span>{call.phone_to || call.phone_from || '—'}</span>
                  <span>·</span>
                  <span>{formatDuration(call.duration_seconds || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {formatDate(call.started_at || call.created_at)}
              </span>
              {onRedial && (call.phone_to || call.leads?.phone) && (
                <button
                  type="button"
                  onClick={() => onRedial(call.phone_to || call.leads?.phone, call.leads)}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Redial"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
