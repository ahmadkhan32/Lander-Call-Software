import AppShell from '../../components/AppShell.jsx';

export const metadata = {
  title: 'Softphone Dialer',
  description: 'Integrated WebRTC agent softphone and outbound call station.',
};

export default function DialerLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
