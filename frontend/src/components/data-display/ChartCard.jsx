import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { Filter } from 'lucide-react';

export function ChartCard({ title, subtitle, action, children, className }) {
  return (
    <Card className={cn('p-5 sm:p-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="pt-4">{children}</div>
    </Card>
  );
}

export function FilterBar({ children, className }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5 py-3', className)}>
      {children}
    </div>
  );
}
