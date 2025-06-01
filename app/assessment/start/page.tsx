import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AssessmentStartClient } from '@/components/assessment/assessment-start-client';
import { prisma } from '@/lib/prisma';
import { AlertTriangle } from 'lucide-react';

export default async function AssessmentStartPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  let user;
  let existingReport = null;
  let databaseError = false;

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      // Try to create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          role: 'user',
          emailVerified: new Date()
        }
      });
    }

    // Check for existing report
    existingReport = await prisma.report.findFirst({
      where: { userId: user.id }
    });

  } catch (error) {
    console.error('Database error:', error);
    databaseError = true;
  }

  if (databaseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Service Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-6">
            We're experiencing technical difficulties. Please try again in a few minutes.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/demo"
              className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Try Demo Instead
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <AssessmentStartClient 
          user={user!}
          existingReport={existingReport}
        />
    </div>
  );
}