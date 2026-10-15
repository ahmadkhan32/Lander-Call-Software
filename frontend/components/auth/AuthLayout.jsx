'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
  headline = 'Welcome back to the future of call operations.',
  subtitle = 'Access your unified dashboard to manage leads, auto-distribute inbound calls, track agent performance, and review AI-powered call analytics.',
}) {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      {/* Main Glassmorphic Card Container matching Screenshot 2 */}
      <div className="relative z-10 w-full max-w-[1200px] bg-white rounded-[2rem] shadow-2xl shadow-slate-950/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-white/20">
        
        {/* Left Column: Solid Royal Blue #2563EB with Metrics & Headline */}
        <section className="relative hidden lg:flex lg:col-span-6 flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
          {/* Subtle wave/glow backdrop */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top Logo Mark */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-inner">
              L
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">LANDER</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/15 text-blue-100 border border-white/10">
                Security v2.4
              </span>
            </div>
          </div>

          {/* Central Headline & Description */}
          <div className="my-auto py-8 z-10 space-y-5 max-w-lg">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.2] text-white">
              {headline}
            </h1>
            <p className="text-sm xl:text-base text-blue-100/90 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> SOC 2 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                <Zap className="w-4 h-4 text-amber-300" /> 99.9% Uptime
              </span>
            </div>
          </div>

          {/* Bottom 3 Stats Row (matches Screenshot 2) */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 z-10">
            <div>
              <p className="text-2xl xl:text-3xl font-black text-white tracking-tight">99.9%</p>
              <p className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider mt-0.5">Uptime SLA</p>
            </div>
            <div>
              <p className="text-2xl xl:text-3xl font-black text-white tracking-tight">&lt;50ms</p>
              <p className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider mt-0.5">API Response</p>
            </div>
            <div>
              <p className="text-2xl xl:text-3xl font-black text-white tracking-tight">SOC 2</p>
              <p className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider mt-0.5">Compliant</p>
            </div>
          </div>
        </section>

        {/* Right Column: Clean White Form Container */}
        <section className="relative lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 xl:p-12 bg-white">
          {/* Top navigation row */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-blue-700 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Secure Login
            </span>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-md mx-auto my-auto py-4">
            {children}
          </div>

          {/* Bottom Trust & Compliance Footnote */}
          <div className="pt-6 border-t border-slate-100 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> 256-bit encryption
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <ShieldCheck className="w-3.5 h-3.5" /> SOC 2 compliant
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              By signing in, you agree to our{' '}
              <a href="#" className="underline hover:text-slate-700">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
