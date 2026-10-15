import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { PhoneIncoming, PhoneOutgoing, Play, Download, Filter, Search } from 'lucide-react';

const mockCalls = [
  { id: 'call_1', contact: 'John Smith', company: 'TechNova Inc.', type: 'outgoing', duration: '14m 22s', outcome: 'interested', agent: 'Emily Chen', timestamp: 'Today, 2:30 PM', recording: true },
  { id: 'call_2', contact: 'Sarah Cooper', company: 'GreenTech Solutions', type: 'incoming', duration: '8m 45s', outcome: 'callback', agent: 'Mike Ross', timestamp: 'Today, 1:15 PM', recording: true },
  { id: 'call_3', contact: 'Mark Davis', company: 'NextGen Corp', type: 'outgoing', duration: '0m 42s', outcome: 'left_voicemail', agent: 'Jessica Day', timestamp: 'Today, 11:20 AM', recording: false },
  { id: 'call_4', contact: 'Amanda Vance', company: 'CloudWave', type: 'incoming', duration: '22m 10s', outcome: 'qualified', agent: 'Sarah Miller', timestamp: 'Yesterday, 4:00 PM', recording: true },
  { id: 'call_5', contact: 'Robert Paulson', company: 'FightSoft', type: 'outgoing', duration: '5m 12s', outcome: 'not_interested', agent: 'Emily Chen', timestamp: 'Yesterday, 2:10 PM', recording: true },
];

export function CallsPage() {
  const [filter, setFilter] = useState('all');

  const columns = [
    {
      header: 'Direction / Contact',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${row.type === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-brand'}`}>
            {row.type === 'incoming' ? <PhoneIncoming className="w-4 h-4" /> : <PhoneOutgoing className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-semibold text-navy">{row.contact}</p>
            <p className="text-xs text-slate-400">{row.company}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      accessor: (row) => <span className="font-mono text-xs font-semibold">{row.duration}</span>,
    },
    {
      header: 'Outcome / Disposition',
      accessor: (row) => <StatusBadge status={row.outcome} />,
    },
    {
      header: 'Agent',
      accessor: (row) => <span className="text-xs font-medium text-slate-700">{row.agent}</span>,
    },
    {
      header: 'Timestamp',
      accessor: (row) => <span className="text-xs text-slate-500">{row.timestamp}</span>,
    },
    {
      header: 'Audio Recording',
      align: 'right',
      accessor: (row) => (
        row.recording ? (
          <button
            onClick={() => alert(`Playing recording for ${row.contact}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand hover:text-white text-xs font-semibold transition"
          >
            <Play className="w-3.5 h-3.5" /> Listen
          </button>
        ) : (
          <span className="text-xs text-slate-400">No recording</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Call Logs & Recording Access
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Review telephony history, compliance recordings, audio playback, and disposition audits.
          </p>
        </div>
        <Button variant="secondary" icon={Download} size="sm">
          Export Audio CSV
        </Button>
      </div>

      <DataTable columns={columns} data={mockCalls} />
    </div>
  );
}
