'use client';

import { MoreHorizontal } from 'lucide-react';

const STAGES = [
  { name: 'Prospecting', amount: '$85,400', percent: 85, color: 'bg-[#FF6B6B]' },
  { name: 'Qualification', amount: '$55,200', percent: 55, color: 'bg-[#FBBF24]' },
  { name: 'Proposal Active', amount: '$90,100', percent: 90, color: 'bg-[#38BDF8]' },
  { name: 'Negotiation', amount: '$40,300', percent: 40, color: 'bg-[#A855F7]' },
];

export default function PipelineStageProgress() {
  return (
    <div className="card p-5 sm:p-6 space-y-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Sales & Deal Pipeline Stages
        </h3>
        <button
          type="button"
          aria-label="Pipeline Stage Options"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {STAGES.map((s) => (
          <div key={s.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{s.name}</span>
              <span className="font-mono font-bold text-slate-900">{s.amount}</span>
            </div>
            {/* Horizontal Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${s.color}`}
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stage Legend Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
        {STAGES.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
