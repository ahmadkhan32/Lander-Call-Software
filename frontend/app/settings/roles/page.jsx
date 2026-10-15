'use client';

import Link from 'next/link';
import { ShieldCheck, Plus, ArrowLeft, Lock } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const ROLES = [
  { id: 1, name: 'Super Admin', users: 2, description: 'Full access to all platform, telephony, billing, and agent records.' },
  { id: 2, name: 'Team Supervisor / Lead', users: 4, description: 'Can view team calls, monitor live queues, audit QA, and reassign leads.' },
  { id: 3, name: 'Call Center Agent', users: 18, description: 'Access to Softphone dialer, assigned leads, and disposition forms.' },
  { id: 4, name: 'QA Auditor', users: 3, description: 'Review call recordings, transcripts, and score compliance rubrics.' },
];

export default function SettingsRolesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Roles &amp; Access Tiers</h1>
            <p className="text-xs text-slate-500">Define tenant access control and role-based permissions.</p>
          </div>
        </div>
        <button
          onClick={() => alert('New Custom Role Modal')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <Card key={role.id} className="p-5 space-y-3 border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">{role.name}</h3>
              <Badge variant="blue">{role.users} Active Users</Badge>
            </div>
            <p className="text-xs text-slate-600">{role.description}</p>
            <div className="pt-2 flex gap-2">
              <Link
                href="/settings/permissions"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Configure Permissions &rarr;
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
