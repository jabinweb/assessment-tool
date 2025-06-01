import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CareersManagement } from '@/components/admin/careers-management';

export default async function AdminCareersPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const careers = await prisma.career.findMany({
    orderBy: [
      { industry: 'asc' },
      { title: 'asc' }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Career Management</h1>
            <p className="text-gray-600 mt-1">
              Manage career profiles and matching criteria.
            </p>
          </div>
          <CareersManagement careers={careers} />
        </div>
      </div>
    </div>
  );
}
