'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function SettingsNotificationsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notification Preferences</h1>
          <p className="text-xs text-slate-500">Configure real-time push alerts, email summaries, and missed callback notices.</p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        {[
          { title: 'Inbound Call Alerts', desc: 'Trigger browser audio chime and desktop notification when call enters agent queue' },
          { title: 'Callback Reminders', desc: 'Send reminder 15 minutes before scheduled prospect demo or callback' },
          { title: 'High Priority Lead Ingestion', desc: 'Notify team lead when a high-value or VIP lead is captured' },
          { title: 'Weekly Telephony KPI Digest', desc: 'Email Monday morning summary of call volume and agent rankings' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-xs font-bold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-blue-600 mt-1" />
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </Card>
    </div>
  );
}
