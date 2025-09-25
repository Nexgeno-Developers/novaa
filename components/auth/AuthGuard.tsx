"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  fallback,
  redirectTo = "/admin/login",
}: AuthGuardProps) {
  const { isAuthenticated, loading, initialized } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect if:
    // 1. Auth is initialized
    // 2. Not currently loading
    // 3. User is not authenticated
    // 4. Haven't already redirected (prevent multiple redirects)
    if (initialized && !loading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    }

    // Reset redirect flag if user becomes authenticated
    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [initialized, loading, isAuthenticated, router, redirectTo]);

  // Show loading while auth is initializing or loading
  if (!initialized || loading) {
    return fallback || <LoadingSpinner message="Verifying authentication..." />;
  }

  // Show loading while redirecting (only if we're about to redirect)
  if (!isAuthenticated) {
    return fallback || <LoadingSpinner message="Redirecting to login..." />;
  }

  return <>{children}</>;
}