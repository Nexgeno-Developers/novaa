'use client';

import { store } from '@/redux';
import { Provider } from 'react-redux';
import AuthProvider from '@/components/auth/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}