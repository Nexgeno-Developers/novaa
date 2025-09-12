"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  useEffect(() => {
    if (initialized && !loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [initialized, loading, isAuthenticated, router, redirectTo]);

  // Show loading while checking auth
  if (!initialized || loading) {
    return fallback || <LoadingSpinner message="Verifying authentication..." />;
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return fallback || <LoadingSpinner message="Redirecting to login..." />;
  }

  return <>{children}</>;
}
