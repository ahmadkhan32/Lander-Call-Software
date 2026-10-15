'use client';

import { useState, useEffect } from 'react';
import { campaignsApi } from '../../lib/api.js';
import Link from 'next/link';
import { Plus, PlayCircle, PauseCircle, CheckCircle, Loader2, PhoneCall, Calendar, Target } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';

const STATUS_ICONS = {
  active:    { icon: PlayCircle,   variant: 'green' },
  paused:    { icon: PauseCircle,  variant: 'yellow' },
  completed: { icon: CheckCircle,  variant: 'blue' },
  draft:     { icon: null,         variant: 'gray' },
  archived:  { icon: null,         variant: 'gray' },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignsApi.list()
      .then((res) => setCampaigns(res.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Outreach Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Predictive dialer campaigns, outbound telemarketing, and customer surveys.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Campaigns Grid: 3-col on desktop, 2-col on tablet, 1-col on mobile */}
      {loading ? (
        <div className="card text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card text-center py-20 text-slate-500 space-y-3">
          <PhoneCall className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-800">No campaigns created yet</p>
          <p className="text-xs text-slate-400">Launch an outbound campaign to start dialing target lists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((c) => {
            const { icon: Icon, variant } = STATUS_ICONS[c.status] || { variant: 'gray' };
            return (
              <div
                key={c.id}
                className="card card-hover flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={variant}>
                      {c.status}
                    </Badge>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                      {c.type || 'Outbound'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {c.name}
                    </h2>
                    {c.goal && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {c.goal}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Start Date:
                    </span>
                    <span className="font-mono text-slate-700">
                      {c.start_date ? new Date(c.start_date).toLocaleDateString() : 'Immediate'}
                    </span>
                  </div>
                  {c.end_date && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> End Date:
                      </span>
                      <span className="font-mono text-slate-700">
                        {new Date(c.end_date).toLocaleDateString()}
                      </span>
                    </div>
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
