'use client';

import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  sparklineData = [],
  sparklineColor = '#2563EB',
  icon: Icon,
  color = 'bg-blue-50 text-blue-600',
  isLoading = false,
  className = '',
}) {
  const defaultSparkline = [
    { v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 40 }, { v: 70 }, { v: 55 }, { v: 85 }
  ];

  const data = sparklineData.length > 0 ? sparklineData : defaultSparkline;
  const gradId = `sparklineGrad-${label.replace(/\s+/g, '')}`;

  return (
    <div
      className={clsx(
        'card p-5 relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-blue-200 group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? <span className="animate-pulse text-slate-300">...</span> : value}
            </span>
            {trend && (
              <span
                className={clsx(
                  'text-xs font-bold inline-flex items-center gap-0.5',
                  trendUp ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={clsx('p-2.5 rounded-2xl flex-shrink-0 shadow-sm', color)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Mini Wave Sparkline Chart */}
      <div className="w-full h-12 mt-3 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={sparklineColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={sparklineColor}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
