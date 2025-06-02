import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ResultsContent } from '@/components/results/results-content';
import { Clock, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ResultsPageProps {
  searchParams: Promise<{
    version?: string;
    user?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      notifications: {
        where: { isRead: false }
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Await searchParams before using
  const params = await searchParams;
  
  // Determine which user's results to show (for admin users)
  const targetUserId = params.user && user.role === 'admin' ? params.user : user.id;
  const requestedVersion = params.version ? parseInt(params.version) : null;

  // Get all reports for the target user
  const allReports = await prisma.report.findMany({
    where: { userId: targetUserId },
    include: { user: true },
    orderBy: { version: 'desc' }
  });

  if (allReports.length === 0) {
    redirect('/assessment/start');
  }

  // Find the report to display
  let reportToShow;
  if (requestedVersion) {
    reportToShow = allReports.find(report => report.version === requestedVersion);
    if (!reportToShow) {
      redirect('/results'); // Redirect to latest if version not found
    }
  } else {
    reportToShow = allReports.find(report => report.isLatest) || allReports[0];
  }

  const isViewingOtherUser = targetUserId !== user.id;
  const isHistorical = !reportToShow.isLatest;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user.name || 'Student'} 
        userRole={user.role}
        notificationCount={user.notifications?.length || 0}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Version History & Navigation */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="h-6 w-6 text-indigo-600 mr-3" />
                {isViewingOtherUser ? `${reportToShow.user.name}'s Results` : 'Your Assessment Results'}
              </h2>
              
              {allReports.length > 1 && (
                <p className="text-gray-600 mb-4">
                  Viewing version {reportToShow.version} of {allReports.length} assessments
                  {isHistorical && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Historical
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Version Selector */}
            {allReports.length > 1 && (
              <div className="flex items-center gap-3">
                <label htmlFor="version-select" className="text-sm font-medium text-gray-700">
                  Select Version:
                </label>
                <select 
                  id="version-select"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  value={reportToShow.version}
                  onChange={(e) => {
                    const version = e.target.value;
                    const params = new URLSearchParams();
                    if (version !== allReports.find(r => r.isLatest)?.version.toString()) {
                      params.set('version', version);
                    }
                    if (isViewingOtherUser) {
                      params.set('user', targetUserId);
                    }
                    const queryString = params.toString();
                    window.location.href = `/results${queryString ? `?${queryString}` : ''}`;
                  }}
                >
                  {allReports.map((report) => (
                    <option key={report.version} value={report.version}>
                      Version {report.version} - {new Date(report.createdAt).toLocaleDateString()}
                      {report.isLatest ? ' (Latest)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Assessment Timeline */}
          {allReports.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                Assessment Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allReports.map((report, index) => {
                  const isCurrentVersion = report.version === reportToShow.version;
                  const recommendations = typeof report.recommendations === 'string' 
                    ? JSON.parse(report.recommendations) 
                    : report.recommendations || [];
                  
                  return (
                    <Link
                      key={report.id}
                      href={`/results${report.isLatest ? '' : `?version=${report.version}`}${isViewingOtherUser ? `${report.isLatest ? '?' : '&'}user=${targetUserId}` : ''}`}
                      className={`block p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        isCurrentVersion
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          Version {report.version}
                        </span>
                        {report.isLatest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Latest
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{recommendations.length} career matches</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {!reportToShow.isLatest && (
                <Link
                  href={`/results${isViewingOtherUser ? `?user=${targetUserId}` : ''}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Latest Results
                </Link>
              )}
              
              {!isViewingOtherUser && (
                <Link
                  href="/assessment/start"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Take New Assessment
                </Link>
              )}
              
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <ResultsContent report={reportToShow} isHistorical={isHistorical} />
      </div>
    </div>
  );
}
