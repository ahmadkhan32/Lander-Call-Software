import AppShell from '../../components/AppShell.jsx';

export const metadata = {
  title: 'Contacts Directory',
  description: 'Global business contacts and customer address book.',
};

export default function ContactsLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
