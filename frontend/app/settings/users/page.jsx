'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const USERS = [
  { id: 1, name: 'Ahmad Khan', email: 'ahmad@lander.crm', role: 'Super Admin', team: 'Executive', status: 'Active' },
  { id: 2, name: 'Sarah Connor', email: 's.connor@lander.crm', role: 'Senior Agent', team: 'Sales Alpha', status: 'Active' },
  { id: 3, name: 'John Smith', email: 'j.smith@lander.crm', role: 'Team Lead', team: 'Inbound Queues', status: 'Active' },
  { id: 4, name: 'Mark Davis', email: 'm.davis@lander.crm', role: 'QA Auditor', team: 'Quality Assurance', status: 'Active' },
];

export default function SettingsUsersPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Accounts &amp; Team Roster</h1>
            <p className="text-xs text-slate-500">Manage seats, invite new telemarketers, and assign supervisory roles.</p>
          </div>
        </div>
        <button
          onClick={() => alert('Invite User Modal')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <Card className="overflow-hidden p-0 border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {USERS.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-600">{u.role}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{u.team}</td>
                  <td className="py-3 px-4">
                    <Badge variant="green">{u.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-semibold text-slate-500 hover:text-blue-600">Edit</button>
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
