'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export default function Toast({
  type = 'success',
  message,
  onClose,
  className = '',
}) {
  if (!message) return null;

  const typeConfig = {
    success: { icon: CheckCircle2, border: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    error:   { icon: AlertCircle,  border: 'border-rose-200 bg-rose-50 text-rose-800' },
    info:    { icon: Info,         border: 'border-blue-200 bg-blue-50 text-blue-800' },
  };

  const { icon: Icon, border } = typeConfig[type] || typeConfig.success;

  return (
    <div
      className={clsx(
        'fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-md animate-slide-up',
        border,
        className
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
