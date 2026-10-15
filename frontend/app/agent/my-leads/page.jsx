'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Phone, Mail, ArrowUpRight, CheckCircle2, Clock, Filter, Search } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const MY_LEADS = [
  { id: '1', name: 'Lincoln Donin', company: 'Acme Inc', email: 'lincoln@acme.com', phone: '+1 (555) 019-2831', status: 'Qualified', priority: 'High', score: 4.8 },
  { id: '2', name: 'Gustavo Philips', company: 'The North Face', email: 'gustavo@northface.com', phone: '+1 (555) 012-3991', status: 'Contacted', priority: 'Medium', score: 4.5 },
  { id: '3', name: 'Gretchen Herwitz', company: 'Louis Vuitton', email: 'gretchen@lv.com', phone: '+1 (555) 018-4920', status: 'New', priority: 'Urgent', score: 4.9 },
  { id: '4', name: 'Giana Levin', company: 'Belle Inc', email: 'giana@belle.com', phone: '+1 (555) 014-9921', status: 'Qualified', priority: 'High', score: 4.6 },
  { id: '5', name: 'Lydia Culhane', company: 'American Airlines', email: 'lydia@aa.com', phone: '+1 (555) 017-8812', status: 'Converted', priority: 'Low', score: 5.0 },
];

export default function AgentMyLeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MY_LEADS.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assigned Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personal lead portfolio assigned for outbound calling and nurturing.
          </p>
        </div>
        <Link
          href="/agent/workspace"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Launch Agent Workspace</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter your leads by name or company..."
          className="w-full text-xs sm:text-sm bg-transparent outline-none"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0 shadow-sm border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Lead Name</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {lead.name.charAt(0)}
                    </div>
                    {lead.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{lead.company}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{lead.phone}</td>
                  <td className="py-3 px-4">
                    <Badge variant={lead.status === 'Converted' ? 'green' : lead.status === 'Qualified' ? 'blue' : 'yellow'}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{lead.priority}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">⭐ {lead.score}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex items-center p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                      title="View Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
