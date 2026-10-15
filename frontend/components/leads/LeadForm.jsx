'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, Building2, Tag, Loader2, Save } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';

const schema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(200),
  phone: z.string().min(5, 'Valid phone number required').max(30),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company: z.string().max(200).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  notes: z.string().max(5000).optional(),
});

export default function LeadForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save Lead',
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: initialValues.full_name || '',
      phone: initialValues.phone || '',
      email: initialValues.email || '',
      company: initialValues.company || '',
      priority: initialValues.priority || 'medium',
      notes: initialValues.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="label">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register('full_name')}
              className="input pl-10"
              placeholder="e.g. Sarah Jenkins"
            />
          </div>
          {errors.full_name && <p className="field-error">{errors.full_name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register('phone')}
              type="tel"
              className="input pl-10 font-mono"
              placeholder="+1 (555) 019-2834"
            />
          </div>
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label">Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register('email')}
              type="email"
              className="input pl-10"
              placeholder="sarah@enterprise.com"
            />
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        {/* Company */}
        <div>
          <label className="label">Company / Account</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              {...register('company')}
              className="input pl-10"
              placeholder="Enterprise Technologies LLC"
            />
          </div>
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <label className="label">Lead Priority</label>
        <div className="relative">
          <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select {...register('priority')} className="input pl-10 cursor-pointer appearance-none">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent Escalation</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Internal Lead Notes</label>
        <textarea
          {...register('notes')}
          rows={4}
          className="input resize-none"
          placeholder="Customer requirements, budget timeline, and decision-maker details..."
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          icon={Save}
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
