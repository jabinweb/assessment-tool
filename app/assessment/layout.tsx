import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessment - Career Assessment Tool',
  description: 'Take your comprehensive career assessment',
};

export default async function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  let user;
  let fallbackUser = {
    name: session.user.name || 'User',
    role: 'user',
    notifications: []
  };

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          role: 'user',
          emailVerified: new Date()
        },
        include: {
          notifications: {
            where: { isRead: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }
  } catch (error) {
    console.error('Database error in assessment layout:', error);
    user = fallbackUser;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user.name || 'Student'} 
        userRole={user.role}
        notificationCount={user.notifications?.length || 0}
      />
      <main>
        {children}
      </main>
    </div>
  );
}
