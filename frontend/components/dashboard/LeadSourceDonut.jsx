'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

const DATA = [
  { name: 'Inbound Calls', value: 21, color: '#8B5CF6' },      // purple
  { name: 'Web Direct', value: 12, color: '#06B6D4' },         // cyan
  { name: 'Email Outreach', value: 17, color: '#EC4899' },     // pink
  { name: 'Campaign Ads', value: 21, color: '#F59E0B' },       // amber
  { name: 'Customer Referrals', value: 16, color: '#3B82F6' }, // blue
  { name: 'Partner Network', value: 13, color: '#10B981' },    // green
];

export default function LeadSourceDonut() {
  return (
    <div className="card p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Lead Source Distribution
        </h3>
        <button
          type="button"
          aria-label="Lead Source Options"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
        {/* Donut Chart */}
        <div className="sm:col-span-6 w-full h-48 sm:h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val) => [`${val}%`, 'Share']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              />
              <Pie
                data={DATA}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
              >
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total Indicator */}
          <div className="absolute text-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-900 leading-none block">100%</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Channels</span>
          </div>
        </div>

        {/* Legend */}
        <div className="sm:col-span-6 space-y-2 text-xs">
          {DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono pl-2">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
