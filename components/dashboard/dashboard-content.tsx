'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, FileText, Award, TrendingUp, Calendar, Users, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { InstallPrompt } from '@/components/ui/install-prompt';

interface DashboardContentProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date | string;
    age?: number | null;
    gradeLevel?: string | null;
    schoolName?: string | null;
    educationLevel?: string | null;
    targetAudience?: string | null;
    assessmentProfile?: string | null;
    reports: Array<{
      id: string;
      createdAt: Date | string;
      [key: string]: any;
    }>;
    notifications: any[];
    assessmentSessions?: Array<{
      id: string;
      status: string;
      reportId: string | null;
      completedAt: Date | null;
      [key: string]: any;
    }>;
  };
}

export function DashboardContent({ user }: DashboardContentProps) {
  // Since userId is unique, user can only have one session at a time
  const currentSession = user.assessmentSessions?.[0];
  
  // Check for completed assessment - either session is completed OR we have reports
  const hasCompletedAssessment = (currentSession?.status === 'completed') || user.reports.length > 0;
  const hasActiveSession = currentSession?.status === 'in_progress' || currentSession?.status === 'started';
  
  // Check if completed session has a report
  const completedSessionHasReport = currentSession?.status === 'completed' && currentSession?.reportId;
  
  const latestReport = user.reports[0];

  // For results: use session ID if completed (regardless of reportId), otherwise use report ID
  const reportLink = currentSession?.status === 'completed' 
    ? currentSession.id 
    : latestReport?.id;
    
  // For continuing: use current session if active
  const continueLink = hasActiveSession ? currentSession?.id : null;

  console.log('Dashboard Debug:', {
    hasCurrentSession: !!currentSession,
    sessionStatus: currentSession?.status,
    hasReportId: !!currentSession?.reportId,
    completedSessionHasReport,
    hasActiveSession,
    hasCompletedAssessment,
    reportLink,
    continueLink,
    totalReports: user.reports.length
  });

  // Calculate profile strength
  const calculateProfileStrength = () => {
    const fields = [
      { key: 'name', weight: 20, value: user.name },
      { key: 'age', weight: 10, value: user.age },
      { key: 'gradeLevel', weight: 15, value: user.gradeLevel },
      { key: 'schoolName', weight: 10, value: user.schoolName },
      { key: 'educationLevel', weight: 20, value: user.educationLevel },
      { key: 'targetAudience', weight: 15, value: user.targetAudience },
      { key: 'assessmentProfile', weight: 10, value: user.assessmentProfile }
    ];

    let totalScore = 0;
    let completedFields = 0;

    fields.forEach(field => {
      const value = field.value;
      const isCompleted = value && value.toString().trim() !== '';
      
      if (isCompleted) {
        totalScore += field.weight;
        completedFields++;
      }
    });

    const percentage = Math.round(totalScore);
    let level = 'Weak';
    let color = 'text-red-500';
    let bgColor = 'bg-red-50';

    if (percentage >= 80) {
      level = 'Excellent';
      color = 'text-green-500';
      bgColor = 'bg-green-50';
    } else if (percentage >= 60) {
      level = 'Good';
      color = 'text-blue-500';
      bgColor = 'bg-blue-50';
    } else if (percentage >= 40) {
      level = 'Fair';
      color = 'text-yellow-500';
      bgColor = 'bg-yellow-50';
    }

    return {
      percentage,
      level,
      color,
      bgColor,
      completedFields,
      totalFields: fields.length
    };
  };

  const profileStrength = calculateProfileStrength();

  return (
    <>
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

        {/* Profile Strength Banner - Only show if not 100% complete */}
        {profileStrength.percentage < 100 && (
          <div className={`mb-8 p-6 rounded-xl border-2 ${profileStrength.bgColor} border-opacity-20`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${profileStrength.bgColor}`}>
                  <User className={`h-6 w-6 ${profileStrength.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Strength</h3>
                  <p className="text-gray-600 text-sm">Complete your profile for better recommendations</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${profileStrength.color} mb-1`}>
                  {profileStrength.percentage}%
                </div>
                <div className={`text-sm font-medium ${profileStrength.color}`}>
                  {profileStrength.level}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Profile Completion</span>
                <span>{profileStrength.completedFields} of {profileStrength.totalFields} fields</span>
              </div>
              <Progress value={profileStrength.percentage} className="h-3" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-600">
                    {profileStrength.percentage < 60 
                      ? "Complete more fields to improve career matching"
                      : "Add remaining details for better assessment experience"
                    }
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Update Profile →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Primary Action - Continue/Start/Retake Assessment */}
          {hasActiveSession ? (
            <Link
              href={`/assessment/${continueLink}/continue`}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <PlayCircle className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Continue Assessment</h3>
              <p className="text-orange-100 text-sm">
                Complete your ongoing assessment
              </p>
            </Link>
          ) : (
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
          )}

          {/* View Results - Show if assessment is completed (even without reportId) */}
          {hasCompletedAssessment && reportLink && !hasActiveSession && (
            <Link
              href={`/assessment/${reportLink}/report`}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <FileText className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">View Results</h3>
              <p className="text-gray-600 text-sm">
                {completedSessionHasReport 
                  ? "Review your latest assessment report"
                  : "Generate your assessment report"
                }
              </p>
            </Link>
          )}

          <Link
            href="/profile"
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all relative"
          >
            <Users className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Profile</h3>
            <p className="text-gray-600 text-sm">
              Update your personal information
            </p>
            {profileStrength.percentage === 100 ? (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            ) : profileStrength.percentage < 80 ? (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            ) : null}
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

        {/* Assessment Status & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assessment Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-6 w-6 text-yellow-500 mr-2" />
              Assessment Progress
            </h2>
            
            {hasActiveSession ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Status:</span>
                  <span className="text-orange-600 font-medium">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Activity:</span>
                  <span className="text-gray-900">
                    {currentSession?.lastActivityAt 
                      ? new Date(currentSession.lastActivityAt).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </div>
                <Link
                  href={`/assessment/${continueLink}/continue`}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  Continue Assessment →
                </Link>
              </div>
            ) : hasCompletedAssessment ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Latest Assessment:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed On:</span>
                  <span className="text-gray-900">
                    {currentSession?.completedAt 
                      ? new Date(currentSession.completedAt).toLocaleDateString()
                      : latestReport 
                        ? new Date(latestReport.createdAt).toLocaleDateString()
                        : 'Unknown'
                    }
                  </span>
                </div>
                {!completedSessionHasReport && currentSession?.status === 'completed' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Report Generation Pending:</strong> Your assessment is complete. Click "View Results" to generate your report.
                    </p>
                  </div>
                )}
                {reportLink && (
                  <Link
                    href={`/assessment/${reportLink}/report`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {completedSessionHasReport ? 'View Full Report →' : 'Generate Report →'}
                  </Link>
                )}
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

          {/* Your Stats with Profile Strength */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              Your Stats
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Strength:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${profileStrength.color}`}>
                    {profileStrength.level}
                  </span>
                  <span className="text-gray-500">({profileStrength.percentage}%)</span>
                  {profileStrength.percentage === 100 && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Assessments:</span>
                <span className="text-gray-900 font-medium">
                  {user.reports.length}
                </span>
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

            {profileStrength.percentage < 60 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Tip:</strong> Complete your profile to get more accurate career recommendations and better assessment results.
                </p>
              </div>
            )}

            {profileStrength.percentage === 100 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  <strong>Excellent!</strong> Your profile is complete and optimized for the most accurate career recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <InstallPrompt />
    </>
  );
}
