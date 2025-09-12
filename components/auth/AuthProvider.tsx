'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyAuth } from '@/redux/slices/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { initialized, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only verify auth if not already initialized and not currently loading
    if (!initialized && !loading) {
      dispatch(verifyAuth());
    }
  }, [dispatch, initialized, loading]);

  return <>{children}</>;
}