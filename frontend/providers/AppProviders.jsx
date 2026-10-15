'use client';

import { CallProvider } from '../lib/context/CallContext.jsx';

export default function AppProviders({ children }) {
  return (
    <CallProvider>
      {children}
    </CallProvider>
  );
}
