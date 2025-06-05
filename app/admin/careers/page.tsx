import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CareersManagement } from '@/components/admin/careers/careers-management';

export default async function CareersPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  const careers = await prisma.career.findMany({
    orderBy: [
      { industry: 'asc' },
      { title: 'asc' }
    ]
  });

  const careerStats = await prisma.career.groupBy({
    by: ['industry'],
    _count: {
      id: true
    }
  });

  const educationStats = await prisma.career.groupBy({
    by: ['educationLevel'],
    _count: { id: true }
  });

  const audienceStats = await prisma.$queryRaw`
    SELECT 
      unnest("targetAudience") as audience,
      COUNT(*) as count
    FROM "Career" 
    GROUP BY unnest("targetAudience")
  `;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
          <p className="text-gray-600">Manage career database and opportunities ({careers.length} total careers)</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Careers</h3>
          <p className="text-3xl font-bold text-gray-900">{careers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Careers</h3>
          <p className="text-3xl font-bold text-gray-900">{careers.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Industries</h3>
          <p className="text-3xl font-bold text-gray-900">{careerStats.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Education Levels</h3>
          <p className="text-3xl font-bold text-gray-900">{educationStats.length}</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Industry Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Industry</h3>
          <div className="space-y-2">
            {careerStats.map((stat) => (
              <div key={stat.industry} className="flex justify-between">
                <span className="capitalize text-gray-600">{stat.industry.replace('_', ' ')}</span>
                <span className="font-medium">{stat._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education Level Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Education Level</h3>
          <div className="space-y-2">
            {educationStats.map((stat) => (
              <div key={stat.educationLevel} className="flex justify-between">
                <span className="capitalize text-gray-600">{stat.educationLevel}</span>
                <span className="font-medium">{stat._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Target Audience</h3>
          <div className="space-y-2">
            {(audienceStats as any[]).map((stat) => (
              <div key={stat.audience} className="flex justify-between">
                <span className="text-gray-600">{stat.audience.replace('_', ' ')}</span>
                <span className="font-medium">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Careers Management Component */}
      <CareersManagement initialCareers={careers} />
    </div>
  );
}
