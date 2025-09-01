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

// {
//     name: 'Navigation',
//     href: '#',
//     icon: Layout,
//     children: [
//       { name: 'Navbar', href: '/admin/dashboard/navbar-management', icon: Layout },
//       { name: 'Footer', href: '/admin/dashboard/footer-management', icon: Layout },
//     ],
//   },

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Pages", href: "/admin/pages", icon: FileText },

  {
    name: "Layout",
    href: "#",
    icon: Layout,
    children: [
      { name: "Navbar", href: "/admin/navbar", icon: Layout },
      { name: "Footer", href: "/admin/footer", icon: Layout },
    ],
  },
  { name: "Media Library", href: "/admin/media", icon: Image },
  {
    name: "Curated Collection",
    href: "/admin/curated-collection",
    icon: ListCollapse, // Use your preferred icon
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: Building,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
  // { name: "Users", href: "/admin/users", icon: Users },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { name: "Contact Forms", href: "/admin/contact", icon: MessageSquare },
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-2 h-10 ${
                  itemIsActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col space-y-1">
              <span className="font-medium">{item.name}</span>
              {item.children?.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  {child.name}
                </Link>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (isCollapsed && !hasChildren) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-center p-2 h-10 ${
                  itemIsActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
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
              className={`w-full justify-start pl-${2 + level * 4} pr-2 h-10 ${
                itemIsActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">{item.name}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-5">
            {item.children?.map((child) => (
              <NavItem key={child.name} item={child} level={level + 1} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        className={`w-full justify-start pl-${2 + level * 4} pr-2 h-10 ${
          itemIsActive
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="h-5 w-5 mr-3" />
          <span>{item.name}</span>
        </Link>
      </Button>
    );
  };

  return (
    <div
      className={`fixed flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Novaa Admin
            </span>
          </Link>
        )}

        {isCollapsed && (
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center w-full"
          >
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
          </Link>
        )}

        {/* Collapse Toggle - Only show on desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={`hidden lg:flex h-6 w-6 p-0 ${
            isCollapsed ? "mx-auto" : ""
          }`}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            © 2024 Novaa Global Properties
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>
    </div>
  );
}
