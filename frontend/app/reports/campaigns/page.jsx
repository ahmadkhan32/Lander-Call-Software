'use client';

import Link from 'next/link';
import { ArrowLeft, Megaphone, Download, TrendingUp, BarChart3 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function ReportsCampaignsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/reports" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campaign ROI &amp; Dialing Analytics</h1>
            <p className="text-xs text-slate-500">Contact list penetration, answer rates, and campaign-level revenue attribution.</p>
          </div>
        </div>
        <button
          onClick={() => alert('Exporting campaign report CSV...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Campaigns</p>
          <p className="text-3xl font-extrabold text-slate-900">6</p>
          <span className="text-xs text-emerald-600 font-bold">4 outbound, 2 inbound queues</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">List Contact Penetration</p>
          <p className="text-3xl font-extrabold text-blue-600">84.2%</p>
          <span className="text-xs text-slate-400">Total 12,500 contacts dialed</span>
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Attributed Revenue</p>
          <p className="text-3xl font-extrabold text-emerald-600">$482,900</p>
          <span className="text-xs text-emerald-600 font-bold">ROAS 4.8x</span>
        </Card>
      </div>
    </div>
  );
}
