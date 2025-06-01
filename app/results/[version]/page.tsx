import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ResultsContent } from '@/components/results/results-content';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface VersionPageProps {
  params: {
    version: string;
  };
}

export default async function VersionPage({ params }: VersionPageProps) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const version = parseInt(params.version);
  
  // Get the specific version report
  const report = await prisma.report.findUnique({
    where: { 
      userId_version: {
        userId: user.id,
        version: version
      }
    },
    include: { user: true }
  });

  if (!report) {
    redirect('/results');
  }

  // Get all versions for comparison
  const allVersions = await prisma.report.findMany({
    where: { userId: user.id },
    select: {
      version: true,
      createdAt: true,
      isLatest: true
    },
    orderBy: { version: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/results"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Latest
              </Link>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-semibold">Assessment Version {version}</span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Version Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Compare with:</span>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/results/${e.target.value}`;
                  }
                }}
                defaultValue={version.toString()}
              >
                {allVersions.map((v) => (
                  <option key={v.version} value={v.version}>
                    Version {v.version} {v.isLatest ? '(Latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Historical Notice */}
          {!report.isLatest && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-800">
                    You are viewing a historical assessment from {new Date(report.createdAt).toLocaleDateString()}.
                    <Link href="/results" className="font-medium underline ml-2">
                      View your latest results
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Content */}
        <ResultsContent report={report} isHistorical={!report.isLatest} />
      </div>
    </div>
  );
}
