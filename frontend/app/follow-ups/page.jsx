'use client';

import { useState, useEffect } from 'react';
import { followUpsApi } from '../../lib/api.js';
import { useCall } from '../../lib/context/CallContext.jsx';
import { Calendar, AlertTriangle, CheckCircle2, Clock, Loader2, Phone } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';

const STATUS_VARIANTS = {
  pending:   'yellow',
  completed: 'green',
  cancelled: 'gray',
  overdue:   'red',
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const { openDialer } = useCall();

  const fetchFollowUps = async () => {
    setLoading(true);
    const params = {};
    if (filter) params.status = filter;
    try {
      const res = await followUpsApi.list(params);
      setFollowUps(res.followUps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [filter]);

  const complete = async (id) => {
    await followUpsApi.update(id, { status: 'completed' });
    fetchFollowUps();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Follow-ups & Scheduled Callbacks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Time-sensitive customer engagements, callbacks, and SDR reminders.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input w-full sm:w-44 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="card text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading scheduled tasks...</p>
        </div>
      ) : followUps.length === 0 ? (
        <div className="card text-center py-16 text-slate-500 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-800">No follow-ups found</p>
          <p className="text-xs text-slate-400">All customer follow-ups and scheduled calls are up to date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map((fu) => {
            const isOverdue = fu.status === 'pending' && new Date(fu.due_at) < new Date();
            return (
              <div
                key={fu.id}
                className={`card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isOverdue ? 'border-red-300 bg-red-50/20' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`p-3 rounded-2xl flex-shrink-0 mt-0.5 ${
                      isOverdue ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {isOverdue ? <AlertTriangle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
                        {fu.leads?.full_name || 'Prospect Lead'}
                      </span>
                      {fu.leads?.phone && (
                        <span className="text-xs font-mono text-slate-500">
                          ({fu.leads.phone})
                        </span>
                      )}
                      <Badge variant={isOverdue ? 'red' : STATUS_VARIANTS[fu.status] || 'gray'}>
                        {isOverdue ? 'Overdue' : fu.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(fu.due_at).toLocaleString()}</span>
                    </p>

                    {fu.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1.5 leading-relaxed">
                        {fu.notes}
                      </p>
                    )}

                    {fu.profiles && (
                      <p className="text-[11px] text-slate-400 pt-0.5">
                        Assigned Rep: <span className="text-slate-600 font-semibold">{fu.profiles.full_name}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  {fu.leads?.phone && (
                    <button
                      type="button"
                      onClick={() => openDialer(fu.leads.phone, fu.leads)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Dial Now</span>
                    </button>
                  )}
                  {fu.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => complete(fu.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Done</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
