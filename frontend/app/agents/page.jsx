'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '../../lib/api.js';
import {
  Users, UserCheck, PhoneCall, Shield,
  Search, Filter, Circle, Loader2, Award, Mail, Phone
} from 'lucide-react';
import clsx from 'clsx';
import Badge from '../../components/ui/Badge.jsx';

const STATUS_INDICATOR = {
  active:   { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '🟢 Available' },
  busy:     { color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: '🟡 On Call' },
  away:     { color: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    label: '🔵 Away' },
  inactive: { color: 'bg-slate-400',   text: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   label: '⚪ Offline' },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAgents();
  }, [search, statusFilter]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await usersApi.list(params);
      setAgents(res.users || []);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (agentId, newStatus) => {
    try {
      await usersApi.update(agentId, { status: newStatus });
      setAgents((prev) =>
        prev.map((a) => (a.id === agentId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update agent status:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agent Team Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time agent presence, routing state, and queue availability.
          </p>
        </div>
      </div>

      {/* KPI Cards: Responsive 4-col desktop, 2-col tablet, 1-col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Team Reps',  value: agents.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Available Now',    value: agents.filter(a => a.status === 'active').length, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'On Call / Busy',   value: agents.filter(a => a.status === 'busy').length, icon: PhoneCall, color: 'text-amber-600 bg-amber-50' },
          { label: 'Offline / Away',   value: agents.filter(a => a.status === 'inactive' || a.status === 'away').length, icon: Circle, color: 'text-slate-600 bg-slate-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 sm:p-5 flex items-center gap-4">
            <div className={clsx('p-3 rounded-2xl flex-shrink-0', color)}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search agents by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pl-10 pr-8 appearance-none cursor-pointer w-full sm:w-44"
          >
            <option value="">All Statuses</option>
            <option value="active">Available</option>
            <option value="busy">On Call</option>
            <option value="away">Away</option>
            <option value="inactive">Offline</option>
          </select>
        </div>
      </div>

      {/* Agents Grid: 3-col on desktop, 2-col on tablet, 1-col on mobile */}
      {loading ? (
        <div className="card text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="card text-center py-16 text-slate-500">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-800">No agents found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or invite team members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => {
            const statusConfig = STATUS_INDICATOR[agent.status] || STATUS_INDICATOR.inactive;
            const roleName = agent.user_roles?.[0]?.roles?.name || agent.role || 'Agent';

            return (
              <div key={agent.id} className="card card-hover flex flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-base flex-shrink-0">
                        {agent.full_name?.[0]?.toUpperCase() || 'A'}
                        <span className={clsx('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white', statusConfig.color)} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {agent.full_name || 'Agent User'}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{agent.email}</p>
                      </div>
                    </div>
                    <Badge variant="blue">
                      {roleName}
                    </Badge>
                  </div>

                  {/* Status Controller */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Presence Status:</span>
                    <select
                      value={agent.status || 'inactive'}
                      onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                      className={clsx(
                        'text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none transition-colors cursor-pointer',
                        statusConfig.text,
                        statusConfig.bg,
                        statusConfig.border
                      )}
                    >
                      <option value="active">🟢 Available</option>
                      <option value="busy">🟡 On Call</option>
                      <option value="away">🔵 Away</option>
                      <option value="inactive">⚪ Offline</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Timezone: {agent.timezone || 'UTC'}</span>
                  </span>
                  <span>Joined {new Date(agent.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
