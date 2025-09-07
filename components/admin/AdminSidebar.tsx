"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Settings,
  Users,
  BarChart3,
  Image,
  ChevronDown,
  ChevronRight,
  Layout,
  MessageSquare,
  Tag,
  BookOpen,
  Briefcase,
  FolderTree,
  LayoutPanelLeft,
  PanelsTopLeft,
  Navigation,
  Columns3,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  {
    name: "Layout Management",
    href: "#",
    icon: PanelsTopLeft,
    children: [
      { name: "Navigation Bar", href: "/admin/navbar", icon: Navigation },
      { name: "Footer Section", href: "/admin/footer", icon: Columns3 },
    ],
  },
  {
    name: "Blog Management",
    href: "#",
    icon: BookOpen,
    children: [
      { name: "Blog Categories", href: "/admin/blog-categories", icon: Tag },
      { name: "Blogs", href: "/admin/blogs", icon: FileText },
    ],
  },
  {
    name: "Project Management",
    href: "#",
    icon: Briefcase,
    children: [
      {
        name: "Project Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      { name: "Projects", href: "/admin/projects", icon: LayoutPanelLeft },
    ],
  },
  { name: "Media Library", href: "/admin/media", icon: Image },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if any child item is active to highlight parent
  const hasActiveChild = (children?: NavigationItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.href));
  };

  const NavItem = ({
    item,
    level = 0,
  }: {
    item: NavigationItem;
    level?: number;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);
    const itemIsActive = item.href !== "#" && isActive(item.href);
    const childIsActive = hasActiveChild(item.children);

    // Auto-expand parent if child is active
    if (childIsActive && !isExpanded) {
      setExpandedItems(prev => new Set([...prev, item.name]));
    }

    // Collapsed state with children
    if (isCollapsed && hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-3 h-12 rounded-xl transition-all duration-300 ${
                  itemIsActive || childIsActive
                    ? "bg-primary/15 text-primary shadow-lg ring-2 ring-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-gray-900 hover:shadow-md"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              className="bg-card/70 text-gray-900 backdrop-blur-sm border-border/50 shadow-lg  pl-2"
              sideOffset={10}
            >
              <div className="p-3">
                <div className="font-medium text-sm mb-2">{item.name}</div>
                <div className="space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors hover:bg-accent/50 ${
                        isActive(child.href) ? 'bg-primary/10 text-primary font-medium' : ''
                      }`}
                    >
                      <child.icon className="h-4 w-4 mr-2" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Collapsed state without children
    if (isCollapsed && !hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-3 h-12 rounded-xl transition-all duration-300 ${
                  itemIsActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:text-white hover:scale-[1.02] shadow-lg ring-2 ring-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-gray-900 hover:shadow-md"
                }`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              className="bg-card/95 text-gray-900 backdrop-blur-sm border-border/50 shadow-lg  pl-2"
              sideOffset={10}
            >
              {item.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Expanded state with children
    if (hasChildren) {
      return (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.name)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-3 h-12 rounded-xl transition-all duration-300 group ${
                itemIsActive || childIsActive
                  ? "bg-primary/15 text-primary hover:text-gray-900 shadow-lg ring-2 ring-primary/20"
                  : "text-sidebar-foreground hover:bg-primary/15 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
              <span className="flex-1 text-left font-medium">{item.name}</span>
              <div className="transition-transform duration-300">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-6 mt-2">
            {item.children?.map((child) => (
              <NavItem key={child.name} item={child} level={level + 1} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Regular item without children
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start px-4 py-3 h-12 rounded-xl transition-all duration-300 group ${
          itemIsActive
            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:text-white shadow-lg ring-2 ring-primary/20"
            : "text-sidebar-foreground hover:bg-primary/15 hover:text-primary hover:shadow-md hover:scale-[1.02]"
        }`}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
          <span className="font-medium">{item.name}</span>
        </Link>
      </Button>
    );
  };

  return (
    <div
      className={`flex h-screen flex-col bg-sidebar/90 backdrop-blur-sm border-r border-sidebar-border/50 shadow-xl transition-all duration-500 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo Section */}
      <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-sidebar-border/50 bg-gradient-to-tl from-background via-background to-accent/20">
        {!isCollapsed ? (
          <Link href="/admin/dashboard" className="flex items-center group">
            <div className="h-10 w-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-sidebar-primary/20">
              <span className="text-sidebar-primary-foreground font-bold text-lg">
                N
              </span>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
                Novaa
              </span>
              <div className="text-xs text-sidebar-foreground/70 font-medium">
                Admin Portal
              </div>
            </div>
          </Link>
        ) : (
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center w-full group"
          >
            <div className="h-10 w-10 bg-gradient-to-tl from-sidebar-primary to-sidebar-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-sidebar-primary/20">
              <span className="text-sidebar-primary-foreground font-bold text-lg">
                N
              </span>
            </div>
          </Link>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={`h-8 w-8 p-0 rounded-lg cursor-pointer hover:bg-sidebar-accent/50 transition-all duration-300 ${
            isCollapsed ? "hidden" : "flex"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border/50 bg-sidebar/30">
        {!isCollapsed ? (
          <div className="text-center space-y-2">
            <div className="text-xs text-sidebar-foreground/70 font-medium">
              © 2025 Novaa Real Estates
            </div>
            <div className="text-xs text-sidebar-primary font-medium">
              Admin v2.0
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                System Online
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="absolute top-20 -right-3 z-50">
          <Button
            onClick={onToggleCollapse}
            size="sm"
            className="h-6 w-6 p-0 rounded-full shadow-lg bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground ring-2 ring-background"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sidebar-primary/5 to-sidebar-accent/5 pointer-events-none" />
    </div>
  );
}