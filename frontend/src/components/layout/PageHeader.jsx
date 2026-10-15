import React from 'react';

export function PageHeader({ title, subtitle, action, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}

export function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-slate-300">/</span>}
            {isLast ? (
              <span className="font-semibold text-slate-700">{item.label}</span>
            ) : (
              <span className="hover:text-slate-600 transition cursor-pointer">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
