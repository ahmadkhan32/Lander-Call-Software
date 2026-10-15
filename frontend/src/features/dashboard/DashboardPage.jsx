import React, { useState } from 'react';
import { StatCard } from '../../components/data-display/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Filter, Calendar, ChevronDown, RefreshCw, MessageSquare, PhoneCall, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const revenueData = [
  { month: 'Jul', actual: 20000, target: 25000 },
  { month: 'Aug', actual: 80000, target: 50000 },
  { month: 'Sep', actual: 68000, target: 110000 },
  { month: 'Oct', actual: 148500, target: 105000 },
];

const topAgents = [
  { rank: 1, name: 'Emily Chen', role: 'Enterprise Closer', value: '$54k', calls: 342, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Mike Ross', role: 'Inbound Specialist', value: '$49k', calls: 289, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Jessica Day', role: 'SDR Team Lead', value: '$41k', calls: 310, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
];

export function DashboardPage() {
  const [filterPeriod, setFilterPeriod] = useState('quarter');

  return (
    <div className="space-y-6">
      {/* Top Header matching Image 1: CRMSPHERE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Welcome back, Sarah! Here's what's happening across calls and leads today.
          </p>
        </div>

        {/* Date and Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 hidden xl:inline">
            Monday, Oct 28, 2024
          </span>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Oct 28, 2024
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards with Sparklines matching Image 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value="$148,500"
          change="8.2%"
          isPositive={true}
          sparklineData={[30, 45, 35, 60, 50, 75, 70, 95]}
          strokeColor="#2563EB"
        />
        <StatCard
          label="New Leads"
          value="412"
          change="15.4%"
          isPositive={true}
          sparklineData={[20, 30, 25, 45, 35, 55, 48, 65]}
          strokeColor="#16A34A"
        />
        <StatCard
          label="Active Deals"
          value="89"
          change="5%"
          isPositive={true}
          sparklineData={[15, 25, 18, 30, 22, 35, 28, 42]}
          strokeColor="#0D9488"
        />
        <StatCard
          label="Conversion Rate"
          value="28.1%"
          change="1.2%"
          isPositive={false}
          sparklineData={[50, 40, 48, 38, 42, 35, 38, 30]}
          strokeColor="#EA580C"
        />
      </div>

      {/* Mid-Row: Revenue Performance Area Chart & User Analytics matching Image 1 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Revenue Performance (7 cols) */}
        <Card className="xl:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-semibold text-navy">Revenue Performance</h3>
                <p className="text-xs text-slate-400 mt-0.5">Sales Overview | This Quarter | By Region</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand" /> Total Revenue
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Target
                </span>
                <button className="inline-flex items-center gap-1 text-slate-600 border border-slate-200 rounded-lg px-2 py-1 text-xs hover:bg-slate-50">
                  Filters <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600" /> Actual: $148.5k
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-300" /> Target: $105k
            </span>
          </div>
        </Card>

        {/* Right: User Analytics (5 cols) */}
        <Card className="xl:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-navy">User Analytics</h3>
            <button className="inline-flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50 font-medium">
              <Calendar className="w-3 h-3 text-slate-400" />
              21-Oct <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Donut Chart: User Retention */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 mb-2">User Retention</p>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="44" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    stroke="#2563EB"
                    strokeWidth="12"
                    strokeDasharray="276"
                    strokeDashoffset="77"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeDasharray="276"
                    strokeDashoffset="220"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-navy">72%</span>
                  <span className="block text-[10px] text-slate-400 font-semibold">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-2 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand" /> Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Churned</span>
              </div>
            </div>

            {/* Weekly Active Users Bar Preview */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 mb-2">Weekly Active Users</p>
              <div className="h-28 flex items-end justify-center gap-2 px-2 pb-1 border-b border-slate-100">
                {[
                  { day: '21', height: '65%' },
                  { day: '22', height: '90%' },
                  { day: '23', height: '45%' },
                  { day: '24', height: '95%' },
                  { day: '25', height: '88%' },
                  { day: '26', height: '60%' },
                  { day: '27', height: '90%' },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      style={{ height: bar.height }}
                      className="w-full max-w-[14px] bg-emerald-500 rounded-t transition-all hover:bg-emerald-600"
                    />
                    <span className="text-[9px] text-slate-400 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Oct 21-27 (Avg 8.4k/day)</p>
            </div>
          </div>

          {/* Recent Activity List matching Image 1 */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <p className="text-xs font-bold text-slate-700">Recent Activity</p>
            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-slate-700 font-medium">Active (72%) Retention cohort updated</span>
              </div>
              <span className="text-slate-400 text-[11px]">1 hr ago</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 font-medium">Churn activity sync: Inactive (18%)</span>
              </div>
              <span className="text-slate-400 text-[11px]">3 hrs ago</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row: Sales Pipeline Funnel & Top Performing Agents matching Image 1 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Sales Pipeline Funnel (6 cols) */}
        <Card className="xl:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-navy">Sales Pipeline</h3>
              <p className="text-xs text-slate-400 mt-0.5">Opportunity progression funnel</p>
            </div>
            <button className="inline-flex items-center gap-1 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 text-xs hover:bg-slate-50 font-medium">
              <Filter className="w-3 h-3 text-slate-400" /> Filters <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Funnel Graphic matching Image 1 */}
          <div className="py-6 flex flex-col items-center space-y-2 max-w-sm mx-auto w-full">
            <div className="w-full bg-blue-600 text-white rounded-xl py-2 px-4 flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">Qualify</span>
              <span className="text-sm font-extrabold">120</span>
            </div>
            <div className="w-[82%] bg-emerald-500 text-white rounded-xl py-2 px-4 flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">Meeting</span>
              <span className="text-sm font-extrabold">100</span>
            </div>
            <div className="w-[66%] bg-teal-600 text-white rounded-xl py-2 px-4 flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">Proposal</span>
              <span className="text-sm font-extrabold">65</span>
            </div>
            <div className="w-[50%] bg-amber-500 text-white rounded-xl py-2 px-4 flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">Closed-Won</span>
              <span className="text-sm font-extrabold">31</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-center">
            <p className="text-xs font-bold text-slate-600">
              Total: <span className="text-brand">120 Active Opportunities</span> ($412,000 Pipeline Value)
            </p>
          </div>
        </Card>

        {/* Right: Top Performing Agents Leaderboard (6 cols) */}
        <Card className="xl:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-navy">Top Performing Agents</h3>
              <p className="text-xs text-slate-400 mt-0.5">Leaderboard & closing velocity</p>
            </div>
            <button className="inline-flex items-center gap-1 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 text-xs hover:bg-slate-50 font-medium">
              <Filter className="w-3 h-3 text-slate-400" /> Filters <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Leaderboard Table matching Image 1 */}
          <div className="divide-y divide-slate-100 py-2">
            {topAgents.map((agent) => (
              <div key={agent.rank} className="flex items-center justify-between py-3 hover:bg-slate-50/80 px-2 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {agent.rank}
                  </span>
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-bold text-navy">{agent.name}</p>
                    <p className="text-[11px] text-slate-400">{agent.role} &bull; {agent.calls} calls</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-navy">{agent.value}</span>
                  <span className="block text-[11px] text-emerald-600 font-semibold">+18% vs quota</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing top 3 of 28 agents</span>
            <button className="text-brand hover:underline font-bold inline-flex items-center gap-1">
              View Agent Roster <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
