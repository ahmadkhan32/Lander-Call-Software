'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building, Plus, ArrowLeft, ShieldCheck, DollarSign } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const ORGS = [
  { id: 1, name: 'Lander Telecom Group', plan: 'Enterprise', seats: 45, mrr: '$4,200/mo', status: 'Active' },
  { id: 2, name: 'Apex Solar Solutions', plan: 'Pro', seats: 20, mrr: '$1,900/mo', status: 'Active' },
  { id: 3, name: 'Metro Healthcare Inbound', plan: 'Enterprise', seats: 60, mrr: '$5,800/mo', status: 'Active' },
  { id: 4, name: 'Horizon Real Estate CRM', plan: 'Starter', seats: 8, mrr: '$750/mo', status: 'Trial' },
];

export default function PlatformOrganizationsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Multi-Tenant Platform Organizations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Super-admin directory of provisioned CRM tenants and corporate accounts.
          </p>
        </div>
        <button
          onClick={() => alert('Provision New Tenant Modal')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Tenant</span>
        </button>
      </div>

      <Card className="overflow-hidden p-0 border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Organization Name</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Active Seats</th>
                <th className="py-3.5 px-4">MRR</th>
                <th className="py-3.5 px-4">Tenant Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ORGS.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{org.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{org.plan}</td>
                  <td className="py-3.5 px-4 text-slate-600">{org.seats} seats</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{org.mrr}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={org.status === 'Active' ? 'green' : 'yellow'}>{org.status}</Badge>
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
