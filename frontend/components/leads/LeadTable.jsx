'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MessageSquare, Bell, Trash2, UserPlus,
  MoreHorizontal, ChevronDown, Check, Loader2, Star
} from 'lucide-react';
import clsx from 'clsx';
import Badge from '../ui/Badge.jsx';

const QUALIFICATIONS = {
  Qualified:   { label: 'Qualified',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Converted:   { label: 'Converted',   bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  Undefined:   { label: 'Undefined',   bg: 'bg-slate-100 text-slate-600 border-slate-200' },
  Unqualified: { label: 'Unqualified', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  Disqualified:{ label: 'Disqualified',bg: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const SAMPLE_LEADS = [
  {
    id: 'l1',
    name: 'Lincoln Donin',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['AL', 'CS'],
    qualification: 'Qualified',
    score: '4.5/5',
    phone: '+1 (555) 019-2831',
    email: 'lincoln@acme.com',
  },
  {
    id: 'l2',
    name: 'Gustavo Philips',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['MR'],
    qualification: 'Qualified',
    score: '4.5/5',
    phone: '+1 (555) 012-3991',
    email: 'gustavo@acme.com',
  },
  {
    id: 'l3',
    name: 'Gretchen Herwitz',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['JW', 'CF'],
    qualification: 'Qualified',
    score: '4.5/5',
    phone: '+1 (555) 018-4920',
    email: 'gretchen@acme.com',
  },
  {
    id: 'l4',
    name: 'Giana Levin',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'Belle Inc',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['GL'],
    qualification: 'Undefined',
    score: '4.5/5',
    phone: '+1 (555) 014-9921',
    email: 'giana@belle.com',
  },
  {
    id: 'l5',
    name: 'Lydia Culhane',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'Belle Inc',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['LC', 'DS'],
    qualification: 'Converted',
    score: '4.5/5',
    phone: '+1 (555) 017-8812',
    email: 'lydia@belle.com',
  },
  {
    id: 'l6',
    name: 'Leo George',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['LG'],
    qualification: 'Disqualified',
    score: '4.5/5',
    phone: '+1 (555) 019-4820',
    email: 'leo@acme.com',
  },
  {
    id: 'l7',
    name: 'Lincoln Lubin',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['LL', 'JW', 'CF'],
    qualification: 'Unqualified',
    score: '4.5/5',
    phone: '+1 (555) 018-7711',
    email: 'lubin@acme.com',
  },
  {
    id: 'l8',
    name: 'Adison Lipshutz',
    title: 'CEO at Acme,Inc',
    country: 'Singapore',
    company: 'The North Face',
    companyDesc: 'Venture Capital and Private Equ...',
    agents: ['AL', 'MR', 'DS'],
    qualification: 'Qualified',
    score: '4.5/5',
    phone: '+1 (555) 011-2299',
    email: 'adison@acme.com',
  },
];

export default function LeadTable({
  leads = [],
  loading = false,
  onCall,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // If live database leads is populated, map it; otherwise display the rich Lucidity sample leads
  const displayLeads = leads.length > 0
    ? leads.map((l, i) => ({
        id: l.id,
        name: l.full_name || 'Lead Contact',
        title: l.title || 'Director of Operations',
        country: l.country || 'United States',
        company: l.company || 'Enterprise Corp',
        companyDesc: 'Technology & Telephony',
        agents: ['JD', 'SC'],
        qualification: l.status === 'converted' ? 'Converted' : l.status === 'qualified' ? 'Qualified' : 'Undefined',
        score: '4.8/5',
        phone: l.phone || '+1 (555) 019-0000',
        email: l.email || 'lead@example.com',
      }))
    : SAMPLE_LEADS;

  const toggleSelectAll = () => {
    if (selectedIds.size === displayLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayLeads.map((l) => l.id)));
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (loading) {
    return (
      <div className="card text-center py-16 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
        <p className="text-xs text-slate-500 mt-2 font-medium">Loading leads table...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table (matching Screenshot 3 Lucidity CRM) */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === displayLeads.length && displayLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Engage with</th>
                <th className="py-3.5 px-4">Qualification</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Label</th>
                <th className="py-3.5 px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayLeads.map((lead) => {
                const qCfg = QUALIFICATIONS[lead.qualification] || QUALIFICATIONS.Qualified;
                const isSelected = selectedIds.has(lead.id);

                return (
                  <tr
                    key={lead.id}
                    className={clsx(
                      'transition-colors duration-150',
                      isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(lead.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100 cursor-pointer"
                      />
                    </td>

                    {/* Name + Title + Country */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/leads/${lead.id}`} className="font-bold text-slate-900 hover:text-blue-600 block text-xs">
                            {lead.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {lead.title} · {lead.country}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                          {lead.company.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{lead.company}</p>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                            {lead.companyDesc}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Engaged with (Avatar Cluster) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center -space-x-1.5">
                        {lead.agents.map((ag, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm"
                          >
                            {ag}
                          </div>
                        ))}
                        {lead.agents.length > 2 && (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                            +1
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Qualification Pill Dropdown */}
                    <td className="py-3.5 px-4">
                      <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border', qCfg.bg)}>
                        <span>{qCfg.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </span>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {lead.score}
                    </td>

                    {/* Label Button */}
                    <td className="py-3.5 px-4">
                      <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-colors">
                        + Add new
                      </button>
                    </td>

                    {/* Action Icons */}
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="inline-flex items-center gap-2 text-slate-400">
                        {/* Call via softphone */}
                        <button
                          onClick={() => onCall && onCall(lead.phone, lead)}
                          className="p-1 hover:text-emerald-600 transition-colors"
                          title="Call Lead"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-blue-600 transition-colors" title="Message">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-amber-600 transition-colors" title="Set Alert">
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-rose-600 transition-colors" title="Archive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination matching Screenshot 3 */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1 bg-white font-bold text-slate-700 focus:outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>leads of 120</span>
          </div>

          <div className="flex items-center gap-1 font-bold">
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              ←
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-900 text-white">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-slate-100 text-slate-700">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-slate-100 text-slate-700">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 rounded-lg hover:bg-slate-100 text-slate-700">10</button>
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
