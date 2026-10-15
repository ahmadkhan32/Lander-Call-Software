'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Phone, TrendingUp, DollarSign, CheckCircle2,
  PhoneCall, Plus, ArrowUpRight, MessageSquare, Clock
} from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const STATS = [
  { label: 'New Leads', value: '248', trend: '+18%', up: true },
  { label: 'Calls Today', value: '1,284', trend: '+11%', up: true },
  { label: 'Deals Won', value: '36', trend: '+7%', up: true },
  { label: 'Revenue', value: '$84.2k', trend: '+22%', up: true },
];

const STAGES = [
  { label: 'New', count: 248, color: 'bg-blue-600', text: 'text-blue-600' },
  { label: 'Contacted', count: 186, color: 'bg-indigo-600', text: 'text-indigo-600' },
  { label: 'Qualified', count: 94, color: 'bg-orange-500', text: 'text-orange-500' },
  { label: 'Won', count: 36, color: 'bg-emerald-500', text: 'text-emerald-500' },
];

const ACTIVITIES = [
  { dot: 'bg-emerald-500', user: 'Sarah', action: 'moved ABC Realty to Proposal', time: '2 min ago' },
  { dot: 'bg-blue-600', user: 'Ahmed', action: 'completed 18 outbound calls', time: '11 min ago' },
  { dot: 'bg-purple-600', user: 'WhatsApp', action: 'reply received from Omega Systems', time: '18 min ago' },
  { dot: 'bg-orange-500', user: 'System', action: 'new lead assigned to Team East', time: '25 min ago' },
  { dot: 'bg-emerald-500', user: 'Demo', action: 'booked for Nova Builders', time: '41 min ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in">
      {/* Top Header matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sales Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Track leads, calls, WhatsApp replies and revenue in one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </Link>
          <Link
            href="/agent/workspace"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Agent Workspace</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean White KPI Cards (Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((s, idx) => (
          <Card key={idx} className="p-6 space-y-2 border-slate-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 tracking-wide">
              {s.label}
            </p>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {s.value}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 pt-1">
              <span>{s.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Grid: Lead Conversion Trend Chart on Left, Live Sales Activity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lead Conversion Trend SVG Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-6 border-slate-200 shadow-sm rounded-2xl h-full flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Lead Conversion Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly conversion rate trajectory and deal velocity</p>
            </div>

            {/* SVG Trend Wave Curve matching Screenshot 1 */}
            <div className="py-6 px-2">
              <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1.5" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1.5" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeWidth="1.5" />

                {/* Smooth Bezier Spline */}
                <path
                  d="M 20 100 Q 80 40, 150 50 T 280 100 T 400 90 T 480 30"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Spline Anchor Dots */}
                {[
                  { cx: 20, cy: 100 },
                  { cx: 90, cy: 55 },
                  { cx: 150, cy: 50 },
                  { cx: 220, cy: 80 },
                  { cx: 280, cy: 100 },
                  { cx: 340, cy: 98 },
                  { cx: 400, cy: 75 },
                  { cx: 480, cy: 30 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="5"
                    className="fill-blue-600 stroke-white stroke-2 hover:r-6 transition-all cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            {/* Bottom 4-Stage Horizontal Summary Bar matching Screenshot 1 */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              {STAGES.map((st, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">{st.label}</span>
                  </div>
                  <p className="text-xl font-black text-slate-900">{st.count}</p>
                  <div className={`h-1.5 w-full rounded-full ${st.color}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Live Sales Activity (Screenshot 1) */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-6 border-slate-200 shadow-sm rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Live Sales Activity
              </h3>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Real-time
              </span>
            </div>

            <div className="space-y-4 my-auto">
              {ACTIVITIES.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                  <span className={`w-3 h-3 rounded-full ${act.dot} mt-1 flex-shrink-0 ring-4 ring-slate-100`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 font-medium leading-snug">
                      <strong className="text-slate-900 font-bold">{act.user}</strong> {act.action}
                    </p>
                    <span className="text-[11px] text-slate-400 font-normal">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link href="/audit-logs" className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View Full Activity Trail</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
