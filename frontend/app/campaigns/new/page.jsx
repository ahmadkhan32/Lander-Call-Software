'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { campaignsApi } from '../../../lib/api.js';
import { ArrowLeft, Target, Calendar, FileText, Loader2, Megaphone } from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'outbound',
    goal: '',
    script: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        goal: formData.goal || undefined,
        script: formData.script || undefined,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      };

      await campaignsApi.create(payload);
      router.push('/campaigns');
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/campaigns" className="btn-ghost p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Create Campaign</h1>
          <p className="text-surface-muted text-sm">Launch a new outbound dialer or inbound outreach campaign</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Campaign Name <span className="text-red-400">*</span></label>
          <div className="relative">
            <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input pl-9"
              placeholder="e.g. Q4 Enterprise Outbound Campaign"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Campaign Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input cursor-pointer"
            >
              <option value="outbound">Outbound Dialer</option>
              <option value="inbound">Inbound Queue</option>
              <option value="blended">Blended (Inbound + Outbound)</option>
            </select>
          </div>

          <div>
            <label className="label">Primary Goal / KPI</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="input pl-9"
                placeholder="e.g. 50 Enterprise Demos Booked"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="label">Target End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="input pl-9"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Agent Call Script / Talking Points</label>
          <div className="relative">
            <textarea
              rows={5}
              value={formData.script}
              onChange={(e) => setFormData({ ...formData, script: e.target.value })}
              className="input resize-none"
              placeholder="Hi [Lead Name], this is [Agent Name] calling from Lander CRM regarding..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Launching...</> : 'Launch Campaign'}
          </button>
          <Link href="/campaigns" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
