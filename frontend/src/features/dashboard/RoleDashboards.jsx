import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  Building2,
  Shield,
  ShieldCheck,
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
  FileText,
  Lock,
  Filter,
  Eye,
  AlertTriangle,
  X,
  ExternalLink,
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

// 9. Auditor Dashboard (/auditor/dashboard & /app/audit-logs)
export function AuditorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isLogsPath = location.pathname.includes('audit-logs');
  const [activeTab, setActiveTab] = useState(isLogsPath ? 'logs' : 'overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [inspectingRecord, setInspectingRecord] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState(null);

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.includes('audit-logs')) {
      setActiveTab('logs');
    } else if (location.pathname.includes('/auditor/dashboard')) {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'logs' && !location.pathname.includes('audit-logs')) {
      navigate('/app/audit-logs');
    } else if (tab === 'overview' && !location.pathname.includes('/auditor/dashboard')) {
      navigate('/auditor/dashboard');
    }
  };

  const auditRecords = [
    {
      id: 'evt_09881',
      action: 'AUTH_LOGIN_SUCCESS',
      actor: 'Arthur Pendelton',
      email: 'admin@callcenter.com',
      role: 'business_admin',
      target: 'session:sess_99014',
      ip: '192.168.1.104',
      geo: 'Dallas, TX (US)',
      time: '2 mins ago',
      timestamp: '2026-11-12T04:42:15Z',
      category: 'auth',
      severity: 'info',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      payload: {
        authMethod: 'password_credentials',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
        mfaVerified: true,
        sessionExpiry: '24h',
      },
    },
    {
      id: 'evt_09880',
      action: 'ROLE_PERMISSIONS_UPDATED',
      actor: 'Arthur Pendelton',
      email: 'admin@callcenter.com',
      role: 'business_admin',
      target: 'role:supervisor',
      ip: '192.168.1.104',
      geo: 'Dallas, TX (US)',
      time: '18 mins ago',
      timestamp: '2026-11-12T04:26:02Z',
      category: 'roles',
      severity: 'warning',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      payload: {
        roleModified: 'supervisor',
        permissionsAdded: ['calls.recording.read'],
        permissionsRemoved: [],
        approver: 'admin@callcenter.com',
        businessJustification: 'QA compliance review workflow requirement',
      },
    },
    {
      id: 'evt_09879',
      action: 'FAILED_LOGIN_ALERT',
      actor: 'unknown@external-probe.net',
      email: 'external-bot@threat-intel.org',
      role: 'unauthenticated',
      target: 'account:usr_superadmin',
      ip: '198.51.100.77',
      geo: 'Frankfurt, DE',
      time: '45 mins ago',
      timestamp: '2026-11-12T03:59:12Z',
      category: 'auth',
      severity: 'critical',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      payload: {
        threatType: 'BRUTE_FORCE_ATTEMPT',
        attemptsBlocked: 3,
        mitigation: 'IP_TEMPORARILY_BLOCKED',
        firewallRuleTriggered: 'WAF-RATE-LIMIT-SEC01',
      },
    },
    {
      id: 'evt_09878',
      action: 'USER_REGISTERED_WITH_CREDENTIALS',
      actor: 'Sarah Miller',
      email: 'sarah.miller@landercrm.io',
      role: 'super_admin',
      target: 'usr_auditor_01 (frank.audit@callcenter.com)',
      ip: '10.0.0.1',
      geo: 'New York, NY (US)',
      time: '1 hour ago',
      timestamp: '2026-11-12T03:44:50Z',
      category: 'roles',
      severity: 'info',
      hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      payload: {
        newUserId: 'usr_auditor_01',
        assignedRole: 'auditor',
        organization: 'Example Call Center',
        permissionsGranted: ['auditor.dashboard.read', 'audit_logs.read'],
      },
    },
    {
      id: 'evt_09877',
      action: 'LEAD_BULK_EXPORT',
      actor: 'Marcus Vance',
      email: 'marcus.v@callcenter.com',
      role: 'manager',
      target: 'campaign:q4_inbound (450 records)',
      ip: '192.168.1.155',
      geo: 'Austin, TX (US)',
      time: '3 hours ago',
      timestamp: '2026-11-12T01:30:11Z',
      category: 'leads',
      severity: 'warning',
      hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      payload: {
        exportType: 'CSV',
        recordCount: 450,
        classification: 'RESTRICTED_CUSTOMER_DATA',
        digitalWatermark: 'marcus.v@callcenter.com::20261112',
      },
    },
    {
      id: 'evt_09876',
      action: 'SIP_TRUNK_CREDENTIAL_ROTATED',
      actor: 'Alex Rivera',
      email: 'alex.telecom@callcenter.com',
      role: 'integration_admin',
      target: 'gateway:twilio_voice_trunk',
      ip: '192.168.1.189',
      geo: 'Chicago, IL (US)',
      time: '5 hours ago',
      timestamp: '2026-11-11T23:55:00Z',
      category: 'calls',
      severity: 'info',
      hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      payload: {
        provider: 'Twilio Voice SIP',
        trunkSid: 'TK890412891',
        healthCheckStatus: '200_OK_LATENCY_32MS',
      },
    },
    {
      id: 'evt_09875',
      action: 'ACCOUNT_SUSPENDED',
      actor: 'Arthur Pendelton',
      email: 'admin@callcenter.com',
      role: 'business_admin',
      target: 'usr_agent_03 (devon.m@callcenter.com)',
      ip: '192.168.1.104',
      geo: 'Dallas, TX (US)',
      time: 'Yesterday',
      timestamp: '2026-11-11T18:14:00Z',
      category: 'roles',
      severity: 'critical',
      hash: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      payload: {
        deactivationReason: 'EMPLOYEE_OFFBOARDING',
        revokedSessionsCount: 2,
        activeVoipRegistrationsKilled: 1,
      },
    },
    {
      id: 'evt_09874',
      action: 'COMPLIANCE_VAULT_SEALED',
      actor: 'Lander Cryptographic Ledger',
      email: 'security-cron@landercrm.io',
      role: 'system',
      target: 'merkle_root:block_batch_8992',
      ip: '127.0.0.1',
      geo: 'Secure Enclave (US-East)',
      time: 'Yesterday',
      timestamp: '2026-11-11T12:00:00Z',
      category: 'system',
      severity: 'success',
      hash: '2c624232cdd221771294dfbb379ac8b849cc1e7615f6eaf4fed27d9702909a49',
      payload: {
        eventsSealed: 14892,
        merkleRoot: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        complianceStandard: 'SOC-2 Type II / HIPAA Security Rule',
      },
    },
  ];

  const filteredRecords = auditRecords.filter((rec) => {
    const matchesQuery =
      searchQuery === '' ||
      rec.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.ip.includes(searchQuery);

    const matchesCat = categoryFilter === 'all' || rec.category === categoryFilter;
    const matchesSev = severityFilter === 'all' || rec.severity === severityFilter;

    return matchesQuery && matchesCat && matchesSev;
  });

  const runLedgerVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedStatus('All 14,892 records cryptographically verified with zero hash discrepancies. Ledger is 100% immutable.');
      addToast({
        title: 'Ledger Integrity Verified',
        description: 'SHA-256 Merkle root validated against external cryptographic timestamping authority.',
        variant: 'success',
      });
    }, 900);
  };

  const exportAsCSV = () => {
    const headers = ['ID,Timestamp,Action,Severity,Actor,Email,Role,Target,IP,Geo,SHA256Hash\n'];
    const rows = filteredRecords.map((r) =>
      `"${r.id}","${r.timestamp}","${r.action}","${r.severity}","${r.actor}","${r.email}","${r.role}","${r.target}","${r.ip}","${r.geo}","${r.hash}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lander-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Logs Exported',
      description: `Downloaded ${filteredRecords.length} records in CSV format.`,
      variant: 'success',
    });
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', `lander-audit-logs-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Logs Exported',
      description: `Downloaded ${filteredRecords.length} records in JSON format.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast-Toggle Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
              Auditor &bull; Compliance &amp; Regulatory
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOC-2 Type II Certified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            {activeTab === 'overview' ? 'Auditor Compliance & Security Cockpit' : 'Enterprise Audit Logs & Activity Inspector'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'overview'
              ? 'Independent regulatory verification, immutable audit trail analysis, and real-time security tracking.'
              : 'Real-time cryptographic audit trail of all authentication, role permissions, lead access, and system events.'}
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
          <button
            onClick={() => handleTabChange('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-navy shadow-sm font-bold'
                : 'text-slate-600 hover:text-navy hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Auditor Dashboard</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(/auditor/dashboard)</span>
          </button>
          <button
            onClick={() => handleTabChange('logs')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'logs'
                ? 'bg-white text-navy shadow-sm font-bold'
                : 'text-slate-600 hover:text-navy hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Audit Logs Stream</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(/app/audit-logs)</span>
          </button>
        </div>
      </div>

      {/* ── OVERVIEW TAB CONTENT (/auditor/dashboard) ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-l-4 border-l-blue-600 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Total Audit Events</span>
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-navy">14,892</div>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span>&bull;</span> 100% Cryptographically Chained
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-rose-500 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Security Alerts</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-extrabold text-rose-600">0 Active</div>
              <p className="text-xs text-slate-400">3 external probes blocked today</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-amber-500 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Privilege Changes</span>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-navy">12 Events</div>
              <p className="text-xs text-slate-400">All authorized by Business Admins</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-emerald-600 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Compliance Health</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">99.98%</div>
              <p className="text-xs text-slate-400">SOC-2, HIPAA, PCI-DSS Level 1</p>
            </Card>
          </div>

          {/* Ledger Verification Action Bar */}
          <Card className="p-5 bg-gradient-to-r from-slate-900 to-navy text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">Immutable SHA-256 Ledger Verification</h3>
              </div>
              <p className="text-xs text-slate-300">
                Independent cryptographic proof that no log records have been altered, suppressed, or rewritten.
              </p>
              {verifiedStatus && (
                <p className="text-xs text-emerald-300 font-mono mt-2 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800">
                  ✓ {verifiedStatus}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={runLedgerVerification}
                disabled={isVerifying}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Verifying Merkle Roots...' : 'Verify Cryptographic Integrity'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabChange('logs')}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Browse All Logs &rarr;</span>
              </Button>
            </div>
          </Card>

          {/* Compliance Standards Framework Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                framework: 'SOC-2 Type II',
                status: 'Certified & Monitored',
                desc: 'Continuous automated log retention and RBAC access verification.',
                color: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                framework: 'HIPAA Security Rule',
                desc: 'End-to-end cryptographic encryption for protected call recordings.',
                status: 'BAA Compliant',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
              },
              {
                framework: 'PCI-DSS Level 1',
                desc: 'Zero plaintext credit card storage; tokenized payment flows.',
                status: 'Validated',
                color: 'text-purple-700 bg-purple-50 border-purple-200',
              },
              {
                framework: 'GDPR Article 30',
                desc: 'Immutable record of customer data access and processing activities.',
                status: 'Enforced',
                color: 'text-amber-700 bg-amber-50 border-amber-200',
              },
            ].map((std, idx) => (
              <Card key={idx} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy text-sm">{std.framework}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${std.color}`}>
                    {std.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{std.desc}</p>
              </Card>
            ))}
          </div>

          {/* Recent Security Highlights */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-navy">High-Priority Security &amp; Administrative Actions</h3>
              </div>
              <button
                onClick={() => handleTabChange('logs')}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
              >
                <span>View Full Stream in /app/audit-logs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditRecords.slice(0, 5).map((r) => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        r.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : r.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {r.action}
                    </span>
                    <span className="text-slate-700 font-semibold">{r.actor}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({r.email})</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="text-emerald-700 font-semibold">{r.target}</span>
                    <span>{r.time}</span>
                    <button
                      onClick={() => setInspectingRecord(r)}
                      className="text-brand hover:underline font-sans text-xs font-bold"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── LOGS STREAM TAB CONTENT (/app/audit-logs) ── */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Controls: Search, Category Filters, Severity, Exports */}
          <Card className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="flex-1 flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by action (e.g. AUTH_LOGIN, ROLE), actor email, target, or IP address..."
                  className="w-full bg-transparent border-none text-slate-800 text-xs focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Severity Dropdown Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none font-medium"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                </select>

                {/* Export Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAsCSV}
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAsJSON}
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </Button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Categories:</span>
              {[
                { id: 'all', label: 'All Events (14,892)' },
                { id: 'auth', label: 'Auth & Sessions' },
                { id: 'roles', label: 'Roles & RBAC' },
                { id: 'leads', label: 'Leads & CRM' },
                { id: 'calls', label: 'Telephony & Voice' },
                { id: 'system', label: 'System Vault' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                    categoryFilter === cat.id
                      ? 'bg-navy text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Interactive Audit Logs Table */}
          <Card className="overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp &amp; Event</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Actor (Initiator)</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">Origin IP &amp; Geo</th>
                    <th className="py-3 px-4">SHA-256 Seal</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 font-sans">
                        No audit records match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-mono text-slate-400 text-[11px]">{r.time}</div>
                          <div className="font-bold text-navy text-xs font-mono">{r.action}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                              r.severity === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : r.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800'
                                : r.severity === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {r.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-semibold text-slate-800">{r.actor}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{r.email}</div>
                          <span className="inline-block text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-mono mt-0.5">
                            {r.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                          {r.target}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-600">
                          <div className="font-mono text-xs">{r.ip}</div>
                          <div className="text-[11px] text-slate-400">{r.geo}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400" title={r.hash}>
                          {r.hash.slice(0, 10)}...{r.hash.slice(-6)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInspectingRecord(r)}
                            className="text-xs font-bold text-brand hover:text-blue-800"
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredRecords.length} of {auditRecords.length} audit trail records</span>
              <span className="font-mono text-[11px] text-slate-400">SOC-2 Type II Automated Retention: 7 Years</span>
            </div>
          </Card>
        </div>
      )}

      {/* Record Payload Inspection Modal */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand" />
                <h3 className="font-extrabold text-navy text-base">
                  Audit Record Inspector: {inspectingRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Event Action</span>
                <span className="font-mono font-bold text-brand text-xs">{inspectingRecord.action}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Timestamp</span>
                <span className="font-mono text-slate-800 text-xs">{inspectingRecord.timestamp}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Actor</span>
                <span className="font-semibold text-slate-800">{inspectingRecord.actor} ({inspectingRecord.email})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Target Resource</span>
                <span className="font-mono text-emerald-700">{inspectingRecord.target}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Cryptographic SHA-256 HMAC Signature
              </span>
              <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl break-all">
                {inspectingRecord.hash}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Payload Metadata (JSON)
              </span>
              <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-xl max-h-48 overflow-y-auto">
                {JSON.stringify(inspectingRecord.payload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setInspectingRecord(null)}
                className="text-xs font-semibold"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
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
