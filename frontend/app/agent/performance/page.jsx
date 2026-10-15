'use client';

import { Phone, TrendingUp, CheckCircle2, Clock, Award, Star } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function AgentPerformancePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Performance &amp; KPI Scorecard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Individual agent metrics, QA scores, daily call quotas, and conversion rates.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calls Made Today</p>
          <p className="text-3xl font-extrabold text-slate-900">48</p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" /> +14% vs yesterday
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Talk Time</p>
          <p className="text-3xl font-extrabold text-slate-900">3m 42s</p>
          <p className="text-xs text-slate-400">Target: 3m 30s</p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversions / Sales</p>
          <p className="text-3xl font-extrabold text-slate-900">12</p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> 25% conversion rate
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">QA Quality Score</p>
          <p className="text-3xl font-extrabold text-slate-900">96.8%</p>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Tier 1 Gold Agent
          </div>
        </Card>
      </div>

      {/* Hourly Call Volume breakdown */}
      <Card className="p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Today&apos;s Hourly Activity &amp; Connect Rate</h3>
        <div className="grid grid-cols-8 gap-2 pt-4 text-center">
          {[
            { hour: '9 AM', calls: 6, win: 1 },
            { hour: '10 AM', calls: 9, win: 3 },
            { hour: '11 AM', calls: 8, win: 2 },
            { hour: '12 PM', calls: 4, win: 1 },
            { hour: '1 PM', calls: 5, win: 1 },
            { hour: '2 PM', calls: 8, win: 2 },
            { hour: '3 PM', calls: 6, win: 1 },
            { hour: '4 PM', calls: 2, win: 1 },
          ].map((col, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-32 bg-slate-100 rounded-xl flex flex-col justify-end p-1 relative overflow-hidden">
                <div
                  className="w-full bg-blue-600 rounded-lg transition-all"
                  style={{ height: `${(col.calls / 10) * 100}%` }}
                />
              </div>
              <span className="block text-[11px] font-bold text-slate-600">{col.hour}</span>
              <span className="block text-[10px] text-slate-400">{col.calls} calls</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
