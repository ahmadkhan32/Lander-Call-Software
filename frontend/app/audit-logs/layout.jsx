import AppShell from '../../components/AppShell.jsx';

export const metadata = {
  title: 'Audit Trail & Security Logs',
  description: 'Immutable system audit records, RBAC permissions, and security logs.',
};

export default function AuditLogsLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
