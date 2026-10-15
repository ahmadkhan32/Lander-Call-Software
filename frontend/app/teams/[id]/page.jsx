'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function TeamDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/teams"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Team Alpha — Inbound Telephony
          </h1>
          <p className="text-xs text-slate-500">Queue ID: #{params.id || 'team-1'} · Shift: 08:00 - 17:00 EST</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Members</span>
          <p className="text-2xl font-black text-slate-900">8 Agents</p>
        </Card>
        <Card className="p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Call Handle Time</span>
          <p className="text-2xl font-black text-slate-900">03m 22s</p>
        </Card>
        <Card className="p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Team SLA Compliance</span>
          <p className="text-2xl font-black text-emerald-600">99.2%</p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Assigned Agents in this Queue</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {[
            { name: 'Sarah Connor', role: 'Senior Agent', status: 'Online · Active Call' },
            { name: 'John Smith', role: 'Team Lead', status: 'Online · Ready' },
            { name: 'Michael Brown', role: 'Telephony Specialist', status: 'Wrap-Up' },
            { name: 'Elena Rostova', role: 'Agent', status: 'Break' },
          ].map((agent, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{agent.name}</p>
                <p className="text-slate-500">{agent.role}</p>
              </div>
              <Badge variant={agent.status.includes('Online') ? 'green' : 'yellow'}>
                {agent.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
