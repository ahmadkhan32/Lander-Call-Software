import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import {
  ArrowLeft,
  Phone,
  Mail,
  MoreVertical,
  Calendar,
  Clock,
  Edit3,
  FileText,
  DollarSign,
  Building,
  CheckCircle,
} from 'lucide-react';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(
    'Discussed pricing proposal. Waiting for final approval from decision makers. Very interested in our premium package.'
  );
  const [isEditingNote, setIsEditingNote] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back navigation matching Image 3 Screen C */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate('/app/leads')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </button>
        <span className="text-sm font-bold text-navy">Lead Details</span>
        <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Contact Card matching Image 3 Screen C */}
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
            alt="John Smith"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-slate-200"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-navy">John Smith</h1>
                <p className="text-sm font-medium text-slate-500">TechNova Inc. &bull; VP of Operations</p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-2xl font-extrabold text-brand">$15,000</span>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase">Estimated Value</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <StatusBadge status="negotiation" />
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Win Probability: 78%
              </span>
            </div>

            {/* Quick action buttons matching Image 3 Screen C */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-3">
              <Button
                variant="primary"
                size="sm"
                icon={Phone}
                onClick={() => navigate('/app/dialer')}
              >
                Quick Call
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Mail}
                onClick={() => alert('Email composer opened for john@technova.com')}
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information matching Image 3 Screen C */}
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-3">
            Contact Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Email</span>
              <span className="font-semibold text-slate-800">john@technova.com</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Phone</span>
              <span className="font-semibold text-slate-800">+1 (234) 567-8901</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Last Contact</span>
              <span className="font-semibold text-slate-800">2 Days ago</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Assigned Agent</span>
              <span className="font-semibold text-brand">Emily Chen</span>
            </div>
          </div>
        </Card>

        {/* Notes matching Image 3 Screen C */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-navy">Notes</h2>
            <button
              onClick={() => setIsEditingNote(!isEditingNote)}
              className="text-xs text-brand font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditingNote ? 'Done' : 'Edit'}
            </button>
          </div>
          {isEditingNote ? (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          ) : (
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-xs text-slate-700 leading-relaxed font-medium">
              {note}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity Timeline matching Image 3 Screen C */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-3">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-brand shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">Called to discuss pricing proposal</p>
              <p className="text-xs text-slate-400 mt-0.5">Call duration: 14m 22s &bull; Outcome: Interested</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">2 days ago</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">Sent revised SLA and Enterprise proposal document</p>
              <p className="text-xs text-slate-400 mt-0.5">Delivered via automated cadence</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">4 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
