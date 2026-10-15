'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { leadsApi } from '../../../lib/api.js';
import { useCall } from '../../../lib/context/CallContext.jsx';
import {
  ArrowLeft, Phone, Edit2, Archive, Loader2,
  Clock, Plus
} from 'lucide-react';
import LeadDetails from '../../../components/leads/LeadDetails.jsx';
import CallHistory from '../../../components/calls/CallHistory.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { openDialer } = useCall();
  const [lead, setLead] = useState(null);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    Promise.all([leadsApi.get(id), leadsApi.calls(id)])
      .then(([leadRes, callsRes]) => {
        setLead(leadRes.lead);
        setCalls(callsRes.calls || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this lead?')) return;
    setArchiving(true);
    try {
      await leadsApi.archive(id);
      router.push('/leads');
    } catch (err) {
      alert(err.message || 'Failed to archive lead');
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="card max-w-md mx-auto text-center py-16 space-y-4">
        <p className="text-slate-600 font-medium">Lead not found in database.</p>
        <Link href="/leads" className="btn-primary inline-flex">
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lead.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ingested on {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {lead.phone && (
            <Button
              variant="primary"
              icon={Phone}
              onClick={() => openDialer(lead.phone, lead)}
            >
              Start Call
            </Button>
          )}
          <Button
            variant="danger"
            icon={Archive}
            isLoading={archiving}
            onClick={handleArchive}
          >
            Archive
          </Button>
        </div>
      </div>

      {/* Grid: Details on Left (4 cols), Call History on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <LeadDetails lead={lead} />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Call History Records ({calls.length})
            </h3>
            {lead.phone && (
              <button
                type="button"
                onClick={() => openDialer(lead.phone, lead)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                + Direct Dial
              </button>
            )}
          </div>

          <CallHistory
            calls={calls}
            onRedial={(phone) => openDialer(phone, lead)}
          />
        </div>
      </div>
    </div>
  );
}
