'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux';
import { logout } from '@/redux/slices/authSlice';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';

interface AdminHeaderProps {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

export default function AdminHeader({ 
  sidebarCollapsed, 
  onSidebarToggle 
}: AdminHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu button */}
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => onSidebarToggle && onSidebarToggle(!sidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumb or page title could go here */}
            <div className="hidden sm:block ml-4 lg:ml-0">
              <h1 className="text-lg font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative">
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 p-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      // Handle profile navigation
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}