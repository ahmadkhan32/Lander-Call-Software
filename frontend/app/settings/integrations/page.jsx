'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Globe, Database, Webhook, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const INTEGRATIONS = [
  { name: 'Supabase Database & Auth', type: 'Backend DB', status: 'Connected', desc: 'Real-time PostgreSQL database, JWT auth sessions, and row-level security.' },
  { name: 'HubSpot / Salesforce Sync', type: 'CRM Bridge', status: 'Active', desc: 'Two-way bi-directional lead contact sync and call event webhooks.' },
  { name: 'Twilio / Telnyx Telephony', type: 'Voice Carrier', status: 'Connected', desc: 'Global PSTN termination, DID phone numbers, and WebRTC streaming.' },
  { name: 'Slack Notifications', type: 'Messaging', status: 'Available', desc: 'Post instant alerts to sales channel when deals or VIP leads arrive.' },
  { name: 'Zapier / Make Webhooks', type: 'Automation', status: 'Available', desc: 'Trigger automated workflows whenever call dispositions are submitted.' },
];

export default function SettingsIntegrationsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ecosystem &amp; API Integrations</h1>
          <p className="text-xs text-slate-500">Connect CRM databases, VoIP providers, webhook pipelines, and data syncs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((item, idx) => (
          <Card key={idx} className="p-5 space-y-3 border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">{item.name}</h3>
              <Badge variant={item.status === 'Connected' || item.status === 'Active' ? 'green' : 'gray'}>
                {item.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-600">{item.desc}</p>
            <div className="pt-2">
              <button
                onClick={() => alert(`Configuring ${item.name}`)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {item.status === 'Available' ? 'Connect Integration →' : 'Manage Settings →'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
