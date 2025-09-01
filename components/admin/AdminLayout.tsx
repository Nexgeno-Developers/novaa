"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { RootState } from "@/redux";
import { verifyAuth } from "@/redux/slices/authSlice"; // Import checkAuth action
import { useAppDispatch } from "@/redux/hooks";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  
  // Check if current path is login page
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/auth/login';

  // Check authentication on mount
  useEffect(() => {
    if (!isLoginPage) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isLoginPage]);

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

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading spinner while checking authentication
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated and not on login page, don't render the admin layout
  if (!isAuthenticated && !isLoginPage) {
    return null; // Will be redirected by useEffect above
  }

  // If on login page, render children directly without admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Render full admin layout for authenticated users
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Desktop Sidebar - Non-fixed approach */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar isCollapsed={false} onToggleCollapse={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content - Flex approach */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden -m-2.5 p-2.5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Header content */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <AdminHeader />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}