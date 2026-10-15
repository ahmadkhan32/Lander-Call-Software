'use client';

import { useState } from 'react';
import { Target, Plus, BarChart3, Globe, Share2, Megaphone, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const SOURCES = [
  { id: 1, name: 'Google Ads Search', type: 'PPC', leads: 482, conversionRate: '18.4%', costPerLead: '$24.50', status: 'Active' },
  { id: 2, name: 'Facebook Solar Lead Forms', type: 'Social', leads: 312, conversionRate: '12.8%', costPerLead: '$18.20', status: 'Active' },
  { id: 3, name: 'Website Organic Contact Form', type: 'Inbound Web', leads: 194, conversionRate: '28.1%', costPerLead: '$0.00', status: 'Active' },
  { id: 4, name: 'Cold B2B Outreach List', type: 'Outbound', leads: 820, conversionRate: '6.2%', costPerLead: '$4.10', status: 'Paused' },
  { id: 5, name: 'Partner Referral Network', type: 'Affiliate', leads: 95, conversionRate: '34.5%', costPerLead: '$50.00', status: 'Active' },
];

export default function LeadSourcesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lead Ingestion Channels &amp; Sources
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track lead attribution, acquisition cost, and channel conversion velocity.
          </p>
        </div>
        <button
          onClick={() => alert('Add Lead Source modal')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead Source</span>
        </button>
      </div>

      <Card className="overflow-hidden p-0 border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Channel Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Total Leads</th>
                <th className="py-3.5 px-4">Conv. Rate</th>
                <th className="py-3.5 px-4">CPL</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SOURCES.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{s.type}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{s.leads}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{s.conversionRate}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.costPerLead}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={s.status === 'Active' ? 'green' : 'gray'}>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
