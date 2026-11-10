import React from 'react';
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
} from 'lucide-react';

// 1. Super Admin Dashboard (/super-admin/dashboard)
export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
            Platform Owner &bull; Global Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-2">
            Super Admin Platform Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage multi-tenant organizations, global telephony infrastructure, and subscriptions.
          </p>
        </div>
        <Link to="/app/roles-permissions">
          <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs font-semibold">
            Global Roles &amp; Permissions
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Organizations</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy mt-2">24 Active</div>
          <p className="text-xs text-slate-400 mt-1">Across 4 global regions</p>
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
          <p className="text-xs text-slate-400 mt-1">94% active concurrency</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>SIP Gateway Uptime</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2">99.992%</div>
          <p className="text-xs text-slate-400 mt-1">Carrier grade SLA</p>
        </Card>
      </div>
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
            Business Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Provision users with passwords, assign role permissions, and manage campaigns.
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
            <span>Team Roster</span>
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
