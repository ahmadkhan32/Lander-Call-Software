'use client';

import clsx from 'clsx';

export default function Input({
  label,
  error,
  icon: Icon,
  rightElement,
  id,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          className={clsx(
            'w-full bg-white border rounded-xl py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400',
            Icon ? 'pl-10' : 'pl-3.5',
            rightElement ? 'pr-10' : 'pr-3.5',
            error ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : 'border-slate-300',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}
