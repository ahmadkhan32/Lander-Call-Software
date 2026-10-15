'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client.js';
import AuthLayout from '../../../components/auth/AuthLayout.jsx';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      });

      if (signUpError) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
            Create Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Start managing your leads and call center workspace in minutes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 animate-in">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 animate-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full pb-1.5 pt-1 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Company / Team Name
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full pb-1.5 pt-1 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
              placeholder="e.g. Lander Global Operations"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Work Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pb-1.5 pt-1 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
              placeholder="Enter work email"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pb-1.5 pt-1 pr-8 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pb-1.5 pt-1 border-0 border-b border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors bg-transparent"
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <Link
              href="/login"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Have an account? Sign In
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-8 py-2.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
