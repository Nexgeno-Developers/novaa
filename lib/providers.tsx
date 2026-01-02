'use client';

import { store } from '@/redux';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';

// Lazy load AuthProvider - only needed for admin routes
const AuthProvider = dynamic(() => import('@/components/auth/AuthProvider'), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}