'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Target } from 'lucide-react';

export default function LeadChart({ data = [] }) {
  const defaultData = [
    { status: 'New', count: 34 },
    { status: 'Contacted', count: 52 },
    { status: 'Qualified', count: 28 },
    { status: 'Converted', count: 19 },
    { status: 'Lost', count: 11 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>Lead Conversion Pipeline</span>
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Status Breakdown
        </span>
      </div>

      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="status"
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
            <Bar
              dataKey="count"
              name="Leads"
              fill="#16A34A"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
