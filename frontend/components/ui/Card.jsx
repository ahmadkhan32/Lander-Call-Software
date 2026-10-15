'use client';

import clsx from 'clsx';

export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm',
        hover && 'hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
