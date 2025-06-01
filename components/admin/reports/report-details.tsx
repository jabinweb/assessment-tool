'use client'

import { ArrowLeft, Download, User, Calendar, Mail, Hash } from 'lucide-react'
import Link from 'next/link'

interface ReportDetailsProps {
  report: {
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
      age: number | null
    }
  }
}

export function ReportDetails({ report }: ReportDetailsProps) {
  const downloadReport = async () => {
    try {
      const response = await fetch(`/api/admin/reports/${report.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${report.id}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  const renderScoreBar = (score: number, maxScore: number = 100) => {
    const percentage = Math.min((score / maxScore) * 100, 100)
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    )
  }

  const aptitudeScores = Array.isArray(report.aptitudeScores) ? report.aptitudeScores : []
  const personalityScores = typeof report.personalityScores === 'object' ? report.personalityScores : {}
  const interestScores = typeof report.interestScores === 'object' ? report.interestScores : {}
  const careerMatches = Array.isArray(report.careerMatches) ? report.careerMatches : []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Reports
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessment Report</h1>
            <p className="text-gray-600">Detailed analysis for {report.user.name || report.user.email}</p>
          </div>
        </div>
        {report.pdfUrl && (
          <button
            onClick={downloadReport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{report.user.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{report.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{report.user.age || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Assessment Date</p>
                  <p className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Status */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PDF Generated</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.pdfUrl 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.pdfUrl ? 'Yes' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {new Date(report.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aptitude Scores */}
          {aptitudeScores.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Aptitude Scores</h2>
              <div className="space-y-4">
                {aptitudeScores.map((score: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{score.category || `Category ${index + 1}`}</span>
                      <span className="text-sm text-gray-600">{score.score || 0}/100</span>
                    </div>
                    {renderScoreBar(score.score || 0)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personality Scores */}
          {Object.keys(personalityScores).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personality Traits</h2>
              <div className="space-y-4">
                {Object.entries(personalityScores).map(([trait, score]: [string, any]) => (
                  <div key={trait}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">{trait}</span>
                      <span className="text-sm text-gray-600">{score}/100</span>
                    </div>
                    {renderScoreBar(score)}
                  </div>
                ))}
              </div>
              {report.personalitySummary && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Personality Summary</h3>
                  <p className="text-gray-700 text-sm">{report.personalitySummary}</p>
                </div>
              )}
            </div>
          )}

          {/* Interest Scores */}
          {Object.keys(interestScores).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interest Areas</h2>
              <div className="space-y-4">
                {Object.entries(interestScores).map(([interest, score]: [string, any]) => (
                  <div key={interest}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">{interest}</span>
                      <span className="text-sm text-gray-600">{score}/100</span>
                    </div>
                    {renderScoreBar(score)}
                  </div>
                ))}
              </div>
              {report.interestSummary && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Interest Summary</h3>
                  <p className="text-gray-700 text-sm">{report.interestSummary}</p>
                </div>
              )}
            </div>
          )}

          {/* Career Matches */}
          {careerMatches.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Matches</h2>
              <div className="space-y-4">
                {careerMatches.slice(0, 10).map((career: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{career.title || `Career ${index + 1}`}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {career.matchPercentage || career.score || 0}% match
                      </span>
                    </div>
                    {career.description && (
                      <p className="text-gray-600 text-sm mb-2">{career.description}</p>
                    )}
                    {career.skills && career.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {career.skills.slice(0, 5).map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
