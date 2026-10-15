'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';

const DATA = [
  { time: '-10h', amount: 35, count: 50 },
  { time: '-8h',  amount: 60, count: 85 },
  { time: '-6h',  amount: 45, count: 65 },
  { time: '-4h',  amount: 85, count: 120 },
  { time: '-2h',  amount: 70, count: 95 },
  { time: 'Now',  amount: 95, count: 130 },
];

export default function UserTrafficSpline() {
  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Hourly Ingestion & Call Traffic
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time concurrent lead flow</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-sky-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Amount ($k)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Count (Dials)
            </span>
          </div>
          <button
            type="button"
            aria-label="Traffic Options"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-56 sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 11 }}
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
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#38BDF8"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: '#38BDF8', strokeWidth: 2, fill: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#F43F5E"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: '#F43F5E', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
