import { redirect } from 'next/navigation';

// Root page redirects to dashboard (or login if unauthenticated via middleware)
export default function RootPage() {
  redirect('/dashboard');
}
