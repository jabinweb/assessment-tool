import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProfileForm } from '@/components/profile/profile-form';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings - Career Assessment',
  description: 'Manage your personal information and account preferences',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5'
};

export default async function ProfilePage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user.name || 'Student'} 
        userRole={user.role}
        notificationCount={user.notifications.length}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information and account preferences.
            </p>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
