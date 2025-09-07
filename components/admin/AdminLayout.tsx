// "use client";

// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent } from "@/components/ui/sheet";
// import { motion } from "framer-motion";
// import AdminSidebar from "./AdminSidebar";
// import AdminHeader from "./AdminHeader";

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const pathname = usePathname();

//   // Mock user data - replace with actual auth logic
//   const user = {
//     name: "Admin User",
//     email: "admin@novaa.com",
//     avatar: "/avatars/admin.jpg",
//   };

//   // Load collapse state from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("sidebarCollapsed");
//     if (saved) setIsCollapsed(saved === "true");
//   }, []);

//   // Persist collapse state
//   useEffect(() => {
//     localStorage.setItem("sidebarCollapsed", String(isCollapsed));
//   }, [isCollapsed]);

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   // Handle responsive sidebar behavior
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1280) {
//         setIsCollapsed(false);
//       } else if (window.innerWidth >= 1024) {
//         setIsCollapsed(true);
//       }
//     };

//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="admin-theme min-h-screen bg-gradient-to-br from-background via-background to-accent/20 dark:from-background dark:via-background dark:to-muted/20 lg:flex">
//       {/* Desktop Sidebar */}
//       <div
//         className={`hidden lg:flex lg:flex-col transition-all duration-500 ease-in-out ${
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
//           className="p-0 w-72 border-r border-border/50"
//         >
//           <AdminSidebar
//             isCollapsed={false}
//             onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
//           />
//         </SheetContent>
//       </Sheet>

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col min-w-0">
//         {/* Header */}
//         <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 header-glass border-b border-border/50 px-6 shadow-sm">
//           {/* Mobile menu button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="lg:hidden h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-300"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Open sidebar</span>
//           </Button>

//           {/* Header content */}
//           <div className="flex flex-1 gap-x-4 self-stretch">
//             <AdminHeader user={user} />
//           </div>
//         </header>

//         {/* Main content area */}
//         <main className="flex-1 overflow-auto">
//           <div className="p-6 lg:p-8">
//             <div className="mx-auto max-w-7xl">
//               {/* Page transition */}
//               <motion.div
//                 key={pathname}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.25 }}
//               >
//                 {children}
//               </motion.div>
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
import { Menu, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { RootState } from "@/redux";
import { verifyAuth } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, loading, user, error } = useSelector((state: RootState) => state.auth);
  
  // Check if current path is login page
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/auth/login';

  // Handle mounting for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (!isLoginPage && mounted) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isLoginPage, mounted]);

  // Handle authentication redirect
  useEffect(() => {
    if (mounted && !loading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, isLoginPage, router, mounted]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle responsive sidebar behavior with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 1024) {
          setSidebarOpen(false);
          // Auto-collapse on smaller desktop screens
          if (window.innerWidth < 1280) {
            setIsCollapsed(true);
          } else {
            setIsCollapsed(false);
          }
        }
      }, 150);
    };

    if (mounted) {
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      };
    }
  }, [mounted]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Show loading spinner while checking authentication
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-1">Loading Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Verifying authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error && !isLoginPage) {
    return (
      <div className="min-h-screen admin-theme-elegant admin-theme bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => router.push('/admin/login')} 
            className="w-full mt-4"
          >
            Go to Login
          </Button>
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
    return <div className="admin-theme">{children}</div>;
  }

  // Render full admin layout for authenticated users
  return (
    <div className="h-screen admin-theme bg-gradient-to-br from-background via-background to-accent/20 lg:flex">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-500 ease-in-out ${
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
        <SheetContent 
          side="left" 
          className="p-0 w-72 border-r border-border/50 admin-theme bg-sidebar/95 backdrop-blur-sm"
        >
          <AdminSidebar 
            isCollapsed={false} 
            onToggleCollapse={() => {}} 
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 bg-primary/5 backdrop-blur-xl border-b border-border/50 px-6 shadow-sm">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Header content */}
          <div className="flex flex-1 gap-x-4 self-stretch">
            <AdminHeader user={user} />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        {/* <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Novaa Global Properties Admin Panel</span>
              <div className="h-1 w-1 bg-muted-foreground rounded-full"></div>
              <span>v2.0.1</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}