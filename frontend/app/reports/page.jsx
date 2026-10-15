'use client';

import { useState, useEffect } from 'react';
import { reportsApi } from '../../lib/api.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Loader2, TrendingUp, Phone, Users, Target } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';

export default function ReportsPage() {
  const [agentData, setAgentData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportsApi.agents(),
      reportsApi.campaigns(),
      reportsApi.overview(),
    ])
      .then(([agents, campaigns, ov]) => {
        setAgentData(agents.agents || []);
        setCampaignData(campaigns.campaigns || []);
        setOverview(ov.overview || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Reports & Telephony Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Comprehensive conversion reporting, agent productivity metrics, and campaign KPIs.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Leads Ingested"
          value={overview?.total_leads ?? 0}
          icon={Target}
          color="bg-blue-50 text-blue-600"
          trend="+15%"
          trendUp={true}
        />
        <StatCard
          label="Calls Completed (7 Days)"
          value={overview?.calls_last_7d ?? 0}
          icon={Phone}
          color="bg-emerald-50 text-emerald-600"
          trend="+9.2%"
          trendUp={true}
        />
        <StatCard
          label="Overdue Follow-ups"
          value={overview?.overdue_follow_ups ?? 0}
          icon={TrendingUp}
          color="bg-purple-50 text-purple-600"
          trend="Immediate"
          trendUp={!(overview?.overdue_follow_ups > 0)}
        />
      </div>

      {/* Agent Performance Chart */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Agent Performance (Last 30 Days)</span>
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            Calls Comparison
          </span>
        </div>

        {agentData.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-xs">No agent call records available</p>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="agent_id"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickFormatter={(v) => v?.slice(0, 8) || 'Agent'}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="total_calls" name="Total Calls" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed_calls" name="Completed Calls" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Campaign Performance Chart */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Campaign Volume & Outcomes (Last 30 Days)</span>
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
            Outreach Conversion
          </span>
        </div>

        {campaignData.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-xs">No campaign telemetry recorded</p>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="campaign_name"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="total_calls" name="Calls Ingested" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Successful Connections" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
