'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';

export default function Checkbox({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  id,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        'relative flex items-start gap-3 select-none cursor-pointer group',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked, e)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={clsx(
            'w-4 h-4 rounded-md border transition-all duration-150 flex items-center justify-center',
            checked
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'bg-white border-slate-300 group-hover:border-slate-400 peer-focus:ring-2 peer-focus:ring-blue-100'
          )}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="text-xs">
          {label && (
            <span className="font-semibold text-slate-800 leading-tight block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
