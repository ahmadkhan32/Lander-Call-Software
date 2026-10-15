'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

export default function PasswordField({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter password',
  required = true,
  error,
  autoComplete = 'current-password',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          className={clsx(
            'w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100',
            error ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : 'border-slate-300'
          )}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}
