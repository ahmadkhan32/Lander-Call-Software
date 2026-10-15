'use client';

import { Phone, Mail, Building2, User, Calendar, Clock, Tag } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function LeadDetails({ lead }) {
  if (!lead) return null;

  return (
    <div className="card space-y-5">
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{lead.full_name}</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{lead.company || 'Private Account'}</p>
        </div>
        <Badge variant={lead.status === 'converted' ? 'green' : 'blue'}>
          {lead.status}
        </Badge>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
            <span className="font-mono font-semibold text-slate-800">{lead.phone || '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
            <span className="font-semibold text-slate-800">{lead.email || '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Organization</span>
            <span className="font-semibold text-slate-800">{lead.company || '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Representative</span>
            <span className="font-semibold text-slate-800">{lead.profiles?.full_name || 'Unassigned Queue'}</span>
          </div>
        </div>
      </div>

      {lead.notes && (
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Lead Description & Requirements
          </span>
          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
            {lead.notes}
          </p>
        </div>
      )}
    </div>
  );
}
