'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  options = [],
  id,
  className = '',
  containerClassName = '',
  children,
  ...props
}) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={clsx(
            'w-full bg-white border rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-900 appearance-none outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer',
            error ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : 'border-slate-300',
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}
