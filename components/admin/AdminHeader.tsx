"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Command,
  Plus,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Image,
  Briefcase,
  BookOpen,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";

interface AdminHeaderProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "New contact form submission",
    description: "John Doe submitted a property inquiry",
    time: "2 minutes ago",
    type: "contact",
    unread: true,
  },
  {
    id: 2,
    title: "Blog post published",
    description: "Latest market trends article is now live",
    time: "1 hour ago",
    type: "content",
    unread: true,
  },
  {
    id: 3,
    title: "System backup completed",
    description: "Daily backup finished successfully",
    time: "3 hours ago",
    type: "system",
    unread: false,
  },
];

// Command palette items
const commandItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Activity },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Media Library", href: "/admin/media", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminHeader({
  user,
  isSidebarCollapsed = false,
  onToggleSidebar,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get loading state from Redux
  const { loading } = useSelector((state: RootState) => state.auth);

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Get page title from pathname
  const getPageTitle = useCallback(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";

    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [pathname]);

  // Get breadcrumbs
  const getBreadcrumbs = useCallback(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; path: string; isLast: boolean }[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index > 0) {
        // Skip the 'admin' segment
        breadcrumbs.push({
          label:
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " "),
          path: currentPath,
          isLast: index === segments.length - 1,
        });
      }
    });

    return breadcrumbs;
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error: any) {
      toast.error(error?.message || "Failed to logout");
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <div className="flex w-full items-center justify-between h-full">
        {/* Left side - Modern Page info */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            {/* Page Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Activity className="h-4 w-4 text-white" />
            </div>

            {/* Page Title and Status */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent truncate">
                  {getPageTitle()}
                </h1>
                <span className="text-xs text-slate-500 font-medium">
                  Admin Panel
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm animate-pulse" />
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-green-50 text-green-700 hidden sm:inline-flex"
                >
                  Online
                </Badge>
              </div>
            </div>
          </div>

          {breadcrumbs.length > 0 && (
            <nav
              className="hidden sm:flex items-center text-sm text-slate-500 mt-2"
              aria-label="Breadcrumb"
            >
              <span className="font-medium text-slate-600">•</span>
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={index} className="flex items-center">
                  <ChevronDown className="mx-2 h-3 w-3 rotate-[-90deg] text-slate-400" />
                  <button
                    onClick={() => router.push(breadcrumb.path)}
                    className={`transition-colors hover:text-slate-700 truncate font-medium ${
                      breadcrumb.isLast
                        ? "text-emerald-600"
                        : "cursor-pointer text-slate-500"
                    }`}
                  >
                    {breadcrumb.label}
                  </button>
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Desktop Sidebar Toggle - Only shown when sidebar is collapsed */}
        {isSidebarCollapsed && onToggleSidebar && (
          <div className="hidden lg:flex mr-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-10 w-10 p-0 rounded-2xl sidebar-toggle-btn sidebar-expanded"
            >
              <div className="relative w-5 h-5">
                <Menu className="sidebar-toggle-icon sidebar-toggle-icon-enter opacity-100 h-5 w-5 text-slate-500" />
              </div>
            </Button>
          </div>
        )}

        {/* Right side - Modern Search and actions */}
        <div className="flex items-center space-x-2 lg:space-x-3 shrink-0">
          {/* Modern Search - Desktop */}
          <div className="relative hidden lg:block">
            <Button
              variant="outline"
              className="relative w-64 xl:w-80 h-11 justify-start text-sm bg-white/60 backdrop-blur-xl border-slate-200/60 hover:bg-white/80 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-3 h-4 w-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              <span className="hidden xl:inline text-slate-600 group-hover:text-gray-900">
                Search or jump to...
              </span>
              <span className="xl:hidden text-slate-600 group-hover:text-slate-800">
                Search...
              </span>
              <div className="absolute right-3 flex items-center space-x-1 group-hover:text-gray-900">
                <kbd className="inline-flex items-center rounded-lg border border-slate-200/60 px-1.5 py-0.5 text-xs font-mono bg-white/80">
                  <Command className="h-3 w-3" />
                </kbd>
                <kbd className="inline-flex items-center rounded-lg border border-slate-200/60 px-1.5 py-0.5 text-xs font-mono bg-white/80">
                  K
                </kbd>
              </div>
            </Button>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4 text-slate-500 hover:text-emerald-600 transition-colors" />
          </Button>

          {/* Modern Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Quick Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-card/95 backdrop-blur-sm border-border/50 admin-theme"
              >
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/admin/navbar")}
                >
                  <FileText className="mr-2 h-4 w-4 hover:text-background" />
                  Manage Navbar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/admin/blogs/")}
                >
                  <BookOpen className="mr-2 h-4 w-4 hover:text-background" />
                  New Blog Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/admin/projects/create")}
                >
                  <Briefcase className="mr-2 h-4 w-4 hover:text-background" />
                  New Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/admin/media")}
                >
                  <Image className="mr-2 h-4 w-4 hover:text-background" />
                  Upload Media
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modern Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Bell className="h-4 w-4 text-slate-500 hover:text-slate-700 transition-colors" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only slim;">View notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 bg-card/95 backdrop-blur-sm border-border/50 shadow-xl admin-theme"
              >
                <DropdownMenuLabel className="flex items-center justify-between p-4">
                  <span className="font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 sm:p-4 hover:bg-accent/30 cursor-pointer transition-colors border-l-4 ${
                        notification.type === "contact"
                          ? "border-green-500"
                          : notification.type === "content"
                          ? "border-blue-500"
                          : "border-purple-500"
                      } ${notification.unread ? "bg-accent/10" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "contact"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : notification.type === "content"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                          }`}
                        >
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full text-sm font-medium text-primary"
                  >
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modern User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  <Avatar className="h-7 w-7 ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/30 transition-all duration-300">
                    <AvatarImage src={"/avatars/admin.svg"} alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "AD"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 sm:w-64 bg-card/95 backdrop-blur-sm border-border/50 shadow-xl admin-theme"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-3 sm:p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/20">
                        <AvatarImage src={"/avatars/admin.svg"} alt="Admin" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                          {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-none truncate">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                          {user?.email || "admin@novaa.com"}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-2">
                          Super Admin
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => router.push("/admin/profile")}
                >
                  <User className="mr-3 h-4 w-4 hover:text-background" />
                  <span className="font-medium">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => router.push("/admin/settings")}
                >
                  <Settings className="mr-3 h-4 w-4 hover:text-background" />
                  <span className="font-medium">Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loading}
                  className="p-3 cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 hover:text-background" />
                  <span className="font-medium">
                    {loading ? "Signing out..." : "Sign Out"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        className="max-w-[90vw] sm:max-w-[500px] admin-theme"
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commandItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    router.push(item.href);
                    setCommandOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4 hover:text-background" />
                  <span>{item.name}</span>
                  <CommandShortcut>Go</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions" className="admin-theme">
            <CommandItem
              onSelect={() => {
                router.push("/admin/projects/create");
                setCommandOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4 hover:text-background" />
              <span>Create New Project</span>
              <CommandShortcut>⌘ N</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/admin/blogs");
                setCommandOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4 hover:text-background" />
              <span>Create New Blog</span>
              <CommandShortcut>⌘ B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
