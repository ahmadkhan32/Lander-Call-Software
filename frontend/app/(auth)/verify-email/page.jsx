'use client';

import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import AuthLayout from '../../../components/auth/AuthLayout.jsx';

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-inner">
          <Mail className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Check your inbox
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            We sent a verification link to your work email. Click the link inside to activate your Lander Call Center seat.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
          <p className="font-bold text-slate-800">Didn&apos;t receive the email?</p>
          <p>• Check your spam or promotional folders</p>
          <p>• Verify you typed your corporate address correctly</p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => alert('Verification email resent!')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20"
          >
            Resend Email Link
          </button>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <span>Back to login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
