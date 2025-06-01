'use client'

import { useState } from 'react'
import { Eye, Download, Search, Filter } from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string
  userId: string
  aptitudeScores: any
  personalityScores: any
  interestScores: any
  personalitySummary: string
  interestSummary: string
  careerMatches: any
  pdfUrl: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string
    createdAt: Date
  }
}

interface ReportsTableProps {
  reports: Report[]
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.email.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesDate = true
    if (dateFilter !== 'all') {
      const now = new Date()
      const reportDate = new Date(report.createdAt)
      
      switch (dateFilter) {
        case 'today':
          matchesDate = reportDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = reportDate >= weekAgo
          break
        case 'month':
          matchesDate = reportDate.getMonth() === now.getMonth() && 
                       reportDate.getFullYear() === now.getFullYear()
          break
      }
    }

    return matchesSearch && matchesDate
  })

  const getTopCareerMatch = (careerMatches: any) => {
    if (!Array.isArray(careerMatches) || careerMatches.length === 0) {
      return 'No matches'
    }
    return careerMatches[0]?.title || 'Unknown'
  }

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${reportId}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading report:', error)
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
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Top Career Match</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Completion Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {report.user.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500">{report.user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {getTopCareerMatch(report.careerMatches)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    report.pdfUrl 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.pdfUrl ? 'PDF Generated' : 'Processing'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {report.pdfUrl && (
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </div>
      )}

      {/* Pagination placeholder */}
      {filteredReports.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
        </div>
      )}
    </div>
  )
}
