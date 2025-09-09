// "use client";

// import { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { Menu, Loader2, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import AdminSidebar from "./AdminSidebar";
// import AdminHeader from "./AdminHeader";
// import { RootState } from "@/redux";
// import { verifyAuth } from "@/redux/slices/authSlice";
// import { useAppDispatch } from "@/redux/hooks";

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
  
//   // Get auth state from Redux
//   const { isAuthenticated, loading, user, error } = useSelector((state: RootState) => state.auth);
  
//   // Check if current path is login page
//   const isLoginPage = pathname === '/admin/login' || pathname === '/admin/auth/login';

//   // Handle mounting for hydration
// useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Load collapse state from localStorage after mount
//   useEffect(() => {
//     if (mounted) {
//       try {
//         const saved = localStorage.getItem("sidebarCollapsed");
//         if (saved) setIsCollapsed(saved === "true");
//       } catch (error) {
//         console.warn("Failed to load sidebar state from localStorage:", error);
//       }
//     }
//   }, [mounted]);

//   // Persist collapse state
//   useEffect(() => {
//     if (mounted) {
//       try {
//         localStorage.setItem("sidebarCollapsed", String(isCollapsed));
//       } catch (error) {
//         console.warn("Failed to save sidebar state to localStorage:", error);
//       }
//     }
//   }, [isCollapsed, mounted]);

//   // Check authentication on mount
//   useEffect(() => {
//     if (!isLoginPage && mounted) {
//       dispatch(verifyAuth());
//     }
//   }, [dispatch, isLoginPage, mounted]);

//   // Handle authentication redirect
//   useEffect(() => {
//     if (mounted && !loading && !isAuthenticated && !isLoginPage) {
//       router.push('/admin/login');
//     }
//   }, [isAuthenticated, loading, isLoginPage, router, mounted]);

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   // Handle responsive sidebar behavior with debouncing
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
    
//     const handleResize = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         if (window.innerWidth >= 1024) {
//           setSidebarOpen(false);
//           // Auto-collapse on smaller desktop screens
//           if (window.innerWidth < 1280) {
//             setIsCollapsed(true);
//           } else {
//             setIsCollapsed(false);
//           }
//         }
//       }, 150);
//     };

//     if (mounted) {
//       handleResize(); // Initial check
//       window.addEventListener("resize", handleResize);
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         clearTimeout(timeoutId);
//       };
//     }
//   }, [mounted]);

//   // Don't render anything until mounted (prevents hydration mismatch)
//   if (!mounted) {
//     return (
//       <div className="min-h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   // Show loading spinner while checking authentication
//   if (loading && !isLoginPage) {
//     return (
//       <div className="h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative">
//             <Loader2 className="h-12 w-12 animate-spin text-primary" />
//             <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20"></div>
//           </div>
//           <div className="text-center">
//             <h2 className="text-xl font-semibold text-foreground mb-1">Loading Admin Panel</h2>
//             <p className="text-sm text-muted-foreground">Verifying authentication...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show error state if authentication fails
//   if (error && !isLoginPage) {
//     return (
//       <div className="h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription className="mt-2">
//               {error}
//             </AlertDescription>
//           </Alert>
//           <Button 
//             onClick={() => router.push('/admin/login')} 
//             className="w-full mt-4"
//           >
//             Go to Login
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // If user is not authenticated and not on login page, don't render the admin layout
//   if (!isAuthenticated && !isLoginPage) {
//     return null; // Will be redirected by useEffect above
//   }

//   // If on login page, render children directly without admin layout
//   if (isLoginPage) {
//     return <div className="admin-theme h-screen overflow-hidden">{children}</div>;
//   }

//   // Render full admin layout for authenticated users
//   return (
//     <div className="h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex overflow-hidden">
//       {/* Desktop Sidebar */}
//       <div
//         className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-500 ease-in-out ${
//           isCollapsed ? "lg:w-20" : "lg:w-72"
//         }`}
//       >
//         <AdminSidebar
//           isCollapsed={isCollapsed}
//           onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
//         />
//       </div>

//       {/* Mobile Sidebar */}
//       <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
//         <SheetContent 
//           side="left" 
//           className="p-0 w-72 border-r border-border/50 admin-theme bg-sidebar/95 backdrop-blur-sm h-full flex flex-col"
//         >
//           <AdminSidebar 
//             isCollapsed={false} 
//             onToggleCollapse={() => {}} 
//           />
//         </SheetContent>
//       </Sheet>

//       {/* Main Content Area - Flex column with proper height management */}
//       <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
//         {/* Header - Fixed height */}
//         <header className="flex-shrink-0 h-20 flex items-center gap-x-4 bg-primary/5 backdrop-blur-xl border-b border-border/50 px-6 shadow-sm z-10">
//           {/* Mobile menu button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="lg:hidden h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105 flex-shrink-0"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Open sidebar</span>
//           </Button>

//           {/* Header content */}
//           <div className="flex flex-1 gap-x-4 self-stretch min-w-0">
//             <AdminHeader user={user} />
//           </div>
//         </header>

//         {/* Main content area - Takes remaining height and handles its own scrolling */}
//         <main className="flex-1 min-h-0 overflow-hidden">
//           <div className="h-full overflow-y-auto">
//             <div className="p-6 lg:p-8">
//               <div className="mx-auto max-w-7xl">
//                 <div className="animate-fade-in">
//                   {children}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

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
import { verifyAuth } from "@/redux/slices/authSlice";
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
  
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/auth/login';

  useEffect(() => {
    if (!isLoginPage) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isLoginPage]);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen admin-theme bg-gradient-to-br from-slate-50 via-white to-slate-100 lg:flex">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        }`}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-slate-50 to-white border-slate-200/60">
          <AdminSidebar isCollapsed={false} onToggleCollapse={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Header with glassmorphism */}
        <div 
          className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-slate-200/50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
          }}
        >
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 rounded-xl bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-600" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Header content */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <AdminHeader />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="relative">
                {/* Content background with subtle pattern */}
                <div 
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}
                />
                <div className="relative z-10">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        {/* <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
              <div className="mb-2 sm:mb-0">
                © 2024 Novaa Global Properties. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <span className="hover:text-slate-700 transition-colors cursor-pointer">Support</span>
                <span className="hover:text-slate-700 transition-colors cursor-pointer">Documentation</span>
                <span className="hover:text-slate-700 transition-colors cursor-pointer">Status</span>
              </div>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}