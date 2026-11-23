import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import {
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Pause,
  Download,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  User,
} from 'lucide-react';

const INITIAL_CALLS = [
  { id: 'call_1', contact: 'John Smith', company: 'TechNova Inc.', phone: '+92 347 0838718', type: 'outgoing', duration: '14m 22s', outcome: 'interested', agent: 'Emily Chen', timestamp: 'Today, 2:30 PM', recording: true, notes: 'Interested in enterprise SIP dialer integration.' },
  { id: 'call_2', contact: 'Sarah Cooper', company: 'GreenTech Solutions', phone: '+44 7911 123456', type: 'incoming', duration: '8m 45s', outcome: 'callback', agent: 'Mike Ross', timestamp: 'Today, 1:15 PM', recording: true, notes: 'Follow-up requested tomorrow morning.' },
  { id: 'call_3', contact: 'Mark Davis', company: 'NextGen Corp', phone: '+353 87 1234567', type: 'outgoing', duration: '0m 42s', outcome: 'left_voicemail', agent: 'Jessica Day', timestamp: 'Today, 11:20 AM', recording: false, notes: 'Left standard intro voicemail.' },
  { id: 'call_4', contact: 'Amanda Vance', company: 'CloudWave', phone: '+92 300 1234567', type: 'incoming', duration: '22m 10s', outcome: 'qualified', agent: 'Sarah Miller', timestamp: 'Yesterday, 4:00 PM', recording: true, notes: 'Sales Qualified Lead. 50 seat deployment.' },
  { id: 'call_5', contact: 'Robert Paulson', company: 'FightSoft', phone: '+44 20 7946 0991', type: 'outgoing', duration: '5m 12s', outcome: 'not_interested', agent: 'Emily Chen', timestamp: 'Yesterday, 2:10 PM', recording: true, notes: 'Current telephony contract expires in Q4.' },
  { id: 'call_6', contact: 'Tariq Mehmood', company: 'Indus Logistics', phone: '+92 321 8877665', type: 'outgoing', duration: '11m 05s', outcome: 'interested', agent: 'Sarah Miller', timestamp: 'Yesterday, 10:45 AM', recording: true, notes: 'Wants Pakistan caller ID for domestic fleet dispatch.' },
];

export function CallsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [calls, setCalls] = useState(INITIAL_CALLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  // Modals & Active state
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  const [playingCallId, setPlayingCallId] = useState(null);

  // Form states
  const [formContact, setFormContact] = useState('');
  const [formPhone, setFormPhone] = useState('+92 347 0838718');
  const [formCompany, setFormCompany] = useState('');
  const [formType, setFormType] = useState('outgoing');
  const [formDuration, setFormDuration] = useState('5m 00s');
  const [formOutcome, setFormOutcome] = useState('interested');
  const [formNotes, setFormNotes] = useState('');

  // Filtered dataset
  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = directionFilter === 'all' || c.type === directionFilter;
    const matchesOutcome = outcomeFilter === 'all' || c.outcome === outcomeFilter;
    return matchesSearch && matchesDirection && matchesOutcome;
  });

  const handleCreateCall = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `call_${Date.now()}`,
      contact: formContact || 'New Prospect',
      company: formCompany || 'Independent',
      phone: formPhone,
      type: formType,
      duration: formDuration,
      outcome: formOutcome,
      agent: 'Sarah Miller',
      timestamp: 'Just now',
      recording: true,
      notes: formNotes,
    };

    setCalls([newEntry, ...calls]);
    setShowLogModal(false);
    setFormContact('');
    setFormPhone('+92 347 0838718');
    setFormCompany('');
    setFormNotes('');

    addToast({
      title: 'Call Record Created',
      description: `Logged call for ${newEntry.contact} (${newEntry.phone}).`,
      variant: 'success',
    });
  };

  const handleUpdateCall = (e) => {
    e.preventDefault();
    if (!editingCall) return;

    setCalls(calls.map((c) => (c.id === editingCall.id ? editingCall : c)));
    addToast({
      title: 'Call Updated',
      description: `Updated disposition for ${editingCall.contact}.`,
      variant: 'success',
    });
    setEditingCall(null);
  };

  const handleDeleteCall = (id, contact) => {
    setCalls(calls.filter((c) => c.id !== id));
    addToast({
      title: 'Call Record Deleted',
      description: `Removed log for ${contact}.`,
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Contact', 'Company', 'Phone', 'Type', 'Duration', 'Outcome', 'Agent', 'Timestamp', 'Notes'];
    const rows = filteredCalls.map((c) => [
      c.id,
      `"${c.contact}"`,
      `"${c.company}"`,
      `"${c.phone}"`,
      c.type,
      `"${c.duration}"`,
      c.outcome,
      `"${c.agent}"`,
      `"${c.timestamp}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lander_call_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'CSV Export Complete',
      description: `Exported ${filteredCalls.length} call records.`,
      variant: 'success',
    });
  };

  const columns = [
    {
      header: 'Direction / Contact',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${row.type === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            {row.type === 'incoming' ? <PhoneIncoming className="w-4 h-4" /> : <PhoneOutgoing className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.contact}</p>
            <p className="text-xs text-slate-400">{row.company} &bull; <span className="font-mono text-slate-500">{row.phone}</span></p>
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      accessor: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.duration}</span>,
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
      header: 'Recording & Actions',
      align: 'right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.recording ? (
            <button
              type="button"
              onClick={() => {
                const next = playingCallId === row.id ? null : row.id;
                setPlayingCallId(next);
                if (next) {
                  addToast({ title: 'Playing Call Audio', description: `Playback for ${row.contact}` });
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                playingCallId === row.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {playingCallId === row.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playingCallId === row.id ? 'Pause' : 'Listen'}</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">No Audio</span>
          )}

          <button
            type="button"
            title="Redial on Softphone"
            onClick={() => navigate(`/app/dialer?phone=${encodeURIComponent(row.phone)}&name=${encodeURIComponent(row.contact)}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Send WhatsApp"
            onClick={() => navigate(`/app/whatsapp?phone=${encodeURIComponent(row.phone)}&name=${encodeURIComponent(row.contact)}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Edit Disposition"
            onClick={() => setEditingCall({ ...row })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Delete Call Record"
            onClick={() => handleDeleteCall(row.id, row.contact)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Twilio Telephony CDR &amp; Compliance Recording
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Call History &amp; Recording Audits
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Review inbound and outbound telephony records, compliance recordings, audio playback, and disposition edits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Audio CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowLogModal(true)}
            className="text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Log Call Manually
          </Button>
        </div>
      </div>

      {/* Audio Playback Active Banner */}
      {playingCallId && (
        <Card className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center animate-pulse">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Playing Call Recording
              </p>
              <p className="text-sm font-semibold">
                {calls.find((c) => c.id === playingCallId)?.contact} &bull; {calls.find((c) => c.id === playingCallId)?.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-300">01:45 / 14:22</span>
            <button
              type="button"
              onClick={() => setPlayingCallId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contact, company, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="all">All Directions</option>
            <option value="outgoing">Outbound Calls</option>
            <option value="incoming">Inbound Calls</option>
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="all">All Dispositions</option>
            <option value="interested">Interested</option>
            <option value="callback">Callback</option>
            <option value="qualified">Qualified</option>
            <option value="left_voicemail">Left Voicemail</option>
            <option value="not_interested">Not Interested</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <DataTable columns={columns} data={filteredCalls} />

      {/* Manual Call Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-6 bg-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy">Log New Telephony Record</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCall} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+92 347 0838718"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Apex Global"
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direction</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-brand"
                  >
                    <option value="outgoing">Outbound</option>
                    <option value="incoming">Inbound</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 6m 30s"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disposition</label>
                  <select
                    value={formOutcome}
                    onChange={(e) => setFormOutcome(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-brand"
                  >
                    <option value="interested">Interested</option>
                    <option value="callback">Callback Requested</option>
                    <option value="qualified">Qualified</option>
                    <option value="left_voicemail">Left Voicemail</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Record summary of discussion..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Call Record
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Disposition Modal */}
      {editingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 bg-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy">Edit Disposition &bull; {editingCall.contact}</h3>
              <button onClick={() => setEditingCall(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCall} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disposition Outcome</label>
                <select
                  value={editingCall.outcome}
                  onChange={(e) => setEditingCall({ ...editingCall, outcome: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-brand"
                >
                  <option value="interested">Interested</option>
                  <option value="callback">Callback Requested</option>
                  <option value="qualified">Sales Qualified</option>
                  <option value="left_voicemail">Left Voicemail</option>
                  <option value="not_interested">Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Call Notes</label>
                <textarea
                  rows={4}
                  value={editingCall.notes || ''}
                  onChange={(e) => setEditingCall({ ...editingCall, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingCall(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Update Disposition
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
