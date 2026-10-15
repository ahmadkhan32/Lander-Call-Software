'use client';

import { useState } from 'react';
import { Shield, Search, Filter, Lock, CheckCircle2, User, Globe, Clock } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const AUDIT_LOGS = [
  {
    id: 'log-501',
    actor: 'Super Administrator (superadmin@lander.crm)',
    action: 'auth.login_success',
    resource: 'session',
    ip: '127.0.0.1 (Localhost)',
    timestamp: 'Just now',
    status: 'success',
  },
  {
    id: 'log-502',
    actor: 'Super Administrator',
    action: 'leads.route_auto',
    resource: 'lead:elena-rostova',
    ip: '127.0.0.1',
    timestamp: '15m ago',
    status: 'success',
  },
  {
    id: 'log-503',
    actor: 'Sarah Connor',
    action: 'calls.disposition_submit',
    resource: 'call:349102',
    ip: '192.168.1.45',
    timestamp: '1h ago',
    status: 'success',
  },
  {
    id: 'log-504',
    actor: 'Alex Murphy',
    action: 'campaigns.status_change',
    resource: 'campaign:q4-outbound',
    ip: '192.168.1.18',
    timestamp: '2h ago',
    status: 'success',
  },
  {
    id: 'log-505',
    actor: 'System Automation',
    action: 'cron.overdue_reminders',
    resource: 'follow_ups',
    ip: 'internal',
    timestamp: '3h ago',
    status: 'success',
  },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');

  const filteredLogs = AUDIT_LOGS.filter(
    (l) => l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Audit Trail & Security Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable audit records of all user actions, logins, role modifications, and system operations.
        </p>
      </div>

      {/* Security Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Audit Logging', value: '100% Enforced', icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'RLS Partitioning', value: 'Multi-Tenant Isolated', icon: Lock, color: 'text-blue-600 bg-blue-50' },
          { label: 'Retention Policy', value: '365 Days Guaranteed', icon: Clock, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <div className={`p-3 rounded-2xl ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter audit logs by action or actor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Audit Log Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target Resource</th>
              <th>IP Address</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="text-xs font-mono text-slate-500">{log.timestamp}</td>
                <td>
                  <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {log.actor}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {log.action}
                  </span>
                </td>
                <td className="font-mono text-xs text-slate-600">{log.resource}</td>
                <td className="font-mono text-xs text-slate-500">{log.ip}</td>
                <td className="text-right">
                  <Badge variant="green">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline" /> {log.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
