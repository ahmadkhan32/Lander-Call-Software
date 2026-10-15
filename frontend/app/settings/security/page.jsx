'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Key, Smartphone } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function SettingsSecurityPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security &amp; Compliance</h1>
          <p className="text-xs text-slate-500">Two-factor authentication, session expiration, and SOC 2 / GDPR compliance.</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-500">Require TOTP authenticator code for all agent and admin logins</p>
          </div>
          <Badge variant="green">Enforced for Organization</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Idle Session Inactivity Timeout
            </label>
            <select className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none">
              <option>15 Minutes (High Security)</option>
              <option>30 Minutes (Recommended)</option>
              <option>60 Minutes</option>
              <option>4 Hours</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800">Telephony PII Data Redaction</span>
            <p className="text-slate-600">
              Credit card numbers and SSNs detected during live calls are automatically muted and redacted from audio recordings and AI transcripts.
            </p>
          </div>

          <button
            onClick={() => alert('Security policy updated.')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
          >
            Update Security Policy
          </button>
        </div>
      </Card>
    </div>
  );
}
