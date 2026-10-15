'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Download, Star, Award } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function ReportsAgentsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/reports" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Leaderboard &amp; Performance Audit</h1>
            <p className="text-xs text-slate-500">Agent conversion rankings, talk time benchmarks, and QA compliance.</p>
          </div>
        </div>
        <button
          onClick={() => alert('Exporting agent report CSV...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing Agent</p>
          <p className="text-2xl font-extrabold text-slate-900">Sarah Connor</p>
          <span className="text-xs text-emerald-600 font-bold">42 closed deals this month</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Team QA Score</p>
          <p className="text-3xl font-extrabold text-blue-600">94.8%</p>
          <span className="text-xs text-slate-400">Target standard: 90%</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Call Hours</p>
          <p className="text-3xl font-extrabold text-slate-900">1,240 hrs</p>
          <span className="text-xs text-slate-400">Across 24 active agents</span>
        </Card>
      </div>
    </div>
  );
}
