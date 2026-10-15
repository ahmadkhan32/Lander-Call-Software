import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useAuth } from '../../app/providers';
import { useToast } from '../../components/ui/Toast';
import { Award, ShieldAlert, CheckCircle, BarChart3, Settings as SettingsIcon, Save } from 'lucide-react';

export function QAPage() {
  const mockReviews = [
    { id: 'qa_1', callId: 'CALL-8821', agent: 'Emily Chen', score: '96%', compliance: 'Passed', greeting: '10/10', objectionHandling: '10/10', date: 'Today' },
    { id: 'qa_2', callId: 'CALL-8819', agent: 'Mike Ross', score: '88%', compliance: 'Passed', greeting: '9/10', objectionHandling: '8/10', date: 'Yesterday' },
    { id: 'qa_3', callId: 'CALL-8790', agent: 'Jessica Day', score: '74%', compliance: 'Coaching Req', greeting: '8/10', objectionHandling: '6/10', date: 'Oct 26' },
  ];

  const columns = [
    { header: 'Call ID', accessor: (row) => <span className="font-mono text-xs font-bold text-brand">{row.callId}</span> },
    { header: 'Agent', accessor: (row) => <span className="font-semibold text-slate-800">{row.agent}</span> },
    { header: 'Overall QA Score', accessor: (row) => <span className="font-extrabold text-navy text-sm">{row.score}</span> },
    { header: 'Compliance', accessor: (row) => <StatusBadge status={row.compliance === 'Passed' ? 'active' : 'pending'} /> },
    { header: 'Review Date', accessor: (row) => <span className="text-xs text-slate-400">{row.date}</span> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Quality Assurance & Call Auditing</h1>
      <p className="text-xs sm:text-sm text-slate-500">Review scorecards, compliance criteria, and coaching rubrics.</p>
      <DataTable columns={columns} data={mockReviews} />
    </div>
  );
}

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Executive Performance Reports</h1>
      <p className="text-xs sm:text-sm text-slate-500">Aggregated conversion analytics, call volume metrics, and agent KPIs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-navy text-base">Inbound Call Efficiency</h3>
          <p className="text-2xl font-extrabold text-brand mt-2">94.8%</p>
          <p className="text-xs text-slate-400 mt-1">First call resolution rate</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-navy text-base">Average Handle Time</h3>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">4m 18s</p>
          <p className="text-xs text-slate-400 mt-1">&darr; 22s vs last quarter</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-navy text-base">Pipeline Generated</h3>
          <p className="text-2xl font-extrabold text-purple-600 mt-2">$1.28M</p>
          <p className="text-xs text-slate-400 mt-1">Across 4 active campaigns</p>
        </Card>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || 'Sarah Miller');
  const [email, setEmail] = useState(user?.email || 'sarah.miller@landercrm.io');
  const [telephonyProvider, setTelephonyProvider] = useState('twilio');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({ title: 'Settings Saved', description: 'Your profile and system preferences were updated.', variant: 'success' });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Platform Settings</h1>
      <p className="text-xs sm:text-sm text-slate-500">Configure organization profile, SIP trunking providers, and security policies.</p>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2">Profile & Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-2 pt-4">Telephony & SIP Trunking</h2>
          <Select
            label="Default Telephony Provider"
            value={telephonyProvider}
            onChange={(e) => setTelephonyProvider(e.target.value)}
            options={[
              { value: 'twilio', label: 'Twilio Voice (SIP Trunking)' },
              { value: 'telnyx', label: 'Telnyx WebRTC Gateway' },
              { value: 'plivo', label: 'Plivo Voice API' },
            ]}
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
