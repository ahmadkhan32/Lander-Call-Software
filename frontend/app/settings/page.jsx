'use client';

import { useState } from 'react';
import {
  Settings, Phone, Sliders, Shield, Save, CheckCircle2,
  Key, Database, Globe
} from 'lucide-react';
import clsx from 'clsx';
import Button from '../../components/ui/Button.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('telephony');
  const [saved, setSaved] = useState(false);

  // Form states
  const [telephonyConfig, setTelephonyConfig] = useState({
    provider: 'mock',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioFromNumber: '+1 (555) 019-2834',
    webhookUrl: 'https://api.lander-crm.com/api/webhooks/telephony',
  });

  const [routingConfig, setRoutingConfig] = useState({
    autoRouting: true,
    strategy: 'least-loaded',
    agentTimeoutSeconds: 30,
    maxConcurrentLeads: 15,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'telephony', label: 'Telephony & Softphone', icon: Phone },
    { id: 'routing',   label: 'Lead Routing Engine',   icon: Sliders },
    { id: 'general',   label: 'Organization Profile',  icon: Globe },
    { id: 'security',  label: 'API Keys & Security',   icon: Key },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings & Platform Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure telephony gateway, automatic lead assignment policies, and multi-tenant security parameters.
        </p>
      </div>

      {/* Responsive Horizontal Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={clsx(
              'flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150',
              activeTab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Save Success Toast */}
      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 animate-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>System configuration successfully updated. Changes have been broadcast to active agent softphones.</span>
        </div>
      )}

      {/* ── Tab: Telephony ──────────────────────────────────────────────────── */}
      {activeTab === 'telephony' && (
        <form onSubmit={handleSave} className="card p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Voice Channel & Softphone Gateway</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select active audio provider for direct browser softphones and inbound queue handling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Telephony Provider</label>
              <select
                value={telephonyConfig.provider}
                onChange={(e) => setTelephonyConfig({ ...telephonyConfig, provider: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="mock">Simulated Telephony (Local Testing / Zero-Cost)</option>
                <option value="twilio">Twilio Programmable Voice</option>
              </select>
            </div>

            <div>
              <label className="label">Default Outbound Caller ID</label>
              <input
                type="text"
                value={telephonyConfig.twilioFromNumber}
                onChange={(e) => setTelephonyConfig({ ...telephonyConfig, twilioFromNumber: e.target.value })}
                className="input font-mono"
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>

          {telephonyConfig.provider === 'twilio' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Twilio API Credentials</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Account SID</label>
                  <input
                    type="text"
                    value={telephonyConfig.twilioAccountSid}
                    onChange={(e) => setTelephonyConfig({ ...telephonyConfig, twilioAccountSid: e.target.value })}
                    className="input font-mono"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="label">Auth Token</label>
                  <input
                    type="password"
                    value={telephonyConfig.twilioAuthToken}
                    onChange={(e) => setTelephonyConfig({ ...telephonyConfig, twilioAuthToken: e.target.value })}
                    className="input font-mono"
                    placeholder="••••••••••••••••••••••••••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="label">Telephony Webhook URL (Status & Transcripts)</label>
            <input
              type="text"
              readOnly
              value={telephonyConfig.webhookUrl}
              className="input font-mono text-slate-500 bg-slate-50 cursor-not-allowed text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Add this callback URL in your Twilio / Asterisk Voice Configuration console.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Telephony Configuration
            </Button>
          </div>
        </form>
      )}

      {/* ── Tab: Routing ────────────────────────────────────────────────────── */}
      {activeTab === 'routing' && (
        <form onSubmit={handleSave} className="card p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Automated Lead Distribution Engine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure algorithms for auto-assigning incoming leads to active call center agents.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Checkbox
                label="Enable Automatic Lead Routing"
                description="Immediately distribute leads to agents upon CSV ingestion or webhook arrival"
                checked={routingConfig.autoRouting}
                onChange={(checked) => setRoutingConfig({ ...routingConfig, autoRouting: checked })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Routing Strategy</label>
                <select
                  value={routingConfig.strategy}
                  onChange={(e) => setRoutingConfig({ ...routingConfig, strategy: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option value="least-loaded">Least-Loaded (Prioritize reps with fewest open leads)</option>
                  <option value="round-robin">Round-Robin (Equal sequential queue assignment)</option>
                  <option value="manual">Manual Assignment Only</option>
                </select>
              </div>

              <div>
                <label className="label">Max Active Leads Per Agent</label>
                <input
                  type="number"
                  value={routingConfig.maxConcurrentLeads}
                  onChange={(e) => setRoutingConfig({ ...routingConfig, maxConcurrentLeads: parseInt(e.target.value) || 1 })}
                  className="input font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Distribution Rules
            </Button>
          </div>
        </form>
      )}

      {/* ── Tab: General ────────────────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="card p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Organization & Tenant Profile</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Organization Name</label>
              <input type="text" defaultValue="Lander Demo Corp" className="input" />
            </div>
            <div>
              <label className="label">Tenant Slug</label>
              <input type="text" defaultValue="lander-demo" readOnly className="input text-slate-500 font-mono bg-slate-50" />
            </div>
            <div>
              <label className="label">Active Subscription Tier</label>
              <input type="text" defaultValue="Enterprise Multi-Agent (Unlimited)" readOnly className="input text-blue-700 font-semibold bg-blue-50/50" />
            </div>
            <div>
              <label className="label">Tenant ID (UUID)</label>
              <input type="text" defaultValue="00000000-0000-0000-0000-000000000001" readOnly className="input font-mono text-xs text-slate-500 bg-slate-50" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Security ───────────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="card p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Platform Security & Multi-Tenancy Isolations</span>
            </h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Supabase Row-Level Security (RLS)</p>
                  <p className="text-xs text-slate-500">Active across all 15 database tables with organization isolation</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                100% Enforced
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</p>
                  <p className="text-xs text-slate-500">10 roles configured with granular permissions across all routes</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">
                Active & Audited
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
