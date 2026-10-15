'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const TIERS = [
  { name: 'Starter', price: '$49/seat/mo', desc: 'Up to 5 agents, basic softphone dialer, and standard lead management.', active: 12 },
  { name: 'Professional', price: '$99/seat/mo', desc: 'Up to 25 agents, automated call recording, AI transcripts, and ACD queues.', active: 34 },
  { name: 'Enterprise', price: '$149/seat/mo', desc: 'Unlimited seats, dedicated Twilio SIP trunking, custom QA rubrics, and SSO.', active: 18 },
];

export default function PlatformSubscriptionsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SaaS Subscriptions &amp; Billing Tiers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Seat license management, billing plans, and revenue metrics across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier, idx) => (
          <Card key={idx} className="p-6 space-y-4 border-slate-200 shadow-sm relative">
            <h3 className="text-lg font-extrabold text-slate-900">{tier.name}</h3>
            <div className="text-3xl font-black text-slate-900 font-mono">{tier.price}</div>
            <p className="text-xs text-slate-600 min-h-[40px]">{tier.desc}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Subscribed Tenants:</span>
              <span className="font-bold text-blue-600">{tier.active} Organizations</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
