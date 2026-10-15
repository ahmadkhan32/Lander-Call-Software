'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Award, Clock, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function AgentProfileDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/agents"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Agent Profile: Sarah Connor
          </h1>
          <p className="text-xs text-slate-500">Agent ID: #{params.id || 'ag-204'} · Senior Telephony Representative</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              SC
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-3">Sarah Connor</h2>
            <p className="text-xs text-slate-500">Outbound Sales Team Alpha</p>
            <div className="mt-2">
              <Badge variant="green">Online · In Call</Badge>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>s.connor@lander.crm</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-mono">Ext. 1042</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-bold text-slate-800">QA Score: 98.4%</span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Calls</span>
              <p className="text-2xl font-black text-slate-900">1,482</p>
            </Card>
            <Card className="p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Deals</span>
              <p className="text-2xl font-black text-emerald-600">342</p>
            </Card>
            <Card className="p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Duration</span>
              <p className="text-2xl font-black text-slate-900">03:45</p>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Recent Call Dispositions</h3>
            <div className="space-y-2 text-xs">
              {[
                { contact: 'Lincoln Donin', outcome: 'Sale Closed', time: '12m ago', duration: '05:12' },
                { contact: 'Gustavo Philips', outcome: 'Callback Scheduled', time: '45m ago', duration: '03:10' },
                { contact: 'Elena Rostova', outcome: 'Qualified Lead', time: '2h ago', duration: '04:02' },
              ].map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{c.contact}</p>
                    <p className="text-[11px] text-slate-500">{c.time} · {c.duration}</p>
                  </div>
                  <Badge variant={c.outcome.includes('Sale') ? 'green' : 'blue'}>
                    {c.outcome}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
