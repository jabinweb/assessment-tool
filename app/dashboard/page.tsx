import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Career Assessment',
  description: 'Your career assessment dashboard and progress tracking',
};

export const viewport: Viewport = {
  themeColor: '#4f46e5'
};

export default async function DashboardPage() {
  const session = await auth();
  
  console.log('Dashboard session:', {
    exists: !!session,
    userExists: !!session?.user,
    email: session?.user?.email,
    name: session?.user?.name
  });

  if (!session || !session.user || !session.user.email) {
    console.log('No valid session found, redirecting to login');
    redirect('/auth/login');
  }

  // Remove the custom interfaces and use Prisma's generated types
  let user: any; // Use any for now to avoid complex Prisma typing issues
  
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            createdAt: true,
            reportType: true,
            targetAudience: true,
            aptitudeScores: true,
            personalityScores: true,
            interestScores: true
          }
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            isRead: true,
            createdAt: true
          }
        },
        assessmentSessions: {
          orderBy: { lastActivityAt: 'desc' },
          take: 1, // Only get the latest session (since userId is unique)
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            lastActivityAt: true,
            progress: true,
            timeSpent: true,
            currentSection: true,
            reportId: true,
            assessmentType: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // If user doesn't exist in database, redirect to login
    if (!user) {
      console.log('User not found in database, redirecting to login:', session.user.email);
      redirect('/auth/login');
    }

  } catch (error) {
    console.error('Database error:', error);
    
    // Create a fallback user object when database is unavailable
    user = {
      id: session.user.id || 'offline',
      email: session.user.email,
      name: session.user.name || 'User',
      role: session.user.role || 'user',
      createdAt: new Date(),
      age: null,
      gradeLevel: null,
      schoolName: null,
      educationLevel: null,
      targetAudience: null,
      assessmentProfile: null,
      counselorEmail: null,
      parentEmail: null,
      preferredLanguage: 'en',
      lastActiveAt: null,
      emailVerified: null,
      password: null,
      image: null,
      reports: [],
      notifications: [],
      assessmentSessions: []
    };
    
    console.log('Using fallback user data due to database error');
  }

  // Ensure all required data exists and is properly formatted
  const safeUser = {
    ...user,
    reports: user?.reports || [],
    notifications: user?.notifications || [],
    assessmentSessions: user?.assessmentSessions || []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={safeUser}
        notificationCount={safeUser.notifications?.length || 0}
      />
      <div className="error-boundary">
        <DashboardContent 
          user={safeUser}
        />
      </div>
    </div>
  );
}