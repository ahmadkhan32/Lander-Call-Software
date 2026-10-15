'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { leadsApi } from '../../../lib/api.js';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import LeadForm from '../../../components/leads/LeadForm.jsx';

export default function NewLeadPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setError('');
    try {
      const res = await leadsApi.create(data);
      router.push(`/leads/${res.lead.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create lead');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/leads"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Lead
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ingest customer account and contact information into the routing engine.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="card p-5 sm:p-8">
        <LeadForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/leads')}
          submitLabel="Create Lead"
        />
      </div>
    </div>
  );
}
