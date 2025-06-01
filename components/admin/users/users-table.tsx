'use client'

import { useState } from 'react'
import { Eye, Trash2, Search, Filter, MoreVertical, Shield } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  reports: Array<{
    id: string
    createdAt: Date
  }>
  _count: {
    answers: number
  }
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    let matchesStatus = true
    if (statusFilter === 'completed') {
      matchesStatus = user.reports.length > 0
    } else if (statusFilter === 'pending') {
      matchesStatus = user.reports.length === 0
    }

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          window.location.reload()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Answers</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {user.name || 'No name provided'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    {user.role === 'user' && (
                      <button
                        onClick={() => handleRoleUpdate(user.id, 'admin')}
                        className="p-1 text-purple-600 hover:text-purple-800"
                        title="Promote to Admin"
                      >
                        <Shield className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    user.reports.length > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.reports.length > 0 ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {user._count.answers} answers
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}

      {/* Summary */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      )}
    </div>
  )
}
