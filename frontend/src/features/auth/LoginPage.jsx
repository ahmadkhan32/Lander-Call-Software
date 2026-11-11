import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../app/providers';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Headphones,
  ArrowRight,
  Shield,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from '../../lib/permissions';

const ROLE_CREDENTIALS = [
  { role: 'super_admin', label: 'Super Admin', email: 'sarah.miller@landercrm.io', pass: 'SuperAdmin@2026!', route: '/super-admin/dashboard' },
  { role: 'business_admin', label: 'Business Admin', email: 'admin@callcenter.com', pass: 'BusinessAdmin@2026!', route: '/admin/dashboard' },
  { role: 'manager', label: 'Call Center Manager', email: 'marcus.v@callcenter.com', pass: 'ManagerPass@2026!', route: '/manager/dashboard' },
  { role: 'supervisor', label: 'Supervisor / Team Leader', email: 'elena.r@callcenter.com', pass: 'SupervisorPass@2026!', route: '/supervisor/dashboard' },
  { role: 'agent', label: 'Call Center Agent', email: 'emily.chen@callcenter.com', pass: 'AgentPass@2026!', route: '/agent/dashboard' },
  { role: 'crm_manager', label: 'CRM / Lead Manager', email: 'devon.m@callcenter.com', pass: 'CrmManager@2026!', route: '/crm/dashboard' },
  { role: 'qa_officer', label: 'QA Officer', email: 'david.ross@callcenter.com', pass: 'QaOfficer@2026!', route: '/qa/dashboard' },
  { role: 'reporting_analyst', label: 'Reporting Analyst', email: 'chloe.b@callcenter.com', pass: 'AnalystPass@2026!', route: '/reports/dashboard' },
  { role: 'auditor', label: 'Auditor', email: 'frank.audit@callcenter.com', pass: 'AuditorPass@2026!', route: '/auditor/dashboard' },
  { role: 'integration_admin', label: 'Integration Admin', email: 'alex.telecom@callcenter.com', pass: 'IntegrationAdmin@2026!', route: '/integrations/dashboard' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectedFrom = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const result = await login(email, password);

      if (result?.success) {
        // Direct every role to their assigned dashboard unless specifically navigating to a permitted /app/* sub-page
        let destination = result.redirectTo || ROLE_DASHBOARD_ROUTES[result.user?.role] || '/app/dashboard';
        if (redirectedFrom && redirectedFrom.startsWith('/app/') && redirectedFrom !== '/app/dashboard') {
          destination = redirectedFrom;
        }
        navigate(destination, { replace: true });
      } else {
        setLoginError(result?.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      setLoginError('Authentication service unavailable. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (cred) => {
    setEmail(cred.email);
    setPassword(cred.pass);
    setLoginError('');
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left panel: Security & Architecture */}
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
              Strict Multi-Level RBAC &amp; Universal Dashboard Protection
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight">
            Mandatory Individual Account Authentication
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-md leading-relaxed">
            Every user must authenticate with their own credentials before accessing any application dashboard.
            Zero unauthenticated dashboards. Zero bypasses.
          </p>
        </div>

        {/* Security Rules Summary */}
        <div className="relative z-10 space-y-2 mt-8 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FR-17: Individual Account Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FR-18: Universal Dashboard Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FR-19: Strict Role &amp; Permission Authorization</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FR-20: Session Expiry &amp; Account Security</span>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Lander CRM Inc.</span>
          <span>SOC 2 Type II &bull; HIPAA Ready &bull; Supabase RLS</span>
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
              Enter your individual credentials to open your authorized dashboard.
            </p>
          </div>

          {/* Redirect Notice if navigated to protected route without auth */}
          {redirectedFrom && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Authentication Required</strong>
                <p className="mt-0.5">
                  Access to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">{redirectedFrom}</code> requires signing in with an authorized account.
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Access Denied</strong>
                <p className="mt-0.5">{loginError}</p>
              </div>
            </div>
          )}

          {/* Quick-Fill Helper for Testing (Populates form inputs, requires authentication submit) */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <KeyRound className="w-4 h-4 text-brand" />
              <span>Select Account to Fill Credentials:</span>
            </div>
            <select
              onChange={(e) => {
                const cred = ROLE_CREDENTIALS.find((c) => c.role === e.target.value);
                if (cred) handleQuickFill(cred);
              }}
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="" disabled>-- Choose role account to autofill --</option>
              {ROLE_CREDENTIALS.map((c) => (
                <option key={c.role} value={c.role}>
                  {c.label} ({c.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Selecting an account fills the email and password inputs. Click &ldquo;Sign In&rdquo; to execute verified authentication.
            </p>
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
