import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { Plus, Users, Target, PhoneCall, TrendingUp } from 'lucide-react';

const mockCampaigns = [
  { id: 'cmp_1', name: 'Q4 Enterprise SaaS Outbound', status: 'active', leads: 850, contacted: 520, conversions: 84, rate: '16.1%', script: 'Enterprise Discovery v3' },
  { id: 'cmp_2', name: 'Inbound Trial Lead Follow-up', status: 'active', leads: 420, contacted: 390, conversions: 112, rate: '28.7%', script: 'Trial Activation Script' },
  { id: 'cmp_3', name: 'Healthcare & HIPAA Outreach', status: 'pending', leads: 300, contacted: 0, conversions: 0, rate: '0.0%', script: 'HIPAA Compliance Pitch' },
  { id: 'cmp_4', name: 'Win-back Churned Accounts', status: 'completed', leads: 240, contacted: 240, conversions: 28, rate: '11.6%', script: 'Retention Offer 2024' },
];

export function CampaignsPage() {
  const columns = [
    {
      header: 'Campaign Name / Script',
      accessor: (row) => (
        <div>
          <p className="font-bold text-navy">{row.name}</p>
          <p className="text-xs text-slate-400">{row.script}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Assigned Leads',
      accessor: (row) => <span className="font-bold text-slate-800">{row.leads}</span>,
    },
    {
      header: 'Contacted',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">{row.contacted}</span>
          <span className="text-[11px] text-slate-400">({Math.round((row.contacted / (row.leads || 1)) * 100)}%)</span>
        </div>
      ),
    },
    {
      header: 'Conversions',
      accessor: (row) => <span className="font-extrabold text-emerald-600">{row.conversions}</span>,
    },
    {
      header: 'Conversion Rate',
      accessor: (row) => <span className="font-extrabold text-brand">{row.rate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Campaigns & Cadences
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage calling scripts, lead batch allocations, dialer assignments, and conversion goals.
          </p>
        </div>
        <Button variant="primary" icon={Plus} size="sm">
          Create Campaign
        </Button>
      </div>

      <DataTable columns={columns} data={mockCampaigns} />
    </div>
  );
}

export function FollowUpsPage() {
  const mockFollowUps = [
    { id: 'fup_1', contact: 'John Smith', company: 'TechNova Inc.', phone: '+1 (234) 567-8901', dueDate: 'Today, 4:00 PM', priority: 'High', status: 'pending', note: 'Call to review revised pricing package.' },
    { id: 'fup_2', contact: 'Sarah Cooper', company: 'GreenTech Solutions', phone: '+1 (555) 234-5678', dueDate: 'Tomorrow, 10:00 AM', priority: 'Medium', status: 'pending', note: 'Discuss custom SIP integration requirements.' },
    { id: 'fup_3', contact: 'Amanda Vance', company: 'CloudWave Systems', phone: '+1 (800) 456-7890', dueDate: 'Oct 30, 2024', priority: 'High', status: 'pending', note: 'Final contract sign-off call.' },
  ];

  const columns = [
    {
      header: 'Contact / Company',
      accessor: (row) => (
        <div>
          <p className="font-bold text-navy">{row.contact}</p>
          <p className="text-xs text-slate-400">{row.company} &bull; {row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Due Time',
      accessor: (row) => <span className="font-semibold text-rose-600 text-xs">{row.dueDate}</span>,
    },
    {
      header: 'Priority',
      accessor: (row) => (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-brand'}`}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Note',
      accessor: (row) => <span className="text-xs text-slate-600 max-w-xs truncate block">{row.note}</span>,
    },
    {
      header: 'Action',
      align: 'right',
      accessor: () => (
        <Button variant="primary" size="sm">
          Call Now
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Follow-up Schedule & Tasks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Scheduled callbacks, reminder alerts, and customer commitment milestones.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={mockFollowUps} />
    </div>
  );
}
