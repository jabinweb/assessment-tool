'use client'

import { ArrowLeft, User, Mail, Calendar, Shield, FileText, BarChart3, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface UserDetailsProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    age: number | null
    createdAt: Date
    reports: Array<{
      id: string
      createdAt: Date
      careerMatches: any
      personalitySummary: string
      interestSummary: string
    }>
    answers: Array<{
      id: string
      answer: string
      score: number | null
      createdAt: Date
      question: {
        id: string
        section: string
        text: string
      }
    }>
    _count: {
      answers: number
      reports: number
    }
  }
}

export function UserDetails({ user }: UserDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const handleRoleUpdate = async (newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
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

  const handleDeleteUser = async () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${user.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          window.location.href = '/admin/users'
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const getAnswersBySection = (section: string) => {
    return user.answers.filter(answer => answer.question.section === section)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'answers', label: 'Answers', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">{user.name || user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.role === 'user' && (
            <button
              onClick={() => handleRoleUpdate('admin')}
              className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              Promote to Admin
            </button>
          )}
          <button
            onClick={handleDeleteUser}
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Answers</p>
              <p className="text-3xl font-bold text-gray-900">{user._count.answers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Reports Generated</p>
              <p className="text-3xl font-bold text-gray-900">{user._count.reports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-3xl font-bold text-gray-900">{user.age || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
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

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['aptitude', 'personality', 'interest'].map((section) => {
                    const sectionAnswers = getAnswersBySection(section)
                    return (
                      <div key={section} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">{section}</h4>
                        <p className="text-2xl font-bold text-gray-900">{sectionAnswers.length}</p>
                        <p className="text-sm text-gray-500">answers provided</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'answers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Answers</h3>
              {user.answers.length > 0 ? (
                <div className="space-y-4">
                  {user.answers.slice(0, 20).map((answer) => (
                    <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          answer.question.section === 'aptitude' ? 'bg-blue-100 text-blue-800' :
                          answer.question.section === 'personality' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {answer.question.section}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{answer.question.text}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700">Answer: {answer.answer}</p>
                        {answer.score && (
                          <p className="text-sm text-gray-500">Score: {answer.score}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {user.answers.length > 20 && (
                    <p className="text-center text-gray-500">
                      Showing first 20 of {user.answers.length} answers
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No answers provided yet</p>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Reports</h3>
              {user.reports.length > 0 ? (
                <div className="space-y-4">
                  {user.reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Assessment Report</h4>
                          <p className="text-sm text-gray-500">
                            Generated on {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          href={`/admin/reports/${report.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                      {report.personalitySummary && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-700 mb-1">Personality Summary</h5>
                          <p className="text-gray-600 text-sm">{report.personalitySummary}</p>
                        </div>
                      )}
                      {report.interestSummary && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-1">Interest Summary</h5>
                          <p className="text-gray-600 text-sm">{report.interestSummary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reports generated yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
