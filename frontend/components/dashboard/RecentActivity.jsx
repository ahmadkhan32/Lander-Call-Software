'use client';

import { Activity, Phone, UserCheck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecentActivity({ activities = [] }) {
  const defaultActivities = [
    {
      id: 1,
      type: 'assign',
      title: 'Lead "Maria Santos" auto-assigned',
      description: 'Distributed to Agent Reza via Least-Loaded routing',
      time: '4m ago',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      type: 'call',
      title: 'Outbound Call Completed',
      description: 'David Miller marked disposition: "Demo Scheduled"',
      time: '18m ago',
      icon: Phone,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 3,
      type: 'followup',
      title: 'Follow-up Task Resolved',
      description: 'Callback executed for "Ahmed Al-Rashid"',
      time: '1h ago',
      icon: CheckCircle2,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Real-time Workspace Activity</span>
        </h2>
        <Link href="/audit-logs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          View Audit Trail →
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const Icon = item.icon || Activity;
          return (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
              <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${item.color || 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate sm:whitespace-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
