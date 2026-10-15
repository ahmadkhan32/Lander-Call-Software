'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function CallChart({ data = [], title = 'Weekly Call Volume' }) {
  const defaultData = [
    { day: 'Mon', calls: 42 },
    { day: 'Tue', calls: 68 },
    { day: 'Wed', calls: 55 },
    { day: 'Thu', calls: 89 },
    { day: 'Fri', calls: 73 },
    { day: 'Sat', calls: 31 },
    { day: 'Sun', calls: 18 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>{title}</span>
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Last 7 Days
        </span>
      </div>

      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="callGradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="day"
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
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ color: '#93C5FD' }}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#callGradBlue)"
              dot={{ stroke: '#2563EB', strokeWidth: 2, r: 3, fill: '#FFFFFF' }}
              activeDot={{ r: 5, stroke: '#2563EB', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
