import AppShell from '../../components/AppShell.jsx';

export const metadata = {
  title: 'Notifications & Alerts',
  description: 'Inbound calls, scheduled callbacks, and lead assignment alerts.',
};

export default function NotificationsLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
