import AppShell from '../../components/AppShell.jsx';

export const metadata = {
  title: 'Teams & Routing Queues',
  description: 'Manage call center teams, routing algorithms, and queue SLA targets.',
};

export default function TeamsLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
