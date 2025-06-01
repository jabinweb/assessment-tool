import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { InstallPrompt } from '@/components/ui/install-prompt';
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

  let user;
  
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reports: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // If user doesn't exist in database but has valid session, create them
    if (!user) {
      console.log('User not found in database, creating user:', session.user.email);
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          role: 'user',
          emailVerified: new Date()
        },
        include: {
          reports: true,
          notifications: {
            where: { isRead: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      console.log('User created successfully:', user.id);
    }
  } catch (error) {
    console.error('Database error:', error);
    
    // Create a fallback user object when database is unavailable
    user = {
      id: session.user.id || 'offline',
      email: session.user.email,
      name: session.user.name || 'User',
      role: session.user.role || 'user',
      reports: [],
      notifications: []
    };
    
    console.log('Using fallback user data due to database error');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user.name || 'Student'} 
        userRole={user.role}
        notificationCount={user.notifications?.length || 0}
      />
      <DashboardContent user={user} />
      <InstallPrompt />
    </div>
  );
}
