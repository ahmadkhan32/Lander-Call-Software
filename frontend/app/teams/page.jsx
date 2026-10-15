'use client';

import { useState } from 'react';
import { Users, ShieldCheck, Plus, Sliders, Clock, PhoneCall, Headphones, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';

const INITIAL_TEAMS = [
  {
    id: 'team-1',
    name: 'Enterprise Outbound SDRs',
    strategy: 'Least-Loaded',
    agentsCount: 8,
    activeCalls: 3,
    avgWaitTime: '12s',
    slaTarget: '95%',
    status: 'active',
  },
  {
    id: 'team-2',
    name: 'Tier-1 Customer Support Queue',
    strategy: 'Round-Robin',
    agentsCount: 12,
    activeCalls: 5,
    avgWaitTime: '24s',
    slaTarget: '90%',
    status: 'active',
  },
  {
    id: 'team-3',
    name: 'VIP Executive Accounts',
    strategy: 'Priority Ring',
    agentsCount: 4,
    activeCalls: 1,
    avgWaitTime: '4s',
    slaTarget: '99%',
    status: 'active',
  },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    strategy: 'Least-Loaded',
    slaTarget: '95%',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newTeam = {
      id: `team-${Date.now()}`,
      name: formData.name,
      strategy: formData.strategy,
      agentsCount: 1,
      activeCalls: 0,
      avgWaitTime: '0s',
      slaTarget: formData.slaTarget,
      status: 'active',
    };
    setTeams([...teams, newTeam]);
    setIsModalOpen(false);
    setFormData({ name: '', strategy: 'Least-Loaded', slaTarget: '95%' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Call Center Teams & Queues
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure skill-based agent routing pools, SLA thresholds, and distribution rules.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create New Queue
        </Button>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((t) => (
          <Card key={t.id} hover className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Strategy: {t.strategy}</p>
                </div>
                <Badge variant={t.status === 'active' ? 'green' : 'gray'}>
                  {t.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Agents</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{t.agentsCount}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Active Calls</p>
                  <p className="text-lg font-bold text-blue-600 mt-0.5">{t.activeCalls}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">SLA Target</p>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{t.slaTarget}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Wait: {t.avgWaitTime}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href="/agents"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage Agent Roster →
              </a>
              <span className="text-[11px] text-slate-400 font-mono">ID: {t.id}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Agent Team Queue"
        description="Define a new inbound routing pool or outbound campaign team."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Queue / Team Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Tier-2 Technical Escalations"
          />

          <Select
            label="Routing Algorithm"
            value={formData.strategy}
            onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
            options={[
              { label: 'Least-Loaded (Recommended)', value: 'Least-Loaded' },
              { label: 'Round-Robin Sequential', value: 'Round-Robin' },
              { label: 'Simultaneous Ring (All Agents)', value: 'Simultaneous' },
            ]}
          />

          <Input
            label="Service Level Target (%)"
            value={formData.slaTarget}
            onChange={(e) => setFormData({ ...formData, slaTarget: e.target.value })}
            placeholder="95%"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Queue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
