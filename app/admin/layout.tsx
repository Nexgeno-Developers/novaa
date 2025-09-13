'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';

// Force dynamic rendering for all admin pages - this needs to be at the top
export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/auth/login';

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <div className="absolute inset-0 h-16 w-16 rounded-2xl border-4 border-blue-500/30 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Loading admin panel...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen admin-theme bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Desktop Sidebar - Fixed positioning for better responsive behavior */}
        <div
          className={`fixed top-0 left-0 z-30 hidden lg:flex lg:flex-col h-full transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          <AdminSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent 
            side="left" 
            className="p-0 w-72 bg-gradient-to-b from-slate-50 to-white border-slate-200/60"
          >
            <AdminSidebar isCollapsed={false} onToggleCollapse={() => {}} />
          </SheetContent>
        </Sheet>

        {/* Main Content Container */}
        <div
          className={`min-h-screen transition-all duration-300 ${
            isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          }`}
        >
          {/* Header with glassmorphism */}
          <header
            className="sticky top-0 z-40 h-16 sm:h-20 border-b border-slate-200/50 px-4 sm:px-6 lg:px-8"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
            }}
          >
            <div className="flex h-full items-center gap-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                <span className="sr-only">Open sidebar</span>
              </Button>

              {/* Header content */}
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <AdminHeader user={user} />
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="relative">
                  {/* Content background with subtle pattern */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer - Hidden on small screens to save space */}
          <footer className="hidden sm:block border-t border-slate-200/50 bg-white/50 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-500">
                <div className="mb-2 sm:mb-0">
                  © 2024 Novaa Global Properties. All rights reserved.
                </div>
                <div className="flex space-x-4">
                  <span className="hover:text-slate-700 transition-colors cursor-pointer">
                    Support
                  </span>
                  <span className="hover:text-slate-700 transition-colors cursor-pointer">
                    Documentation
                  </span>
                  <span className="hover:text-slate-700 transition-colors cursor-pointer">
                    Status
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}