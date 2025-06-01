import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ResultsContent } from '@/components/results/results-content';
import { AssessmentHistoryDropdown } from '@/components/results/assessment-history-dropdown';
import { RefreshCw, Download } from 'lucide-react';
import Link from 'next/link';

export default async function ResultsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect('/auth/login');
  }

  // Get the latest report and assessment history
  const latestReport = await prisma.report.findFirst({
    where: { 
      userId: user.id,
      isLatest: true 
    }
  });

  const assessmentHistory = await prisma.report.findMany({
    where: { userId: user.id },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      createdAt: true,
      isLatest: true
    }
  });

  if (!latestReport) {
    redirect('/assessment/start');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user.name || 'Student'} 
        userRole={user.role}
        notificationCount={user.notifications.length}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with retake option and history */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
            <p className="text-gray-600 mt-2">
              Your comprehensive career assessment report 
              {assessmentHistory.length > 1 && (
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Version {latestReport.version}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex space-x-4">
            {assessmentHistory.length > 1 && (
              <AssessmentHistoryDropdown 
                history={assessmentHistory.map(report => ({
                  ...report,
                  createdAt: report.createdAt.toISOString()
                }))} 
                currentVersion={latestReport.version} 
              />
            )}
            
            <Link
              href="/assessment/start"
              className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Link>
            
            {latestReport.pdfUrl && (
              <a
                href={latestReport.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            )}
          </div>
        </div>

        {/* Assessment History Timeline */}
        {assessmentHistory.length > 1 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>
            <div className="space-y-3">
              {assessmentHistory.map((report) => (
                <div key={report.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      report.isLatest ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm text-gray-900">
                      Version {report.version} - {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {report.isLatest && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  {!report.isLatest && (
                    <Link
                      href={`/results/${report.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Results Content */}
        <ResultsContent report={latestReport} />
      </div>
    </div>
  );
}
