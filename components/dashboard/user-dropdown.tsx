'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserDropdownProps {
  userName: string;
  userRole: string;
}

export function UserDropdown({ userName, userRole }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-2"
      >
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">{userName}</div>
          <div className="text-xs text-gray-500 capitalize">{userRole}</div>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 mr-3" />
              Profile Settings
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
