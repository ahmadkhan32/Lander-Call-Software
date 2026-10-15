export const metadata = {
  title: 'Authentication — Lander Call Center CRM',
  description: 'Sign in to access your Lander CRM Workspace',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
