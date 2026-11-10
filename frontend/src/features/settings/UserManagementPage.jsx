import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useAuth } from '../../app/providers';
import { useToast } from '../../components/ui/Toast';
import { ROLE_LABELS } from '../../lib/permissions';
import {
  UserPlus,
  Key,
  Mail,
  User,
  Shield,
  Check,
  Copy,
  Users,
  Building2,
  Lock,
  Phone,
  RefreshCw,
} from 'lucide-react';

const INITIAL_ROSTER = [
  {
    id: 'usr_01',
    full_name: 'Sarah Miller',
    email: 'sarah.miller@landercrm.io',
    role: 'super_admin',
    status: 'active',
    team: 'Platform Ops',
  },
  {
    id: 'usr_02',
    full_name: 'Arthur Pendelton',
    email: 'admin@callcenter.com',
    role: 'business_admin',
    status: 'active',
    team: 'Executive Leadership',
  },
  {
    id: 'usr_03',
    full_name: 'Marcus Vance',
    email: 'marcus.v@callcenter.com',
    role: 'manager',
    status: 'active',
    team: 'Inbound Sales',
  },
  {
    id: 'usr_04',
    full_name: 'Elena Rostova',
    email: 'elena.r@callcenter.com',
    role: 'supervisor',
    status: 'active',
    team: 'Outbound Closers',
  },
  {
    id: 'usr_05',
    full_name: 'Emily Chen',
    email: 'emily.chen@callcenter.com',
    role: 'agent',
    status: 'active',
    team: 'Outbound Closers',
  },
  {
    id: 'usr_06',
    full_name: 'Devon Miles',
    email: 'devon.m@callcenter.com',
    role: 'crm_manager',
    status: 'active',
    team: 'Data Operations',
  },
  {
    id: 'usr_07',
    full_name: 'David Ross',
    email: 'david.ross@callcenter.com',
    role: 'qa_officer',
    status: 'active',
    team: 'Compliance & QA',
  },
  {
    id: 'usr_08',
    full_name: 'Chloe Bennett',
    email: 'chloe.b@callcenter.com',
    role: 'reporting_analyst',
    status: 'active',
    team: 'Business Intelligence',
  },
  {
    id: 'usr_09',
    full_name: 'Frank Miller',
    email: 'frank.audit@callcenter.com',
    role: 'auditor',
    status: 'active',
    team: 'Risk & Audit',
  },
  {
    id: 'usr_10',
    full_name: 'Alex Rivera',
    email: 'alex.telecom@callcenter.com',
    role: 'integration_admin',
    status: 'active',
    team: 'Telephony & Systems',
  },
];

export function UserManagementPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agent');
  const [team, setTeam] = useState('Outbound Sales');
  const [loading, setLoading] = useState(false);

  // Handover Credentials Card state
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: 'usr_' + Date.now(),
        full_name: fullName,
        email,
        role,
        status: 'active',
        team,
      };

      setRoster([newUser, ...roster]);
      setCreatedCredentials({
        name: fullName,
        email,
        password,
        role: ROLE_LABELS[role] || role,
        roleKey: role,
        loginUrl: `${window.location.origin}/login`,
      });

      addToast({
        title: 'User Registered Successfully',
        description: `Account created for ${email}. Hand over the generated credentials below.`,
        variant: 'success',
      });

      setFullName('');
      setEmail('');
      setPassword('');
      setLoading(false);
    }, 400);
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `LANDER CRM LOGIN CREDENTIALS
User: ${createdCredentials.name}
Email: ${createdCredentials.email}
Password: ${createdCredentials.password}
Assigned Role: ${createdCredentials.role}
Login URL: ${createdCredentials.loginUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({
      title: 'Credentials Copied',
      description: 'Login details copied to clipboard ready to send to user.',
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const columns = [
    {
      header: 'Full Name',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
            {row.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{row.full_name}</div>
            <div className="text-xs text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role / Permissions',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-navy">
          <Shield className="w-3 h-3 text-blue-600" />
          {ROLE_LABELS[row.role] || row.role}
        </span>
      ),
    },
    {
      header: 'Assigned Team',
      accessor: (row) => <span className="text-xs text-slate-600 font-medium">{row.team}</span>,
    },
    {
      header: 'Account Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button
          type="button"
          onClick={() => {
            const nextStatus = row.status === 'active' ? 'suspended' : 'active';
            setRoster(
              roster.map((u) => (u.id === row.id ? { ...u, status: nextStatus } : u))
            );
            addToast({
              title: `User ${nextStatus === 'active' ? 'Re-activated' : 'Suspended'}`,
              description: `${row.full_name}'s session privileges updated.`,
            });
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          {row.status === 'active' ? 'Suspend' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Organization User Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Users &amp; Account Provisioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Business Admins create and provision accounts with passwords for all roles in their organization.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(!showCreateModal)}
          className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showCreateModal ? 'Close Form' : 'Register New User & Password'}</span>
        </Button>
      </div>

      {/* Credential Handover Card (Visible after creating account) */}
      {createdCredentials && (
        <Card className="p-5 border-2 border-emerald-500 bg-emerald-50/50 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Login Account Created &bull; Ready to Hand Over to User</span>
            </div>
            <button
              type="button"
              onClick={copyCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Credentials'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
            <p>Full Name: <strong className="text-white">{createdCredentials.name}</strong></p>
            <p>Login Email: <strong className="text-white">{createdCredentials.email}</strong></p>
            <p>Password: <strong className="text-amber-300">{createdCredentials.password}</strong></p>
            <p>Assigned Role: <strong className="text-blue-400">{createdCredentials.role}</strong></p>
            <p>Login URL: <strong className="text-slate-400">{createdCredentials.loginUrl}</strong></p>
          </div>
          <p className="text-[11px] text-emerald-700">
            Note: Administrators provision passwords directly. Users can also reset or change their password anytime via /forgot-password.
          </p>
        </Card>
      )}

      {/* Registration Form (Collapsible) */}
      {showCreateModal && (
        <Card className="p-6 bg-slate-50 border-blue-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-navy">
              Register Role with Login &amp; Password
            </h2>
          </div>

          <form onSubmit={handleRegisterUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Login Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@callcenter.com"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Login Password
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password or auto-generate"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Assign Role &amp; Separate Permissions
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  >
                    <option value="agent">Call Center Agent (/agent/dashboard)</option>
                    <option value="supervisor">Supervisor / Team Leader (/supervisor/dashboard)</option>
                    <option value="manager">Call Center Manager (/manager/dashboard)</option>
                    <option value="crm_manager">CRM / Lead Manager (/crm/dashboard)</option>
                    <option value="qa_officer">QA Officer (/qa/dashboard)</option>
                    <option value="reporting_analyst">Reporting Analyst (/reports/dashboard)</option>
                    <option value="auditor">Auditor (/auditor/dashboard)</option>
                    <option value="integration_admin">Integration Admin (/integrations/dashboard)</option>
                    <option value="business_admin">Business Admin (/admin/dashboard)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={loading}
                className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold px-5"
              >
                Create Account &amp; Generate Credentials
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Roster Data Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-navy">Organization Roster (10 Roles)</h2>
            <p className="text-xs text-slate-400">Total active users provisioned: {roster.length}</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Tenant: <strong>Example Call Center</strong>
          </span>
        </div>

        <DataTable columns={columns} data={roster} />
      </Card>
    </div>
  );
}
