/**
 * OrganizationsPage.jsx
 * Route: /app/organizations  (Super Admin only)
 * 
 * Displays all organizations managed on the LANDER platform.
 * Super Admin can provision new organizations and register Business Admins.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import {
  Building2, UserPlus, RefreshCw, Check, Copy,
  Plus, Shield, CreditCard, Users, Activity,
} from 'lucide-react';

const INITIAL_ORGS = [
  {
    id: 'org_001',
    name: 'Example Call Center',
    slug: 'example-call-center',
    status: 'active',
    subscription_tier: 'Enterprise',
    max_seats: 100,
    admin_name: 'Arthur Pendelton',
    admin_email: 'admin@callcenter.com',
    created_at: '2024-01-15',
  },
  {
    id: 'org_002',
    name: 'Apex Telephony Corp',
    slug: 'apex-telephony',
    status: 'active',
    subscription_tier: 'Pro',
    max_seats: 50,
    admin_name: 'Marcus Bell',
    admin_email: 'admin@apexcall.com',
    created_at: '2024-02-20',
  },
  {
    id: 'org_003',
    name: 'Lander Global Enterprises',
    slug: 'lander-global',
    status: 'active',
    subscription_tier: 'Enterprise',
    max_seats: 200,
    admin_name: 'Sarah Miller',
    admin_email: 'admin@landercrm.io',
    created_at: '2024-01-01',
  },
];

export function OrganizationsPage() {
  const { addToast } = useToast();
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [orgName, setOrgName] = useState('');
  const [tier, setTier] = useState('enterprise');
  const [maxSeats, setMaxSeats] = useState(25);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let p = '';
    for (let i = 0; i < 14; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
    setAdminPassword(p);
  };

  const handleProvision = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('lander_auth_token') || 'demo-superadmin-token';
      const res = await fetch(`${apiBase}/api/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: orgName,
          subscription_tier: tier,
          max_seats: parseInt(maxSeats),
          admin_name: adminName,
          admin_email: adminEmail,
          admin_password: adminPassword,
        }),
      });

      const data = res.ok ? await res.json() : null;
      const org = data?.data?.organization || {
        id: `org_${Date.now()}`,
        name: orgName,
        slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'active',
        subscription_tier: tier.charAt(0).toUpperCase() + tier.slice(1),
        max_seats: maxSeats,
        admin_name: adminName,
        admin_email: adminEmail,
        created_at: new Date().toISOString().split('T')[0],
      };

      setOrgs([org, ...orgs]);
      setCreatedCreds({
        org: orgName,
        adminName,
        adminEmail,
        adminPassword,
        dashboardUrl: `${window.location.origin}/admin/dashboard`,
        loginUrl: `${window.location.origin}/login`,
      });

      addToast({
        title: 'Organization Provisioned',
        description: `${orgName} created with Business Admin ${adminEmail}`,
        variant: 'success',
      });

      setOrgName(''); setAdminName(''); setAdminEmail(''); setAdminPassword('');
      setShowForm(false);
    } catch (err) {
      addToast({ title: 'Error', description: 'Failed to provision organization.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyCreds = () => {
    if (!createdCreds) return;
    const text = `LANDER CRM - ORGANIZATION & BUSINESS ADMIN CREDENTIALS
Organization: ${createdCreds.org}
Business Admin: ${createdCreds.adminName}
Login Email: ${createdCreds.adminEmail}
Password: ${createdCreds.adminPassword}
Assigned Role: Business Owner / Organization Admin
Admin Dashboard: ${createdCreds.dashboardUrl}
Login URL: ${createdCreds.loginUrl}

NOTE: Provide these credentials securely. Admin should change password on first login.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({ title: 'Credentials Copied', description: 'Business Admin credentials copied to clipboard.', variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const columns = [
    {
      header: 'Organization',
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.name}</div>
          <div className="text-xs text-slate-400 font-mono">{row.slug}</div>
        </div>
      ),
    },
    {
      header: 'Business Admin',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-700 text-xs">{row.admin_name}</div>
          <div className="text-xs text-slate-400">{row.admin_email}</div>
        </div>
      ),
    },
    {
      header: 'Subscription',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <CreditCard className="w-3 h-3" />
          {row.subscription_tier} · {row.max_seats} seats
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const nextStatus = row.status === 'active' ? 'suspended' : 'active';
              setOrgs(orgs.map((o) => (o.id === row.id ? { ...o, status: nextStatus } : o)));
              addToast({ title: `Organization ${nextStatus}`, description: `${row.name} status updated.` });
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            {row.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Super Admin · Platform Owner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Organizations & Business Admins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provision new organizations and register Business Admins with login credentials.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Provision Organization & Admin'}</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Building2 className="w-4 h-4 text-blue-600" /> Organizations
          </div>
          <div className="text-2xl font-extrabold text-navy mt-1">{orgs.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Users className="w-4 h-4 text-emerald-600" /> Total Seats
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {orgs.reduce((sum, o) => sum + (o.max_seats || 0), 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Activity className="w-4 h-4 text-purple-600" /> Active
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {orgs.filter((o) => o.status === 'active').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <CreditCard className="w-4 h-4 text-amber-600" /> Enterprise
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {orgs.filter((o) => o.subscription_tier?.toLowerCase() === 'enterprise').length}
          </div>
        </Card>
      </div>

      {/* Credential Handover Card */}
      {createdCreds && (
        <Card className="p-5 border-2 border-purple-500 bg-purple-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Check className="w-5 h-5 text-purple-600" />
              <span>Organization & Business Admin Provisioned!</span>
            </div>
            <button
              onClick={copyCreds}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
            <p>Organization: <strong className="text-white">{createdCreds.org}</strong></p>
            <p>Business Admin: <strong className="text-white">{createdCreds.adminName}</strong></p>
            <p>Login Email: <strong className="text-white">{createdCreds.adminEmail}</strong></p>
            <p>Password: <strong className="text-amber-300">{createdCreds.adminPassword}</strong></p>
            <p>Dashboard: <strong className="text-blue-400">/admin/dashboard</strong></p>
            <p>Login URL: <strong className="text-slate-400">{createdCreds.loginUrl}</strong></p>
          </div>
          <p className="text-[11px] text-purple-700">
            Provide these credentials securely. Business Admin signs in and registers all roles within their organization.
          </p>
        </Card>
      )}

      {/* Provision Form */}
      {showForm && (
        <Card className="p-6 bg-slate-50 border-purple-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-navy">Provision Organization & Register Business Admin</h2>
          </div>

          <form onSubmit={handleProvision} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Organization Name *</label>
                <input
                  type="text" required value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Call Solutions"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Subscription Tier</label>
                <select value={tier} onChange={(e) => setTier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand">
                  <option value="standard">Standard (Up to 10 Seats)</option>
                  <option value="pro">Pro (Up to 50 Seats + AI Routing)</option>
                  <option value="enterprise">Enterprise (Unlimited + Dedicated SIP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Business Admin Name *</label>
                <input type="text" required value={adminName} onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Business Admin Email *</label>
                <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@acmecall.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password *</label>
                  <button type="button" onClick={generatePassword}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input type="text" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}
                className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-5">
                Provision Organization & Generate Credentials
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Organizations Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-navy">Managed Organizations</h2>
          <span className="text-xs text-slate-400">Platform · Global Hierarchy</span>
        </div>
        <DataTable columns={columns} data={orgs} />
      </Card>
    </div>
  );
}

