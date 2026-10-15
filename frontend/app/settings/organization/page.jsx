'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building, ArrowLeft, CheckCircle2, Globe, Phone } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function SettingsOrganizationPage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <Link href="/settings" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Organization &amp; Tenant Profile</h1>
          <p className="text-xs text-slate-500">Company identity, business hours, calling address, and billing entity.</p>
        </div>
      </div>

      <Card className="p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Lander Global Telecom"
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Workspace Domain / Slug
              </label>
              <input
                type="text"
                defaultValue="lander-telecom"
                disabled
                className="w-full text-xs font-mono bg-slate-100 rounded-xl border border-slate-300 p-2.5 text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Support Phone
              </label>
              <input
                type="text"
                defaultValue="+1 (800) 440-2000"
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Zone
              </label>
              <select className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:outline-none">
                <option>Eastern Time (US &amp; Canada) UTC-05:00</option>
                <option>Central Time (US &amp; Canada) UTC-06:00</option>
                <option>Pacific Time (US &amp; Canada) UTC-08:00</option>
              </select>
            </div>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Organization settings saved successfully!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
            >
              Save Organization Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
