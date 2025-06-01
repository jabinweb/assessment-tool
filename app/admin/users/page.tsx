import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UsersTable } from '@/components/admin/users/users-table';
import { UsersStats } from '@/components/admin/users/users-stats';

export default async function UsersPage() {
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

  // Fetch users with report information
  const users = await prisma.user.findMany({
    include: {
      reports: {
        select: {
          id: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          answers: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate statistics
  const totalUsers = users.length;
  const usersWithReports = users.filter(user => user.reports.length > 0).length;
  const usersThisMonth = users.filter(user => {
    const now = new Date();
    const userDate = new Date(user.createdAt);
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage user accounts and view assessment progress</p>
        </div>
      </div>

      {/* Stats Cards */}
      <UsersStats 
        totalUsers={totalUsers}
        usersWithReports={usersWithReports}
        usersThisMonth={usersThisMonth}
      />

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
