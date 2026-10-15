'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../../../components/auth/AuthLayout.jsx';
import LoginForm from '../../../components/auth/LoginForm.jsx';

export default function LoginPage() {
  return (
    <AuthLayout
      badge="ONE WORKSPACE"
      headline="Your leads, agents, and calls in one place."
      subtitle="Manage customer relationships, auto-distribute inbound calls, execute predictive dialer campaigns, and track team performance with real-time analytics."
    >
      <Suspense
        fallback={
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
