'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminPageContent() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect from the root /admin path to dashboard
    // This ensures we only redirect when someone visits /admin directly
    router.replace('/admin/dashboard');
  }, [router]);

  return <LoadingSpinner message="Redirecting to dashboard..." />;
}