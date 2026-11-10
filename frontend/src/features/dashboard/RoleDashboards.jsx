import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Building2,
  Shield,
  CreditCard,
  Activity,
  Users,
  UserPlus,
  Megaphone,
  BarChart2,
  PhoneOutgoing,
  Target,
  Headphones,
  CheckCircle,
  FileSpreadsheet,
  UploadCloud,
  Star,
  Download,
  ShieldAlert,
  Search,
  Radio,
  Webhook,
  Key,
  PhoneCall,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

// 1. Super Admin Dashboard (/super-admin/dashboard)
export function SuperAdminDashboard() {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState('enterprise');
  const [createdAdminCreds, setCreatedAdminCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const [orgList, setOrgList] = useState([
    { id: 'org_1', name: 'Example Call Center', slug: 'example-call', admin: 'Arthur Pendelton', email: 'admin@callcenter.com', tier: 'Enterprise', seats: 45, status: 'Active' },
    { id: 'org_2', name: 'Apex Telephony Corp', slug: 'apex-telephony', admin: 'Marcus Bell', email: 'admin@apexcall.com', tier: 'Pro', seats: 28, status: 'Active' },
    { id: 'org_3', name: 'Lander Global Enterprises', slug: 'lander-global', admin: 'Sarah Miller', email: 'admin@landercrm.io', tier: 'Enterprise', seats: 120, status: 'Active' },
  ]);

  const generateAdminPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let p = '';
    for (let i = 0; i < 12; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(p);
  };

  const handleProvisionOrg = (e) => {
    e.preventDefault();
    const newOrg = {
      id: 'org_' + Date.now(),
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      admin: adminName,
      email: adminEmail,
      tier: subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1),
      seats: 25,
      status: 'Active',
    };

    setOrgList([newOrg, ...orgList]);
    setCreatedAdminCreds({
      org: orgName,
      admin: adminName,
      email: adminEmail,
      pass: adminPassword,
      loginUrl: `${window.location.origin}/login`,
    });

    setOrgName('');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
  };

  const copyAdminCredentials = () => {
    if (!createdAdminCreds) return;
    const text = `ORGANIZATION & BUSINESS ADMIN CREDENTIALS
Organization: ${createdAdminCreds.org}
Business Admin: ${createdAdminCreds.admin}
Login Email: ${createdAdminCreds.email}
Login Password: ${createdAdminCreds.pass}
Assigned Role: Business Owner / Organization Admin
Admin Dashboard: ${window.location.origin}/admin/dashboard
Login URL: ${createdAdminCreds.loginUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
            Super Admin &bull; Platform Owner &bull; Global Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            Super Admin Platform Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Provision new organizations and register Business Admins with login passwords.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowOrgModal(!showOrgModal)}
            className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showOrgModal ? 'Close Form' : 'Provision Organization & Admin'}</span>
          </Button>
          <Link to="/app/roles-permissions">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              Global Roles &amp; Permissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Credential Handover Card */}
      {createdAdminCreds && (
        <Card className="p-5 border-2 border-purple-500 bg-purple-50/50 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Check className="w-5 h-5 text-purple-600" />
              <span>Organization &amp; Business Admin Provisioned Successfully!</span>
            </div>
            <button
              type="button"
              onClick={copyAdminCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Admin Credentials'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
            <p>Organization: <strong className="text-white">{createdAdminCreds.org}</strong></p>
            <p>Business Admin: <strong className="text-white">{createdAdminCreds.admin}</strong></p>
            <p>Login Email: <strong className="text-white">{createdAdminCreds.email}</strong></p>
            <p>Password: <strong className="text-amber-300">{createdAdminCreds.pass}</strong></p>
            <p>Dashboard: <strong className="text-blue-400">/admin/dashboard</strong></p>
          </div>
          <p className="text-[11px] text-purple-700">
            Provide these credentials to the Organization Business Admin. They will sign in and register all 9 roles within their organization.
          </p>
        </Card>
      )}

      {/* Provisioning Form (Collapsible) */}
      {showOrgModal && (
        <Card className="p-6 bg-slate-50 border-purple-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-navy">
              Provision Organization &amp; Register Business Admin
            </h2>
          </div>

          <form onSubmit={handleProvisionOrg} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Call Solutions"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Subscription Tier
                </label>
                <select
                  value={subscriptionTier}
                  onChange={(e) => setSubscriptionTier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="standard">Standard (Up to 10 Seats)</option>
                  <option value="pro">Pro (Up to 50 Seats + AI Routing)</option>
                  <option value="enterprise">Enterprise (Unlimited + Dedicated SIP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Business Admin Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Business Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@acmecall.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={generateAdminPassword}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password123!"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOrgModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-5"
              >
                Provision Organization &amp; Generate Credentials
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Organizations</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy mt-2">{orgList.length} Active</div>
          <p className="text-xs text-slate-400 mt-1">Multi-tenant PostgreSQL isolation</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Subscriptions</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">$248,500 MRR</div>
          <p className="text-xs text-slate-400 mt-1">98.2% collection rate</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Total CRM Seats</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">1,480 Seats</div>
          <p className="text-xs text-slate-400 mt-1">Across all organizations</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>SIP Gateway Uptime</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2">99.992%</div>
          <p className="text-xs text-slate-400 mt-1">Carrier-grade SLA</p>
        </Card>
      </div>

      {/* Organizations Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-navy">Managed Organizations &amp; Business Admins</h2>
          <span className="text-xs font-medium text-slate-500">Global Hierarchy</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs mt-2">
          {orgList.map((o) => (
            <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-sm">{o.name}</span>
                <span className="ml-2 text-slate-400">({o.slug})</span>
                <div className="text-slate-500 mt-0.5">
                  Business Admin: <strong className="text-navy">{o.admin}</strong> &bull; {o.email}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                  {o.tier} Tier ({o.seats} seats)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// 2. Business Admin Dashboard (/admin/dashboard)
export function BusinessAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
            Organization Owner &bull; Example Call Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            Business Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create users, register role credentials with passwords, and manage campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/app/users/create">
            <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
              <UserPlus className="w-4 h-4" />
              <span>Register User &amp; Password</span>
            </Button>
          </Link>
          <Link to="/app/roles-permissions">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              Manage Permissions
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Organization Staff</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy mt-2">38 Users</div>
          <p className="text-xs text-slate-400 mt-1">Across 10 distinct roles</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-4 h-4 text-emerald-600" />
            <span>Active Campaigns</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">5 Live</div>
          <p className="text-xs text-slate-400 mt-1">Inbound &amp; outbound blended</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-purple-600" />
            <span>Call Volume Today</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2">1,240 Calls</div>
          <p className="text-xs text-slate-400 mt-1">Average handling 3m 42s</p>
        </Card>
      </div>
    </div>
  );
}

// 3. Call Center Manager Dashboard (/manager/dashboard)
export function CallCenterManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
          Call Center Manager &bull; Operations &amp; Targets
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Operations &amp; Lead Distribution
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage operational throughput, queue pacing, targets, and team performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Agents On Active Calls</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">18</div>
          <p className="text-xs text-slate-400 mt-1">4 available &bull; 2 in wrap-up</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Queue Inbound Calls</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">3</div>
          <p className="text-xs text-slate-400 mt-1">Average wait: 14s</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Target Progress</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">82%</div>
          <p className="text-xs text-slate-400 mt-1">Daily goal: 1,500 dials</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Lead Velocity</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-2">240/hr</div>
          <p className="text-xs text-slate-400 mt-1">Round-robin auto assigned</p>
        </Card>
      </div>
    </div>
  );
}

// 4. Supervisor Dashboard (/supervisor/dashboard)
export function SupervisorDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
          Supervisor / Team Leader
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Agent Monitoring &amp; Coaching Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Monitor assigned agents, live whisper, barge-in, and authorized lead reassignments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Assigned Agents</div>
          <div className="text-3xl font-extrabold text-navy mt-2">8 Agents</div>
          <p className="text-xs text-slate-400 mt-1">Team: Outbound Closers</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Calls Flagged for Review</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">4 Pending</div>
          <p className="text-xs text-slate-400 mt-1">Objection handling coaching</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Lead Reassignments</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">12 Reallocated</div>
          <p className="text-xs text-slate-400 mt-1">Transferred to top closers</p>
        </Card>
      </div>
    </div>
  );
}

// 5. Call Center Agent Dashboard (/agent/dashboard)
export function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Call Center Agent &bull; Emily Chen
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            Agent Calling Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Handle assigned leads, dial softphone, record outcomes, add notes, and schedule callbacks.
          </p>
        </div>
        <Link to="/app/dialer">
          <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
            <PhoneOutgoing className="w-4 h-4" />
            <span>Launch Predictive Dialer</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Dials Completed Today</div>
          <div className="text-3xl font-extrabold text-navy mt-2">48</div>
          <p className="text-xs text-slate-400 mt-1">Target: 60 dials</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Qualified Leads</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">14</div>
          <p className="text-xs text-slate-400 mt-1">29% conversion rate</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Scheduled Callbacks</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">7</div>
          <p className="text-xs text-slate-400 mt-1">Next callback at 2:30 PM</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Average Talk Time</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-2">3m 14s</div>
          <p className="text-xs text-slate-400 mt-1">Wrap-up time: 24s</p>
        </Card>
      </div>
    </div>
  );
}

// 6. CRM / Lead Manager Dashboard (/crm/dashboard)
export function CrmManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
          CRM &bull; Lead Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Lead Ingestion &amp; Distribution
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Import, validate, deduplicate, score, and distribute leads across campaigns and teams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Leads in CRM</div>
          <div className="text-3xl font-extrabold text-navy mt-2">14,250</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Distributed Today</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">820 Leads</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Duplicates Filtered</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">142</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Unassigned Pool</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">3,410</div>
        </Card>
      </div>
    </div>
  );
}

// 7. QA Officer Dashboard (/qa/dashboard)
export function QaOfficerDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
          Quality Assurance &bull; Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Quality Assurance &amp; Recording Auditing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review authorized call recordings, score quality rubrics, and record feedback for agents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Recordings Audited Today</div>
          <div className="text-3xl font-extrabold text-navy mt-2">26 Calls</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Average Quality Score</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">94.2%</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Dispute Inquiries</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">1 Open</div>
        </Card>
      </div>
    </div>
  );
}

// 8. Reporting Analyst Dashboard (/reports/dashboard)
export function ReportingAnalystDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-wider">
            Reporting Analyst &bull; Business Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            Performance Analytics &amp; Reporting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View permitted organization reports and export authorized datasets.
          </p>
        </div>
        <Button variant="primary" size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Pipeline Generated</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">$1.48M</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Conversion Rate</div>
          <div className="text-3xl font-extrabold text-navy mt-2">24.8%</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Avg Handle Time</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">3m 42s</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">Cost Per Lead</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-2">$14.20</div>
        </Card>
      </div>
    </div>
  );
}

// 9. Auditor Dashboard (/auditor/dashboard)
export function AuditorDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
          Auditor &bull; Compliance &amp; Regulatory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Immutable Audit Log Viewer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Read audit logs and investigate changes without modifying operational records.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search immutable security audit records..."
            className="w-full bg-transparent border-none text-slate-800 text-xs focus:outline-none"
          />
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {[
            { action: 'USER_REGISTERED_WITH_CREDENTIALS', actor: 'admin@callcenter.com', target: 'emily.chen@callcenter.com', time: '10 mins ago' },
            { action: 'ROLE_PERMISSIONS_UPDATED', actor: 'admin@callcenter.com', target: 'role:supervisor', time: '1 hour ago' },
            { action: 'ACCOUNT_SUSPENDED', actor: 'admin@callcenter.com', target: 'devon.m@callcenter.com', time: 'Yesterday' },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <span className="font-bold text-blue-600">{item.action}</span>
              <span className="text-slate-500">By: {item.actor}</span>
              <span className="text-emerald-700">Target: {item.target}</span>
              <span className="text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// 10. Integration Admin Dashboard (/integrations/dashboard)
export function IntegrationAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
          Integration Administrator
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
          Telephony Integrations &amp; Webhooks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure approved telephony integrations, webhooks, and REST credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-navy font-bold text-sm">
            <Radio className="w-5 h-5 text-emerald-600" />
            <span>Twilio Voice SIP Trunk</span>
          </div>
          <p className="text-xs text-slate-500">WebRTC audio streaming connected. &lt;45ms latency.</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            Operational
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-navy font-bold text-sm">
            <Webhook className="w-5 h-5 text-blue-600" />
            <span>CRM Inbound Webhooks</span>
          </div>
          <p className="text-xs text-slate-500">Listening on /api/webhooks/leads with HMAC verification.</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
            Verified
          </span>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-navy font-bold text-sm">
            <Key className="w-5 h-5 text-amber-600" />
            <span>API Access Tokens</span>
          </div>
          <p className="text-xs text-slate-500">2 production tokens active with rate-limiting at 100 req/s.</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            Active
          </span>
        </Card>
      </div>
    </div>
  );
}
