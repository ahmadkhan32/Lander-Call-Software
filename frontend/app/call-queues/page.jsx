'use client';

import { useState } from 'react';
import { Phone, Users, Clock, AlertTriangle, Plus, Play, Pause } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const QUEUES = [
  { id: 1, name: 'Main Sales Inbound', strategy: 'Round Robin', agentsActive: 8, callsWaiting: 3, avgWait: '24s', maxWait: '45s', status: 'Healthy' },
  { id: 2, name: 'VIP Enterprise Priority', strategy: 'Skill-Based Routing', agentsActive: 4, callsWaiting: 0, avgWait: '8s', maxWait: '15s', status: 'Healthy' },
  { id: 3, name: 'Retention & Support', strategy: 'Longest Idle Agent', agentsActive: 5, callsWaiting: 6, avgWait: '2m 10s', maxWait: '3m 40s', status: 'Congested' },
  { id: 4, name: 'Outbound Campaign Dialer', strategy: 'Predictive Dialing', agentsActive: 12, callsWaiting: 1, avgWait: '12s', maxWait: '30s', status: 'Healthy' },
];

export default function CallQueuesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ACD Telephony Call Queues
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Automated call distribution, agent assignment algorithms, and live queue health.
          </p>
        </div>
        <button
          onClick={() => alert('New Queue Configuration')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Queue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUEUES.map((q) => (
          <Card key={q.id} className="p-5 space-y-4 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{q.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{q.strategy}</p>
              </div>
              <Badge variant={q.status === 'Healthy' ? 'green' : 'red'}>
                {q.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Agents:</span>
                <span className="font-bold text-slate-800">{q.agentsActive} Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Callers in Queue:</span>
                <span className="font-bold text-blue-600">{q.callsWaiting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Wait:</span>
                <span className="font-mono font-bold text-slate-700">{q.avgWait}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
                Configure
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
