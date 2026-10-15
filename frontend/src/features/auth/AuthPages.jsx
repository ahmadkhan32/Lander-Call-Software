import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-page">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/90 shadow-elevated">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-brand font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
        <h1 className="text-2xl font-bold text-navy tracking-tight">Reset password</h1>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered work email and we'll send you an encrypted recovery link.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">Reset instructions sent!</p>
              <p className="mt-0.5">Please check your email inbox and follow the verification link.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-6 space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-page">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/90 shadow-elevated">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Set new password</h1>
        <p className="mt-1 text-xs text-slate-500">Please choose a strong password of at least 8 characters.</p>

        {done ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <p className="font-semibold">Password updated successfully!</p>
            <Link to="/login" className="mt-3 inline-block font-bold text-brand hover:underline">
              Sign in with new password &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-6 space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Save New Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-page text-center">
      <div className="max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-panel">
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
          403 FORBIDDEN
        </span>
        <h1 className="text-2xl font-bold text-navy mt-4">Access Restricted</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          You do not have the required role or organization permissions to view this resource. Contact your CRM administrator.
        </p>
        <div className="mt-6">
          <Link to="/app/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-page">
      <p className="text-sm font-semibold text-slate-600 animate-pulse">
        Verifying secure authentication session...
      </p>
    </div>
  );
}
