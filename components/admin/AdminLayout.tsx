'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { verifyAuth, logout } from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux';

// Import your sidebar component
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Protected routes - routes that require authentication
  const protectedRoutes = ['/admin/dashboard', '/admin/pages'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Verify authentication on mount
    if (isProtectedRoute) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isProtectedRoute]);

  useEffect(() => {
    // Redirect logic
    if (!loading && isProtectedRoute) {
      if (!isAuthenticated) {
        router.replace('/admin/login');
      }
    }
  }, [isAuthenticated, loading, router, isProtectedRoute]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return 'Dashboard';
    if (pathname === '/admin/pages') return 'Pages Management';
    if (pathname.startsWith('/admin/pages/')) {
      const segments = pathname.split('/');
      if (segments.length === 4) {
        // /admin/pages/[slug] - showing page sections
        const pageSlug = segments[3];
        const pageTitle = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1).replace('-', ' ');
        return `${pageTitle} Sections`;
      } else if (segments.length === 5) {
        // /admin/pages/[slug]/[section] - showing section editor
        const pageSlug = segments[3];
        const sectionSlug = segments[4];
        const pageTitle = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1).replace('-', ' ');
        const sectionTitle = sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1).replace('-', ' ');
        return `${pageTitle} - ${sectionTitle}`;
      }
    }
    return 'Admin Panel';
  };

  // Don't render admin layout for login page
  if (pathname === '/admin/login' || pathname === '/admin') {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (loading && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated on protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar 
              collapsed={false} 
              onToggle={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Top Header Bar */}
        <header className="bg-white border-b border-border shadow-sm h-16 flex items-center justify-between px-6 lg:px-8 relative z-10">
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden mr-4"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className='text-background bg-gray-300 cursor-pointer' onClick={() => {
              router.push('/')
            }} size="sm">
              Preview Site
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'admin@novaa.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}