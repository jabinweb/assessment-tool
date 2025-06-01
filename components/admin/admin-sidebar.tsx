'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Shield,
  Bell,
  Database,
  Mail,
  Activity
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Questions',
    href: '/admin/questions',
    icon: FileText
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp
  },
  {
    title: 'Careers',
    href: '/admin/careers',
    icon: Briefcase
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell
  },
  {
    title: 'Activity Logs',
    href: '/admin/logs',
    icon: Activity
  },
  {
    title: 'Backup',
    href: '/admin/backup',
    icon: Database
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen flex flex-col relative z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static`}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-lg lg:text-xl font-bold">Admin Panel</h1>
                <p className="text-gray-400 text-xs lg:text-sm">Assessment Tool</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors hidden lg:block"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-2 lg:p-4">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose} // Close mobile menu on navigation
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center px-2 lg:px-3' : 'px-2 lg:px-3'
                    } py-2 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-2 lg:ml-3 truncate">{item.title}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info - Fixed at bottom */}
        {!isCollapsed && (
          <div className="p-3 lg:p-4 border-t border-gray-700 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-2 lg:p-3">
              <div className="flex items-center">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs lg:text-xs font-medium">A</span>
                </div>
                <div className="ml-2 lg:ml-3">
                  <p className="text-xs lg:text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
