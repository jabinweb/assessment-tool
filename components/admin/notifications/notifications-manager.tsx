'use client'

import { useState } from 'react'
import { Send, Users, Bell, Mail, MessageSquare } from 'lucide-react'

interface NotificationStats {
  totalUsers: number
  activeUsers: number
  completedUsers: number
  pendingUsers: number
}

interface NotificationsManagerProps {
  stats: NotificationStats
}

export function NotificationsManager({ stats }: NotificationsManagerProps) {
  const [activeTab, setActiveTab] = useState('compose')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const tabs = [
    { id: 'compose', label: 'Compose', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'history', label: 'History', icon: Bell }
  ]

  const userGroups = [
    { id: 'all', label: 'All Users', count: stats.totalUsers, color: 'bg-blue-500' },
    { id: 'active', label: 'Active Users', count: stats.activeUsers, color: 'bg-green-500' },
    { id: 'completed', label: 'Completed Assessment', count: stats.completedUsers, color: 'bg-purple-500' },
    { id: 'pending', label: 'Pending Assessment', count: stats.pendingUsers, color: 'bg-orange-500' }
  ]

  const [selectedGroup, setSelectedGroup] = useState('all')
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info' // info, success, warning, error
  })

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notificationData,
          targetGroup: selectedGroup
        })
      })

      if (response.ok) {
        alert('Notification sent successfully!')
        setNotificationData({ title: '', message: '', type: 'info' })
      } else {
        throw new Error('Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${group.color} p-3 rounded-full`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{group.label}</p>
                <p className="text-3xl font-bold text-gray-900">{group.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'compose' && (
            <div className="space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Audience
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {userGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedGroup === group.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{group.label}</p>
                        <p className="text-sm text-gray-500">{group.count} users</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={notificationData.type}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification title..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message..."
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSendNotification}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Templates</h3>
              <p className="text-gray-500">Create and manage notification templates</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Template
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notification History</h3>
              <p className="text-gray-500">View previously sent notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
