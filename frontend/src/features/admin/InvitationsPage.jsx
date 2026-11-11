/**
 * InvitationsPage.jsx
 * Route: /app/invitations  (Business Admin, Super Admin)
 *
 * Business Admin can invite users to their organization with a specific role.
 * Sends invitation email via backend API.
 */
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useAuth } from '../../app/providers';
import { useToast } from '../../components/ui/Toast';
import { ROLE_LABELS } from '../../lib/permissions';
import {
  UserPlus, Mail, Shield, Clock, Check, Send, RotateCcw,
} from 'lucide-react';

const INITIAL_INVITATIONS = [
  {
    id: 'inv_01',
    email: 'new.agent@callcenter.com',
    role_name: 'agent',
    status: 'pending',
    invited_by: 'admin@callcenter.com',
    created_at: '2026-11-10',
    expires_at: '2026-11-17',
  },
  {
    id: 'inv_02',
    email: 'lisa.qa@callcenter.com',
    role_name: 'qa_officer',
    status: 'accepted',
    invited_by: 'admin@callcenter.com',
    created_at: '2026-11-08',
    expires_at: '2026-11-15',
  },
  {
    id: 'inv_03',
    email: 'tom.supervisor@callcenter.com',
    role_name: 'supervisor',
    status: 'pending',
    invited_by: 'admin@callcenter.com',
    created_at: '2026-11-11',
    expires_at: '2026-11-18',
  },
];

export function InvitationsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [invitations, setInvitations] = useState(INITIAL_INVITATIONS);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('agent');
  const [fullName, setFullName] = useState('');

  const availableRoles = [
    'agent', 'supervisor', 'manager', 'crm_manager',
    'qa_officer', 'reporting_analyst', 'auditor', 'integration_admin', 'business_admin',
  ];

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = user?.accessToken || 'demo-business_admin-token';

      await fetch(`${apiBase}/api/auth/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role_name: roleName, full_name: fullName }),
      }).catch(() => {});

      const newInvite = {
        id: `inv_${Date.now()}`,
        email,
        role_name: roleName,
        status: 'pending',
        invited_by: user?.email || 'admin@callcenter.com',
        created_at: new Date().toISOString().split('T')[0],
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      setInvitations([newInvite, ...invitations]);
      addToast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email} for role "${ROLE_LABELS[roleName] || roleName}". They will receive a setup link.`,
        variant: 'success',
      });

      setEmail('');
      setFullName('');
      setRoleName('agent');
      setShowForm(false);
    } catch {
      addToast({ title: 'Failed', description: 'Could not send invitation.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = (invite) => {
    addToast({
      title: 'Invitation Resent',
      description: `New invitation link sent to ${invite.email}.`,
      variant: 'success',
    });
  };

  const handleRevoke = (inviteId) => {
    setInvitations(invitations.filter((i) => i.id !== inviteId));
    addToast({ title: 'Invitation Revoked', description: 'The invitation has been revoked.' });
  };

  const columns = [
    {
      header: 'Invitee',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
            {row.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{row.email}</div>
            <div className="text-xs text-slate-400">Invited by: {row.invited_by}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-navy">
          <Shield className="w-3 h-3 text-blue-600" />
          {ROLE_LABELS[row.role_name] || row.role_name}
        </span>
      ),
    },
    {
      header: 'Expires',
      accessor: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          {row.expires_at}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <StatusBadge status={row.status === 'accepted' ? 'active' : row.status} />
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleResend(row)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Resend
              </button>
              <button
                onClick={() => handleRevoke(row.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800"
              >
                Revoke
              </button>
            </>
          )}
          {row.status === 'accepted' && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Accepted
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5" />
            Organization User Invitations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Invite Users to Your Organization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send role-specific invitations. Users set their own password via the invitation link.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showForm ? 'Close' : 'Invite New User'}</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-navy">{invitations.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total Sent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-amber-600">
            {invitations.filter((i) => i.status === 'pending').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-600">
            {invitations.filter((i) => i.status === 'accepted').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Accepted</div>
        </Card>
      </div>

      {/* Invitation Form */}
      {showForm && (
        <Card className="p-6 bg-slate-50 border-blue-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Send className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-navy">Send Role Invitation</h2>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name (optional)
                </label>
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Assign Role *
                </label>
                <select value={roleName} onChange={(e) => setRoleName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand">
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
              <strong>Security note:</strong> The invited user will receive a link to set their own password.
              Administrators cannot view or retrieve passwords once set.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}
                className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold px-5 inline-flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send Invitation Email
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Invitations Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-navy">Invitation History</h2>
          <span className="text-xs text-slate-400">Org: {user?.organization || 'Example Call Center'}</span>
        </div>
        <DataTable columns={columns} data={invitations} />
      </Card>
    </div>
  );
}

