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

  let user;
  
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

    if (!user) {
      redirect('/auth/login');
    }
  } catch (error) {
    console.error('Database error in profile page:', error);
    
    // Create fallback user object
    user = {
      id: session.user.id || 'offline',
      email: session.user.email,
      name: session.user.name || null,
      role: 'user',
      age: null,
      image: null,
      gradeLevel: null,
      schoolName: null,
      counselorEmail: null,
      parentEmail: null,
      educationLevel: null,
      targetAudience: null,
      assessmentProfile: null,
      preferredLanguage: 'en',
      createdAt: new Date(),
      lastActiveAt: null,
      notifications: []
    };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={{
          name: user.name,
          email: user.email,
          image: user.image
        }}
        title="Profile"
        notificationCount={user.notifications.length}
      />
      <ProfileForm user={user} />
    </div>
  );
}
