'use client';

import Link from 'next/link';
import SaaSSaleIllustration from './SaaSSaleIllustration.jsx';

export default function AuthLayout({
  children,
  brandTitle = 'Sale Admin',
  brandSubtitle = 'Lander CRM',
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#3B82F6] flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-hidden font-sans">
      {/* Background Decorative Rings & Ambient Patterns (matches Screenshot 2) */}
      {/* Concentric rings top-left */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] pointer-events-none opacity-20">
        <div className="w-full h-full rounded-full border-[36px] border-white/30 flex items-center justify-center">
          <div className="w-[420px] h-[420px] rounded-full border-[32px] border-white/20 flex items-center justify-center">
            <div className="w-[260px] h-[260px] rounded-full border-[28px] border-white/20" />
          </div>
        </div>
      </div>

      {/* Concentric rings bottom-right */}
      <div className="absolute -bottom-56 -right-56 w-[700px] h-[700px] pointer-events-none opacity-20">
        <div className="w-full h-full rounded-full border-[40px] border-white/30 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border-[34px] border-white/20 flex items-center justify-center">
            <div className="w-[320px] h-[320px] rounded-full border-[28px] border-white/20" />
          </div>
        </div>
      </div>

      {/* Dot matrix pattern top-right */}
      <div
        className="absolute top-8 right-8 w-64 h-64 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Bottom-left wave ripple lines */}
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-25 hidden sm:block">
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
          <path d="M0 15C30 5 60 25 90 15C120 5 150 25 180 15" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 30C30 20 60 40 90 30C120 20 150 40 180 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 45C30 35 60 55 90 45C120 35 150 55 180 45" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Central Clean White Rounded Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl sm:rounded-[2.25rem] shadow-2xl shadow-blue-950/25 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Brand Logo & Vector Workspace Illustration (hidden on very small screens, visible on lg+) */}
        <section className="relative hidden lg:flex lg:col-span-6 flex-col justify-between p-8 xl:p-12 bg-white border-r border-slate-100/80 overflow-hidden">
          {/* Top Left Winged Brand Logo */}
          <div className="flex items-center gap-2.5 z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              {/* Dynamic Leaf / Wing shape */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 14C4 8.47715 8.47715 4 14 4H20V10C20 15.5228 15.5228 20 10 20H4V14Z"
                  fill="white"
                  fillOpacity="0.95"
                />
                <path
                  d="M4 14C8 14 14 8 14 4"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-slate-800 tracking-tight">{brandTitle}</span>
              <span className="block text-[10px] font-semibold text-blue-600 uppercase tracking-widest">{brandSubtitle}</span>
            </div>
          </div>

          {/* Central Hero Illustration */}
          <div className="my-auto py-6 z-10">
            <SaaSSaleIllustration />
          </div>

          {/* Footer note on left */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
            <span>Enterprise Call Center CRM</span>
            <span className="font-medium text-blue-600">v1.2.0</span>
          </div>

          {/* Soft base cloud wave in background */}
          <div className="absolute -bottom-8 -left-8 -right-8 h-32 bg-blue-50/50 rounded-t-full pointer-events-none" />
        </section>

        {/* Right Column: Form Container */}
        <section className="relative lg:col-span-6 flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 bg-white">
          {/* Mobile Top Brand Header */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 14C4 8.47715 8.47715 4 14 4H20V10C20 15.5228 15.5228 20 10 20H4V14Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800">{brandTitle}</span>
              <span className="text-[10px] font-semibold text-blue-600 ml-1.5 uppercase tracking-wider">{brandSubtitle}</span>
            </div>
          </div>

          {/* Top-Right Soft Decorative Blob (matches Screenshot 2) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-bl-[4rem] pointer-events-none" />

          {/* Main Form Content */}
          <div className="w-full max-w-md mx-auto relative z-10">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
