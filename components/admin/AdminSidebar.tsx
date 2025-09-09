"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BlogIcon from '@/public/images/blog.png'
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
  Globe,
  MessageSquare,
  Mail,
  Building,
  TrendingUp,
  HelpCircle,
  Star,
  Info,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Tag,
  ListCollapse,
  BookOpen,
  Briefcase,
  FolderTree,
  LayoutPanelLeft,
  PanelsTopLeft,
  Navigation,
  Columns3,
  BookCopy,
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
    icon: BookCopy,
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

    if (isCollapsed && hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-0 h-12 mb-1 rounded-xl transition-all duration-200 group ${
                  itemIsActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:shadow-md hover:shadow-slate-200/50 backdrop-blur-sm"
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${itemIsActive ? '' : 'group-hover:scale-110'}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
              <div className="flex flex-col space-y-2 p-1">
                <span className="font-medium text-slate-900">{item.name}</span>
                {item.children?.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
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
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-0 h-12 mb-1 rounded-xl transition-all duration-200 group ${
                  itemIsActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:shadow-md hover:shadow-slate-200/50 backdrop-blur-sm"
                }`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={`h-5 w-5 transition-transform duration-200 ${itemIsActive ? '' : 'group-hover:scale-110'}`} />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
              {item.name}
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
              className={`w-full justify-start px-3 py-2 h-12 mb-1 rounded-xl transition-all duration-200 group ${
                itemIsActive
                  ? "bg-primary/15 text-primary hover:text-gray-900 shadow-lg ring-2 ring-primary/20"
                  : "text-sidebar-foreground hover:bg-primary/15 hover:text-primary hover:shadow-md backdrop-blur-sm"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
              <span className="flex-1 text-left font-medium">{item.name}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
            <div className="space-y-1 ml-2 pt-1 pb-2">
              {item.children?.map((child) => (
                <div className="w-[95%] " key={child.name}>
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
        className={`w-full justify-start px-3 pr-4 py-3 h-12 mb-1 rounded-xl transition-all duration-200 group ${
          level > 0 ? 'ml-2' : ''
        } ${
          itemIsActive
            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:text-white shadow-lg ring-2 ring-primary/20" 
            : "text-sidebar-foreground hover:bg-primary/15 hover:text-primary hover:shadow-md"
        }`}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium">{item.name}</span>
        </Link>
      </Button>
    );
  };

  return (
    <div
      className={`fixed flex h-full flex-col bg-sidebar backdrop-blur-sm border-r border-sidebar-border/50 shadow-xl ransition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}
      // style={{
      //   background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
      //   backdropFilter: 'blur(20px)',
      //   borderRight: '1px solid rgba(226, 232, 240, 0.6)'
      // }}
    >
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center justify-between px-4 border-b border-slate-200/50">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center group">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-200">
              <span className="text-white font-bold text-lg">
                N
              </span>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Novaa Admin
            </span>
          </Link>
        )}

        {isCollapsed && (
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center w-full group"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-200">
              <span className="text-white font-bold text-lg">
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
          className={`hidden lg:flex h-8 w-8 p-0 rounded-lg hover:bg-white/70 hover:shadow-md transition-all duration-200 ${
            isCollapsed ? "mx-auto mt-2" : ""
          }`}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-slate-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-200/50">
        {!isCollapsed ? (
          <div className="text-xs text-slate-500 text-center font-medium">
            © 2024 Novaa Global Properties
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>
    </div>
  );
}