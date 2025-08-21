'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { verifyAuth } from '@/redux/slices/authSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    dispatch(verifyAuth() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ${
        sidebarCollapsed 
          ? 'lg:ml-16' // Collapsed sidebar width
          : 'lg:ml-64' // Expanded sidebar width
      }`}>
        {/* <AdminHeader 
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={setSidebarCollapsed}
        /> */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}