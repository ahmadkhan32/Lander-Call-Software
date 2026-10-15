'use client';

import clsx from 'clsx';

export default function Badge({
  children,
  variant = 'blue',
  className = '',
  dot = false,
  ...props
}) {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  const dotColors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-rose-500',
    gray: 'bg-slate-400',
    purple: 'bg-purple-500',
    dark: 'bg-white',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        variantStyles[variant] || variantStyles.blue,
        className
      )}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant] || 'bg-blue-500')} />}
      <span>{children}</span>
    </span>
  );
}
