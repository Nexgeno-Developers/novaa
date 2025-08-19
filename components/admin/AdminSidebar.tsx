'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft,
  ChevronRight,
  Home,
  Navigation,
  FileText,
  Users,
  BarChart3,
  Settings,
  Image,
  Building,
  User2,
  Settings2Icon,
  User2Icon,
  UserCircle
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    name: 'Navbar Management',
    href: '/admin/dashboard/navbar-management',
    icon: Navigation,
  },
  {
    name: 'Home Management',
    href: '/admin/dashboard/home-management',
    icon: FileText,
  },
  {
    name: 'Media',
    href: '/admin/dashboard/media-management',
    icon: Image,
  },
  {
    name: 'About',
    href: '/admin/dashboard/about-management',
    icon: Users,
  },
  {
    name: 'Why Invest Us',
    href: '/admin/dashboard/why-invest-management',
    icon: Settings,
  },
  {
    name: 'Phuket Properties Manager',
    href: '/admin/dashboard/properties-manager',
    icon: Building,
  },
  {
    name: 'Novaa Advantages Manager',
    href: '/admin/dashboard/advantage-management',
    icon: Building,
  },
  {
    name: 'Faq Manager',
    href: '/admin/dashboard/faq-manager',
    icon: Settings2Icon,
  },
  {
    name: 'Testimonials Manager',
    href: '/admin/dashboard/testimonial-manager',
    icon: User2Icon,
  },
  {
    name: 'Investor Insights Manager',
    href: '/admin/dashboard/investor-insights-management',
    icon: UserCircle,
  },
];

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar implementation here */}
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Logo and toggle button */}
          <div className="flex items-center justify-between px-4 pb-4">
            {!collapsed && (
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => onToggle(!collapsed)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      collapsed ? 'mx-auto' : 'mr-3'
                    } ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile section */}
          {!collapsed && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}