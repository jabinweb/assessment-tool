'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UserDropdown } from './user-dropdown';

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  notificationCount?: number;
}

export function DashboardHeader({ 
  userName, 
  userRole, 
  notificationCount = 0 
}: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Career Assessment"
                width={32}
                height={32}
                className="mr-3"
              />
              <span className="text-xl font-bold text-gray-900">Career Assessment</span>
            </Link>
          </div>

          {/* Navigation and User Info */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <UserDropdown userName={userName} userRole={userRole} />
          </div>
        </div>
      </div>
    </header>
  );
}
