'use client';

import clsx from 'clsx';

export default function Skeleton({
  className = '',
  rows = 1,
}) {
  if (rows > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={clsx('animate-pulse bg-slate-200 rounded-lg h-4 w-full', className)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('animate-pulse bg-slate-200 rounded-lg', className)} />
  );
}
