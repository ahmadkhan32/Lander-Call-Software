'use client';

import clsx from 'clsx';

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className = '',
}) {
  return (
    <div className={clsx('space-y-1 mb-6', className)}>
      {breadcrumbs}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 flex-wrap">{action}</div>}
      </div>
    </div>
  );
}
