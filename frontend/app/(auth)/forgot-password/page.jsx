'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client.js';
import AuthLayout from '../../../components/auth/AuthLayout.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Forgot Password
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Enter your email address and we'll send a secure password recovery link.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password recovery email dispatched</span>
            </div>
            <p className="text-emerald-700 leading-relaxed">
              If an account with that email address exists, check your inbox for instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 transition shadow-sm"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pb-2 pt-1 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
                placeholder="Enter email"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/login"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign In instead
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-8 py-2.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
