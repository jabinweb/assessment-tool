'use client';

import { useState } from 'react';
import { User, Report } from '@prisma/client';
import Link from 'next/link';
import { PlayCircle, FileText, Award, TrendingUp, Calendar, Users } from 'lucide-react';

interface DashboardContentProps {
  user: any;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const hasCompletedAssessment = user.reports.length > 0;
  const latestReport = user.reports[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name || 'Student'}!
        </h1>
        <p className="text-gray-600">
          Track your career discovery journey and explore new opportunities.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          href="/assessment/start"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <PlayCircle className="h-8 w-8 mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {hasCompletedAssessment ? 'Retake Assessment' : 'Start Assessment'}
          </h3>
          <p className="text-indigo-100 text-sm">
            {hasCompletedAssessment 
              ? 'Update your career profile' 
              : 'Discover your ideal career path'
            }
          </p>
        </Link>

        {hasCompletedAssessment && (
          <Link
            href={`/assessment/results/${user.id}`}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FileText className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">View Results</h3>
            <p className="text-gray-600 text-sm">
              Review your latest assessment report
            </p>
          </Link>
        )}

        <Link
          href="/profile"
          className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Users className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Profile</h3>
          <p className="text-gray-600 text-sm">
            Update your personal information
          </p>
        </Link>

        <Link
          href="/notifications"
          className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Calendar className="h-8 w-8 text-orange-600 mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Notifications</h3>
          <p className="text-gray-600 text-sm">
            Check your latest updates
          </p>
        </Link>
      </div>

      {/* Assessment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-6 w-6 text-yellow-500 mr-2" />
            Assessment Progress
          </h2>
          
          {hasCompletedAssessment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Latest Assessment:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed On:</span>
                <span className="text-gray-900">
                  {new Date(latestReport.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link
                href={`/assessment/results/${user.id}`}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full Report →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to start your journey?
              </h3>
              <p className="text-gray-600 mb-4">
                Take our comprehensive career assessment to discover your ideal career path.
              </p>
              <Link
                href="/assessment/start"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Assessment
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
            Your Stats
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Assessments:</span>
              <span className="text-gray-900 font-medium">{user.reports.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account Created:</span>
              <span className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Grade Level:</span>
              <span className="text-gray-900">{user.gradeLevel || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">School:</span>
              <span className="text-gray-900">{user.schoolName || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
