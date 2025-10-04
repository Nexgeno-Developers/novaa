"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Image,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Tag,
  BookOpen,
  Briefcase,
  FolderTree,
  LayoutPanelLeft,
  PanelsTopLeft,
  Navigation,
  Columns3,
  BookCopy,
  Sparkles,
  X,
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
  isMobile?: boolean;
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
      { name: "Navigation", href: "/admin/navbar", icon: Navigation },
      { name: "Footer", href: "/admin/footer", icon: Columns3 },
    ],
  },
  {
    name: "Blog",
    href: "#",
    icon: BookCopy,
    children: [
      { name: "Categories", href: "/admin/blog-categories", icon: Tag },
      { name: "Our Blogs", href: "/admin/blogs", icon: FileText },
    ],
  },
  {
    name: "Projects",
    href: "#",
    icon: Briefcase,
    children: [
      {
        name: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      { name: "Our Projects", href: "/admin/projects", icon: LayoutPanelLeft },
    ],
  },
  { name: "Media", href: "/admin/media", icon: Image },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    return pathname.startsWith(href) && href !== "#";
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

    // Check if any child is active for parent highlighting
    const hasActiveChild =
      hasChildren &&
      !isCollapsed &&
      item.children?.some((child) => isActive(child.href));

    if (isCollapsed && hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-0 h-12 mb-2 rounded-xl transition-all duration-300 group relative ${
                  hasActiveChild
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:text-white hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 hover:-translate-y-0.5"
                    : "text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 hover:-translate-y-0.5"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-all duration-300 ${
                    hasActiveChild ? "drop-shadow-sm" : "group-hover:scale-110"
                  }`}
                />
                {hasActiveChild && (
                  <div className="absolute -right-1 top-2 w-1.5 h-8 bg-emerald-500 rounded-full shadow-sm" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="admin-sidebar-tooltip">
              <div className="flex flex-col space-y-2 min-w-[160px]">
                <span className="font-bold text-slate-800 text-base border-b border-emerald-200 pb-1">
                  {item.name}
                </span>
                {item.children?.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg transition-all duration-200 border border-transparent hover:border-emerald-200 hover:shadow-sm"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (isCollapsed && !hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-0 h-12 mb-2 rounded-xl transition-all duration-300 group relative ${
                  itemIsActive
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:text-white hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 hover:-translate-y-0.5"
                    : "text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 hover:-translate-y-0.5"
                }`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      itemIsActive ? "drop-shadow-sm" : "group-hover:scale-110"
                    }`}
                  />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="admin-sidebar-tooltip">
              <span className="text-sm font-bold text-slate-800">
                {item.name}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (hasChildren) {
      return (
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.name)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-12 mb-1 rounded-xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white text-slate-700 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <item.icon className="h-5 w-5 mr-3 text-slate-500 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
              <span className="flex-1 text-left font-medium text-sm">
                {item.name}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:rotate-180" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-out">
            <div className="space-y-1 ml-8 mb-2">
              {item.children?.map((child) => (
                <div key={child.name}>
                  <NavItem item={child} level={level + 1} />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        className={`w-full justify-start px-4 py-3 h-12 mb-1 rounded-xl transition-all duration-300 group relative ${
          level > 0 ? "ml-0" : ""
        } ${
          itemIsActive
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:text-white hover:shadow-xl hover:shadow-emerald-500/50"
            : "text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25"
        }`}
        asChild
      >
        <Link href={item.href}>
          <item.icon
            className={`h-5 w-5 mr-3 transition-all duration-300 ${
              itemIsActive ? "drop-shadow-sm" : "group-hover:scale-110"
            } ${itemIsActive ? "" : "text-slate-500 group-hover:text-white"}`}
          />
          <span className="font-medium text-sm">{item.name}</span>
          {itemIsActive && (
            <div className="absolute right-3 w-2 h-2 bg-white/40 rounded-full shadow-sm" />
          )}
        </Link>
      </Button>
    );
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      className={`flex h-full flex-col border-r transition-all duration-500 ease-out ${
        isCollapsed ? "w-20" : "w-72"
      } admin-sidebar-gradient admin-sidebar-gradient-fallback`}
      style={{
        boxShadow:
          "inset -1px 0 0 rgba(205, 176, 78, 0.1), 4px 0 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo - Fixed at top */}
      <div className="flex h-20 shrink-0 items-center justify-between px-4 relative">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center group">
            <div className="ml-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                Novaa Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
            </div>
          </Link>
        )}
        {/* 
        {isCollapsed && (
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center w-full group"
          >
            
          </Link>
        )} */}

        {/* Modern Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={`hidden lg:flex h-10 w-10 p-0 rounded-2xl sidebar-toggle-btn ${
            isCollapsed
              ? "mx-auto sidebar-collapsed"
              : "ml-auto sidebar-expanded"
          }`}
        >
          <div className="relative w-5 h-5">
            {/* Menu Icon */}
            <Menu
              className={`sidebar-toggle-icon absolute inset-0 h-5 w-5 text-gray-900 ${
                isCollapsed
                  ? "sidebar-toggle-icon-enter opacity-100"
                  : "sidebar-toggle-icon-exit opacity-0"
              }`}
            />
            {/* X Icon */}
            <X
              className={`hidden lg:flex sidebar-toggle-icon absolute inset-0 h-5 w-5 text-gray-900 ${
                !isCollapsed
                  ? "sidebar-toggle-icon-enter opacity-100"
                  : "sidebar-toggle-icon-exit opacity-0"
              }`}
            />
          </div>
        </Button>
      </div>

      {/* Navigation - Scrollable area */}
      <div className="flex-1 overflow-hidden pt-2">
        <ScrollArea className="h-full px-3">
          <nav>
            {/* Primary Navigation */}
            <div>
              {navigation.slice(0, 2).map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
            {/* Secondary Navigation */}
            <div>
              {navigation.slice(2).map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </nav>
        </ScrollArea>
      </div>

      {/* Bottom section - Fixed at bottom */}
      <div className="shrink-0 p-4 border-t border-slate-200/30 bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-sm">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                Novaa Global Properties
              </p>
              <p className="text-xs text-emerald-500">ADMIN CMS</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
