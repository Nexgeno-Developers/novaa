import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useCallback } from 'react';
import { verifyAuth, clearError, logout } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  // Initialize auth check on first load
  const initializeAuth = useCallback(() => {
    if (!auth.initialized && !auth.loading) {
      dispatch(verifyAuth());
    }
  }, [dispatch, auth.initialized, auth.loading]);

  // Auto-initialize when hook is used
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...auth,
    logout: handleLogout,
    clearError: handleClearError,
    initializeAuth,
  };
};
