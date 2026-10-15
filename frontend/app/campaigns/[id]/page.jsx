'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { campaignsApi } from '../../../lib/api.js';
import {
  ArrowLeft, Megaphone, Target, Calendar, FileText,
  PlayCircle, PauseCircle, CheckCircle, Loader2, Copy, Check
} from 'lucide-react';
import clsx from 'clsx';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    campaignsApi.get(id)
      .then((res) => setCampaign(res.campaign))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await campaignsApi.update(id, { status: newStatus });
      setCampaign(res.campaign);
    } catch (err) {
      alert(err.message || 'Failed to update campaign status');
    } finally {
      setUpdating(false);
    }
  };

  const copyScript = () => {
    if (campaign?.script) {
      navigator.clipboard.writeText(campaign.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-muted">Campaign not found.</p>
        <Link href="/campaigns" className="btn-primary mt-4 inline-flex">Back to Campaigns</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/campaigns" className="btn-ghost p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-surface-50">{campaign.name}</h1>
              <span className={`badge ${campaign.status === 'active' ? 'badge-green' : campaign.status === 'paused' ? 'badge-yellow' : 'badge-gray'}`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-surface-muted text-xs capitalize mt-0.5">Type: {campaign.type} Campaign</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {campaign.status !== 'active' && (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={updating}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" /> Activate
            </button>
          )}
          {campaign.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              disabled={updating}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-amber-400"
            >
              <PauseCircle className="w-3.5 h-3.5" /> Pause
            </button>
          )}
          {campaign.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={updating}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-emerald-400"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Complete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Goal */}
          <div className="card space-y-2">
            <h2 className="text-sm font-semibold text-surface-50 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" /> Campaign Goal
            </h2>
            <p className="text-surface-100 text-sm">{campaign.goal || 'No explicit goal defined for this campaign.'}</p>
          </div>

          {/* Script */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-surface-50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" /> Agent Telephony Script
              </h2>
              {campaign.script && (
                <button
                  onClick={copyScript}
                  className="btn-ghost text-xs p-1.5 text-brand-400 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="p-3 rounded-lg bg-surface text-xs font-mono text-surface-100 whitespace-pre-wrap border border-surface-muted">
              {campaign.script || 'No agent script attached to this campaign.'}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="text-sm font-semibold text-surface-50">Schedule & Timeline</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-muted/50">
                <span className="text-surface-muted">Start Date:</span>
                <span className="text-surface-100 font-medium">
                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Immediate'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-muted/50">
                <span className="text-surface-muted">End Date:</span>
                <span className="text-surface-100 font-medium">
                  {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-surface-muted">Created:</span>
                <span className="text-surface-100">
                  {new Date(campaign.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card space-y-2">
            <h2 className="text-sm font-semibold text-surface-50">Call Center Routing</h2>
            <p className="text-xs text-surface-muted">
              Dialer calls from this campaign automatically adhere to least-loaded agent routing rules.
            </p>
            <Link href="/leads" className="btn-secondary w-full text-xs text-center justify-center mt-2">
              View Campaign Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
