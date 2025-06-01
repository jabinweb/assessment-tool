'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const notifications = [
    { id: 1, message: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, message: 'Assessment completed', time: '15 min ago', unread: true },
    { id: 3, message: 'System backup completed', time: '1 hour ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`bg-white border-b border-gray-200 h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 transition-shadow duration-200 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      {/* Left Section */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        {/* Search - Hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, reports..."
            className="pl-10 pr-4 py-2 w-60 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Mobile Search Button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 lg:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Notifications</h3>
              </div>
              <div className="max-h-60 lg:max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 lg:p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-xs lg:text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button className="text-xs lg:text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-1 lg:space-x-2 p-1 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs lg:text-sm font-medium">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-44 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Settings
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
