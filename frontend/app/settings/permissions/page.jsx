'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Lock, ShieldCheck } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const MATRIX = [
  { resource: 'View Dashboard & Analytics', admin: true, supervisor: true, agent: false, qa: false },
  { resource: 'Access Softphone & Dials', admin: true, supervisor: true, agent: true, qa: false },
  { resource: 'Export Leads CSV / PII', admin: true, supervisor: false, agent: false, qa: false },
  { resource: 'Listen to Call Recordings', admin: true, supervisor: true, agent: false, qa: true },
  { resource: 'Create & Edit Campaigns', admin: true, supervisor: true, agent: false, qa: false },
  { resource: 'Modify Telephony & SIP Gateway', admin: true, supervisor: false, agent: false, qa: false },
  { resource: 'Score QA Call Audits', admin: true, supervisor: true, agent: false, qa: true },
];

export default function SettingsPermissionsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Granular Permissions Matrix</h1>
          <p className="text-xs text-slate-500">Fine-grained RBAC capabilities across telephony, reports, and tenant data.</p>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">System Capability</th>
                <th className="py-3.5 px-4 text-center">Super Admin</th>
                <th className="py-3.5 px-4 text-center">Supervisor</th>
                <th className="py-3.5 px-4 text-center">Agent</th>
                <th className="py-3.5 px-4 text-center">QA Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.resource}</td>
                  <td className="py-3.5 px-4 text-center">
                    {row.admin ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.supervisor ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.agent ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.qa ? <span className="text-emerald-600 font-black">✓</span> : <span className="text-slate-300">—</span>}
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
