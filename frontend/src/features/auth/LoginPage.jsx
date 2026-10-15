import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/providers';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, ShieldCheck, Zap, Lock, Headphones, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    navigate('/app/dashboard');
  };

  const handleDemo = (role = 'super_admin') => {
    loginDemo(role);
    navigate('/app/dashboard');
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left panel: Security & Value Proposition */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-navy p-12 text-white overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-bold text-white shadow-sm text-lg">
              L
            </span>
            <span className="text-xl font-bold tracking-wider text-white">LANDER</span>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC 2 Type II Certified & HIPAA Ready
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight">
            Next-Gen Call Center CRM & Operations
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-md leading-relaxed">
            Unify high-velocity telephony, customer relationship management, automated follow-up cadences, and real-time agent telemetry in one workspace.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              99.99% Uptime SLA
            </div>
            <p className="text-xs text-slate-400 mt-1">Carrier-grade SIP trunking & auto-failover</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Headphones className="w-4 h-4 text-blue-400" />
              WebRTC Softphone
            </div>
            <p className="text-xs text-slate-400 mt-1">&lt;50ms audio latency with DTMF keypad</p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Lander CRM Inc.</span>
          <span>Security &bull; Privacy &bull; Terms</span>
        </div>
      </aside>

      {/* Right panel: Login Form */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left">
            <div className="lg:hidden inline-flex items-center gap-2.5 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-bold text-white text-base">
                L
              </span>
              <span className="text-lg font-bold tracking-wider text-navy">LANDER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Sign in to your workspace
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Welcome back! Please enter your authorized credentials.
            </p>
          </div>

          {/* Quick Demo Login Button */}
          <div className="rounded-2xl bg-blue-50/80 border border-blue-200/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-900">Instant Demo Access</p>
                <p className="text-[11px] text-blue-700 mt-0.5">Explore with pre-seeded CRM data</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDemo('super_admin')}
                className="bg-blue-600 hover:bg-blue-700 text-xs shrink-0 shadow-sm"
              >
                ⚡ Quick Demo Login
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="sarah.miller@landercrm.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endIcon={showPassword ? EyeOff : Eye}
                onEndIconClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-brand focus:ring-brand"
                />
                Remember this device for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold shadow-sm mt-2"
              isLoading={loading}
            >
              Sign In to CRM <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Protected by end-to-end multi-tenant row level security.
          </p>
        </div>
      </section>
    </div>
  );
}
