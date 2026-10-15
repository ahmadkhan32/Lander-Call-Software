'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, ArrowLeft, CheckCircle2, ShieldCheck, Radio, Server } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function SettingsTelephonyPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Telephony &amp; WebRTC SIP Trunking</h1>
          <p className="text-xs text-slate-500">Configure Twilio / Telnyx SIP gateways, STUN/TURN servers, and recording rules.</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Primary Telephony Provider</h3>
            <p className="text-xs text-slate-500">Direct SIP trunk connection status</p>
          </div>
          <Badge variant="green">Connected · Twilio Voice Trunk</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              SIP Domain URI
            </label>
            <input
              type="text"
              defaultValue="lander-callcenter.sip.us1.twilio.com"
              className="w-full text-xs font-mono font-medium rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account SID
              </label>
              <input
                type="text"
                defaultValue="AC789f2849e7b284e91238947"
                className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Auth Token
              </label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••"
                className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-xs">Call Recording Compliance</span>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rec" defaultChecked className="rounded text-blue-600" />
              <label htmlFor="rec" className="text-xs text-slate-600">
                Automatically record all outbound &amp; inbound interactions for QA analysis
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
          >
            Save Telephony Config
          </button>
        </div>
      </Card>
    </div>
  );
}
