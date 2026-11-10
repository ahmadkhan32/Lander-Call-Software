import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../app/providers';
import { ROLE_LABELS } from '../../lib/permissions';
import {
  ShieldCheck,
  Users,
  FileSpreadsheet,
  PhoneCall,
  BarChart3,
  Radio,
  Copy,
  Check,
  Save,
  Building2,
  Lock,
  RotateCcw,
} from 'lucide-react';

const PERMISSION_DEFINITIONS = [
  // Users
  { id: 'users.create', label: 'Create users', category: 'Users' },
  { id: 'users.read', label: 'View users', category: 'Users' },
  { id: 'users.update', label: 'Edit users', category: 'Users' },
  { id: 'users.deactivate', label: 'Deactivate users', category: 'Users' },

  // Leads
  { id: 'leads.create', label: 'Create leads', category: 'Leads' },
  { id: 'leads.read', label: 'View leads', category: 'Leads' },
  { id: 'leads.update', label: 'Edit leads', category: 'Leads' },
  { id: 'leads.assign', label: 'Assign leads', category: 'Leads' },
  { id: 'leads.import', label: 'Import leads', category: 'Leads' },
  { id: 'leads.export', label: 'Export leads', category: 'Leads' },

  // Calls
  { id: 'calls.read', label: 'View calls', category: 'Calls' },
  { id: 'calls.initiate', label: 'Initiate calls', category: 'Calls' },
  { id: 'calls.recording.read', label: 'View recordings', category: 'Calls' },

  // Reports
  { id: 'reports.view', label: 'View reports', category: 'Reports' },
  { id: 'reports.export', label: 'Export reports', category: 'Reports' },

  // Integrations & Audit
  { id: 'audit_logs.read', label: 'Read audit logs', category: 'Integrations & Compliance' },
  { id: 'integrations.manage', label: 'Configure telephony & webhooks', category: 'Integrations & Compliance' },
];

const DEFAULT_ROLE_PERMS = {
  business_admin: [
    'users.create',
    'users.read',
    'users.update',
    'users.deactivate',
    'leads.create',
    'leads.read',
    'leads.update',
    'leads.assign',
    'leads.import',
    'reports.export',
  ],
  manager: [
    'users.read',
    'leads.read',
    'leads.assign',
    'calls.read',
    'calls.initiate',
    'reports.view',
    'reports.export',
  ],
  supervisor: [
    'users.read',
    'leads.read',
    'leads.assign',
    'calls.read',
    'calls.recording.read',
    'reports.view',
  ],
  agent: [
    'leads.read',
    'leads.update',
    'calls.initiate',
    'calls.read',
  ],
  crm_manager: [
    'leads.create',
    'leads.read',
    'leads.update',
    'leads.assign',
    'leads.import',
    'leads.export',
  ],
  qa_officer: [
    'calls.read',
    'calls.recording.read',
  ],
  reporting_analyst: [
    'reports.view',
    'reports.export',
  ],
  auditor: [
    'audit_logs.read',
    'calls.read',
  ],
  integration_admin: [
    'integrations.manage',
    'calls.read',
  ],
};

export function RolesPermissionsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [selectedRole, setSelectedRole] = useState('business_admin');
  const [selectedOrg] = useState('Example Call Center');
  const [copied, setCopied] = useState(false);

  // Active checked permissions map per role
  const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMS);

  const activePermissions = rolePermissions[selectedRole] || [];

  const togglePermission = (key) => {
    setRolePermissions((prev) => {
      const current = prev[selectedRole] || [];
      const updated = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [selectedRole]: updated };
    });
  };

  const handleCopySelection = () => {
    const payload = JSON.stringify(
      {
        organization: selectedOrg,
        role: selectedRole,
        permissionsCount: activePermissions.length,
        permissions: activePermissions,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    addToast({
      title: 'Copied Selection',
      description: `${activePermissions.length} permissions copied to clipboard.`,
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDatabase = () => {
    addToast({
      title: 'Permissions Saved',
      description: `Updated ${activePermissions.length} permissions for ${ROLE_LABELS[selectedRole]}. Audit log entry recorded.`,
      variant: 'success',
    });
  };

  const categories = ['Users', 'Leads', 'Calls', 'Reports', 'Integrations & Compliance'];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            LANDER CRM Multi-Level RBAC
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Roles &amp; Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure granular permissions per organization and role. Changes enforce strict tenant boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Tenant Isolated
          </span>
        </div>
      </div>

      {/* Scope Selectors matching Design Preview */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Organization
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{selectedOrg}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Role to Configure
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition shadow-sm"
            >
              <option value="business_admin">Business Admin (Organization Administrator)</option>
              <option value="manager">Call Center Manager</option>
              <option value="supervisor">Supervisor / Team Leader</option>
              <option value="agent">Call Center Agent</option>
              <option value="crm_manager">CRM / Lead Manager</option>
              <option value="qa_officer">QA Officer</option>
              <option value="reporting_analyst">Reporting Analyst</option>
              <option value="auditor">Auditor</option>
              <option value="integration_admin">Integration Administrator</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Configuring: <strong className="text-navy">{ROLE_LABELS[selectedRole] || selectedRole}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setRolePermissions(DEFAULT_ROLE_PERMS);
              addToast({ title: 'Reset to Defaults', description: 'Restored default permission matrix.' });
            }}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset to defaults
          </button>
        </div>
      </Card>

      {/* Permission Categories Section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
          Permission Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const items = PERMISSION_DEFINITIONS.filter((p) => p.category === category);
            if (items.length === 0) return null;

            return (
              <Card key={category} className="p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-navy text-sm">
                  {category === 'Users' && <Users className="w-4 h-4 text-blue-600" />}
                  {category === 'Leads' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                  {category === 'Calls' && <PhoneCall className="w-4 h-4 text-purple-600" />}
                  {category === 'Reports' && <BarChart3 className="w-4 h-4 text-amber-600" />}
                  {category === 'Integrations & Compliance' && <Radio className="w-4 h-4 text-indigo-600" />}
                  <span>{category}</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {items.map((item) => {
                    const isChecked = activePermissions.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm font-medium text-slate-700 hover:text-navy transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar matching Section 4 */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white shadow-elevated">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-extrabold text-xs">
            {activePermissions.length}
          </div>
          <span className="text-sm font-semibold text-slate-200">
            {activePermissions.length} permissions selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopySelection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy selection'}</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveToDatabase}
            className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Database</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

