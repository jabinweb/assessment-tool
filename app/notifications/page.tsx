import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { NotificationsList } from '@/components/notifications/notifications-list';
import { NotificationStats } from '@/components/notifications/notification-stats';
import { NotificationFilters } from '@/components/notifications/notification-filters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Settings } from 'lucide-react';

interface NotificationsPageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    priority?: string;
  }>;
}

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const session = await auth();
  const params = await searchParams;
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Build filter conditions
  const whereConditions: any = {
    userId: user.id,
    OR: [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } }
    ]
  };

  if (params.type && params.type !== 'all') {
    whereConditions.type = params.type;
  }

  if (params.status === 'read') {
    whereConditions.isRead = true;
  } else if (params.status === 'unread') {
    whereConditions.isRead = false;
  }

  if (params.priority && params.priority !== 'all') {
    whereConditions.priority = params.priority;
  }

  // Get notifications with filtering
  const notifications = await prisma.notification.findMany({
    where: whereConditions,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 50 // Limit to recent 50 notifications
  });

  // Get notification statistics
  const stats = await prisma.notification.aggregate({
    where: { userId: user.id },
    _count: {
      id: true
    }
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
  });

  const priorityStats = await prisma.notification.groupBy({
    by: ['priority'],
    where: {
      userId: user.id,
      isRead: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    _count: {
      id: true
    }
  });

  const typeStats = await prisma.notification.groupBy({
    by: ['type'],
    where: {
      userId: user.id,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    _count: {
      id: true
    }
  });

  const notificationStats = {
    total: stats._count.id,
    unread: unreadCount,
    byPriority: priorityStats.reduce((acc, item) => {
      acc[item.priority] = item._count.id;
      return acc;
    }, {} as Record<string, number>),
    byType: typeStats.reduce((acc, item) => {
      acc[item.type] = item._count.id;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader 
        user={user}
        title="Notifications"
        showSearch={true}
        notificationCount={unreadCount}
      />

      {/* Page Description Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">
                  Stay updated with your assessment progress and recommendations
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Stats and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <NotificationStats stats={notificationStats} />
            <NotificationFilters 
              currentFilters={{
                type: params.type || 'all',
                status: params.status || 'all',
                priority: params.priority || 'all'
              }}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {notifications.length > 0 ? (
              <NotificationsList 
                notifications={notifications}
                userId={user.id}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {params.type || params.status || params.priority ? 
                      'Try adjusting your filters to see more notifications.' :
                      'You\'re all caught up! New notifications will appear here.'
                    }
                  </p>
                  {(params.type || params.status || params.priority) && (
                    <a 
                      href="/notifications"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
