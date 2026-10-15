'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Download, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function ReportsCallsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/reports" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Telephony Call Volume Analytics</h1>
            <p className="text-xs text-slate-500">Inbound vs outbound volume, duration distribution, and disposition outcomes.</p>
          </div>
        </div>
        <button
          onClick={() => alert('Exporting call report CSV...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Calls This Month</p>
          <p className="text-3xl font-extrabold text-slate-900">14,892</p>
          <span className="text-xs text-emerald-600 font-bold">+18.2% vs last month</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Call Duration</p>
          <p className="text-3xl font-extrabold text-slate-900">03m 48s</p>
          <span className="text-xs text-slate-400">Total talk time: 943 hours</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">First-Call Resolution</p>
          <p className="text-3xl font-extrabold text-emerald-600">76.4%</p>
          <span className="text-xs text-slate-400">Industry benchmark: 70%</span>
        </Card>
      </div>
    </div>
  );
}
