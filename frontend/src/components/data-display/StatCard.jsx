import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  sparklineData = [10, 25, 18, 30, 22, 40, 35, 50],
  strokeColor = '#2563EB',
  className,
}) {
  // Generate simple SVG path for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card className={cn('relative overflow-hidden p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md',
              isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            )}
          >
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>

      {/* Sparkline curve */}
      <div className="mt-4 pt-1 flex justify-end">
        <svg width="100%" height="36" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </Card>
  );
}
