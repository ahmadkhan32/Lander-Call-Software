'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Play, Star, Award, ShieldAlert, Clock, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';

const QA_RECORDS = [
  {
    id: 'qa-101',
    agent: 'Super Administrator',
    lead: 'David Miller',
    score: 98,
    compliance: 'Pass',
    duration: '4m 12s',
    date: 'Today, 2:15 PM',
    notes: 'Flawless objection handling on enterprise pricing. Closed demo commitment.',
  },
  {
    id: 'qa-102',
    agent: 'Sarah Connor',
    lead: 'Acme Systems Rep',
    score: 92,
    compliance: 'Pass',
    duration: '3m 45s',
    date: 'Today, 11:30 AM',
    notes: 'Great rapport building and clear explanation of telephony features.',
  },
  {
    id: 'qa-103',
    agent: 'Alex Murphy',
    lead: 'Marcus Vance',
    score: 84,
    compliance: 'Review Needed',
    duration: '2m 10s',
    date: 'Yesterday, 4:20 PM',
    notes: 'Missed mandatory opt-out disclaimer at beginning of call.',
  },
];

export default function QualityAssurancePage() {
  const [selectedQA, setSelectedQA] = useState(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Quality Assurance & Call Scoring
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor agent adherence to sales scripts, regulatory compliance, and customer satisfaction scores.
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Team Score', value: '94.2%', icon: Award, color: 'text-blue-600 bg-blue-50' },
          { label: 'Evaluations Completed', value: '148', icon: Star, color: 'text-amber-600 bg-amber-50' },
          { label: 'Script Compliance', value: '98.5%', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Flagged Calls', value: '2', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <div className={`p-3 rounded-2xl ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* QA Records Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Evaluation ID</th>
              <th>Agent</th>
              <th>Lead / Contact</th>
              <th>QA Score</th>
              <th>Compliance Status</th>
              <th>Call Duration</th>
              <th>Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {QA_RECORDS.map((item) => (
              <tr key={item.id}>
                <td className="font-mono text-xs font-bold text-slate-600">{item.id}</td>
                <td className="font-semibold text-slate-900 text-sm">{item.agent}</td>
                <td className="text-sm text-slate-700">{item.lead}</td>
                <td>
                  <span className="font-bold text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {item.score} / 100
                  </span>
                </td>
                <td>
                  <Badge variant={item.compliance === 'Pass' ? 'green' : 'yellow'}>
                    {item.compliance}
                  </Badge>
                </td>
                <td className="font-mono text-xs text-slate-600">{item.duration}</td>
                <td className="text-xs text-slate-500">{item.date}</td>
                <td className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedQA(item)}
                  >
                    View Scorecard
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scorecard Modal */}
      {selectedQA && (
        <Modal
          isOpen={Boolean(selectedQA)}
          onClose={() => setSelectedQA(null)}
          title={`QA Scorecard — ${selectedQA.id}`}
          description={`Evaluation for ${selectedQA.agent} on call with ${selectedQA.lead}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Final QA Rating</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                  {selectedQA.score} / 100
                </p>
              </div>
              <Badge variant={selectedQA.compliance === 'Pass' ? 'green' : 'yellow'}>
                {selectedQA.compliance}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Scoring Breakdown
              </h4>
              <div className="space-y-1.5 border border-slate-100 rounded-xl p-3 bg-white">
                {[
                  { criteria: 'Professional Greeting & Rapport', points: '20/20' },
                  { criteria: 'Customer Needs Discovery', points: '25/25' },
                  { criteria: 'Product Pitch & Value Prop', points: '25/25' },
                  { criteria: 'Objection Handling & Pricing', points: '18/20' },
                  { criteria: 'Wrap-up & Clear Next Action', points: '10/10' },
                ].map(({ criteria, points }) => (
                  <div key={criteria} className="flex justify-between py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600">{criteria}</span>
                    <span className="font-mono font-bold text-slate-900">{points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Evaluator Feedback Notes
              </h4>
              <p className="text-xs text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {selectedQA.notes}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedQA(null)}>
                Close Scorecard
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
