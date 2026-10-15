import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const leadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  stage: z.string(),
  dealValue: z.string().optional(),
  notes: z.string().optional(),
});

export function NewLeadPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      stage: 'new',
      dealValue: '10000',
    },
  });

  const onSubmit = async (data) => {
    // Persist to API / Supabase
    addToast({
      title: 'Lead Created!',
      description: `Successfully added ${data.fullName} (${data.company}) to active pipeline.`,
      variant: 'success',
    });
    navigate('/app/leads');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate('/app/leads')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back to Leads
        </button>
        <span className="text-sm font-bold text-navy">New Customer / Lead</span>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Full Name"
              placeholder="e.g. John Smith"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            <Input
              label="Company Name"
              placeholder="e.g. TechNova Inc."
              {...register('company')}
              error={errors.company?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@technova.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Pipeline Stage"
              options={[
                { value: 'new', label: 'New Lead' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'meeting', label: 'Meeting Scheduled' },
                { value: 'proposal', label: 'Proposal Sent' },
                { value: 'negotiation', label: 'Negotiation' },
                { value: 'closed_won', label: 'Closed-Won' },
              ]}
              {...register('stage')}
            />
            <Input
              label="Estimated Deal Value ($)"
              type="number"
              placeholder="15000"
              {...register('dealValue')}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
              Initial Notes & Context
            </label>
            <textarea
              rows={3}
              placeholder="Enter customer background, campaign source, or callback notes..."
              {...register('notes')}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/app/leads')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              isLoading={isSubmitting}
            >
              Create Lead
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
