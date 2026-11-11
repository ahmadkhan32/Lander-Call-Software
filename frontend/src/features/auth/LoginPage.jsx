import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/providers';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, ShieldCheck, Zap, Lock, Headphones, ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from '../../lib/permissions';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState('super_admin');
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const result = await login(email, password);
      if (result?.success) {
        // Backend login returns the correct role-specific redirectTo
        const targetRoute = result.redirectTo || ROLE_DASHBOARD_ROUTES['agent'];
        navigate(targetRoute, { replace: true });
      } else {
        setLoginError('Invalid email or password. Try the demo login below.');
      }
    } catch {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    const targetRoute = loginDemo(role) || ROLE_DASHBOARD_ROUTES[role] || '/app/dashboard';
    navigate(targetRoute, { replace: true });
  };

  const demoRoles = [
    { key: 'super_admin', label: 'Super Admin', route: '/super-admin/dashboard' },
    { key: 'business_admin', label: 'Business Admin', route: '/admin/dashboard' },
    { key: 'manager', label: 'Call Center Manager', route: '/manager/dashboard' },
    { key: 'supervisor', label: 'Supervisor / Team Leader', route: '/supervisor/dashboard' },
    { key: 'agent', label: 'Call Center Agent', route: '/agent/dashboard' },
    { key: 'crm_manager', label: 'CRM / Lead Manager', route: '/crm/dashboard' },
    { key: 'qa_officer', label: 'QA Officer', route: '/qa/dashboard' },
    { key: 'reporting_analyst', label: 'Reporting Analyst', route: '/reports/dashboard' },
    { key: 'auditor', label: 'Auditor', route: '/auditor/dashboard' },
    { key: 'integration_admin', label: 'Integration Admin', route: '/integrations/dashboard' },
  ];

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
              Multi-Level Role-Based Access Control (RBAC)
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight">
            Enterprise Call Center CRM &amp; Multi-Tenant Platform
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-md leading-relaxed">
            Role-based segregation across 10 distinct roles with dedicated dashboards, centralized administrative account provisioning, and row-level tenant security.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              10 Isolated Roles
            </div>
            <p className="text-xs text-slate-400 mt-1">Super Admin, Business Admin, Agent, QA &amp; more</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Headphones className="w-4 h-4 text-blue-400" />
              Predictive Dialer
            </div>
            <p className="text-xs text-slate-400 mt-1">Live softphone, barge-in &amp; call recordings</p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Lander CRM Inc.</span>
          <span>SOC 2 Type II &bull; HIPAA Ready</span>
        </div>
      </aside>

      {/* Right panel: Login Form */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left">
            <div className="lg:hidden inline-flex items-center gap-2.5 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-bold text-white text-base">
                L
              </span>
              <span className="text-lg font-bold tracking-wider text-navy">LANDER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Sign in to LANDER CRM
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Each user receives permissions and opens their role-specific dashboard.
            </p>
          </div>

          {/* Quick Demo Login Role Selector */}
          <div className="rounded-2xl bg-blue-50/80 border border-blue-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-900">Instant Demo Login &bull; 10 Roles</p>
                <p className="text-[11px] text-blue-700">Test any dashboard immediately</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDemo(selectedDemoRole)}
                className="bg-blue-600 hover:bg-blue-700 text-xs shrink-0 shadow-sm"
              >
                Launch Role &rarr;
              </Button>
            </div>

            <select
              value={selectedDemoRole}
              onChange={(e) => setSelectedDemoRole(e.target.value)}
              className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {demoRoles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label} ({r.route})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Login Email"
              type="email"
              placeholder="e.g. sarah.miller@landercrm.io"
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
              Sign In to Role Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Protected by multi-tenant RBAC &amp; Supabase Row Level Security.
          </p>
        </div>
      </section>
    </div>
  );
}
