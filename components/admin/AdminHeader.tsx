'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Command,
  Plus,
  Zap,
  Activity,
  Shield,
  ChevronDown,
  FileText,
  Image,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/redux/slices/authSlice';
import { RootState } from '@/redux';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';

interface AdminHeaderProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: 'New contact form submission',
    description: 'John Doe submitted a property inquiry',
    time: '2 minutes ago',
    type: 'contact',
    unread: true,
  },
  {
    id: 2,
    title: 'Blog post published',
    description: 'Latest market trends article is now live',
    time: '1 hour ago',
    type: 'content',
    unread: true,
  },
  {
    id: 3,
    title: 'System backup completed',
    description: 'Daily backup finished successfully',
    time: '3 hours ago',
    type: 'system',
    unread: false,
  },
];

// Command palette items
const commandItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
  { name: 'Pages', href: '/admin/pages', icon: FileText },
  { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Get loading state from Redux
  const { loading } = useSelector((state: RootState) => state.auth);

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true);
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Get page title from pathname
  const getPageTitle = useCallback(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return 'Dashboard';
    
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [pathname]);

  // Get breadcrumbs
  const getBreadcrumbs = useCallback(() => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; path: string; isLast: boolean; }[] = [];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index > 0) { // Skip the 'admin' segment
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath,
          isLast: index === segments.length - 1
        });
      }
    });
    
    return breadcrumbs;
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to logout');
    }
  };

  // const toggleTheme = () => {
  //   if (!mounted) return;
    
  //   const newDarkMode = !isDarkMode;
  //   setIsDarkMode(newDarkMode);
  //   document.documentElement.classList.toggle('dark');
    
  //   // Store preference
  //   localStorage.setItem('admin-theme', newDarkMode ? 'dark' : 'light');
    
  //   toast.success(`Switched to ${newDarkMode ? 'dark' : 'light'} mode`);
  // };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <div className="flex w-full items-center justify-between h-full ">
        {/* Left side - Page info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {getPageTitle()}
            </h1>
            <Badge variant="outline" className="text-xs font-medium hidden sm:inline-flex">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center text-sm text-muted-foreground mt-1" aria-label="Breadcrumb">
              <span className="font-medium">Admin</span>
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={index} className="flex items-center">
                  <ChevronDown className="mx-2 h-3 w-3 rotate-[-90deg]" />
                  <button 
                    onClick={() => router.push(breadcrumb.path)}
                    className={`transition-colors hover:text-foreground ${
                      breadcrumb.isLast 
                        ? 'text-primary font-medium' 
                        : 'cursor-pointer'
                    }`}
                  >
                    {breadcrumb.label}
                  </button>
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Right side - Search and actions */}
        <div className="flex items-center space-x-3">
          {/* Search with Command palette style */}
          <div className="relative hidden md:block">
            <Button
              variant="outline"
              className="relative w-80 h-10 justify-start text-sm text-muted-foreground hover:bg-accent/50 cursor-pointer dark:hover:text-gray-900"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search or jump to...
              <div className="absolute right-2 flex items-center space-x-1">
                <kbd className="inline-flex items-center rounded border border-border/50 px-1.5 py-0.5 text-xs font-mono">
                  <Command className="h-3 w-3" />
                </kbd>
                <kbd className="inline-flex items-center rounded border border-border/50 px-1.5 py-0.5 text-xs font-mono">
                  K
                </kbd>
              </div>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Add Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  className="h-10 w-10 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-sm border-border/50">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/admin/navbar')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Navbar
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/admin/blogs/')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  New Blog Post
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/admin/projects/create')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  New Project
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/admin/media')}>
                  <Image className="mr-2 h-4 w-4" />
                  Upload Media
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-10 w-10 rounded-xl hover:bg-accent/20 cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">View notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
                <DropdownMenuLabel className="flex items-center justify-between p-4">
                  <span className="font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-accent/30 cursor-pointer transition-colors border-l-4 ${
                        notification.type === 'contact' ? 'border-green-500' :
                        notification.type === 'content' ? 'border-blue-500' :
                        'border-purple-500'
                      } ${notification.unread ? 'bg-accent/10' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'contact' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                          notification.type === 'content' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {notification.type === 'contact' ? <User className="h-4 w-4" /> :
                           notification.type === 'content' ? <FileText className="h-4 w-4" /> :
                           <Shield className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="ghost" className="w-full text-sm font-medium text-primary">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            {/* <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button> */}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={user?.avatar || "/avatars/admin.jpg"} alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-sm border-border/50 shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={user?.avatar || "/avatars/admin.jpg"} alt="Admin" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'AD'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold leading-none">
                          {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user?.email || 'admin@novaa.com'}
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
                  onClick={() => router.push('/admin/profile')}
                >
                  <User className="mr-3 h-4 w-4" />
                  <span className="font-medium">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span className="font-medium">Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => router.push('/admin/help')}
                >
                  <Zap className="mr-3 h-4 w-4" />
                  <span className="font-medium">Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  disabled={loading}
                  className="p-3 cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">
                    {loading ? 'Signing out...' : 'Sign Out'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} className='max-w-[500px]'>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commandItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                className='text-background dark:text-primary'
                  key={item.href}
                  onSelect={() => {
                    router.push(item.href);
                    setCommandOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                  <CommandShortcut>Go</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => {
              router.push('/admin/projects/create');
              setCommandOpen(false);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              <span className='text-gray-900'>Create New Project</span>
              <CommandShortcut className='text-gray-900'>⌘ N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => {
              router.push('/admin/blogs');
              setCommandOpen(false);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              <span className='text-gray-900'>Create New Blog</span>
              <CommandShortcut className='text-gray-900'>⌘ B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}