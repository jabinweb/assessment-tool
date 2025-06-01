import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { NotificationsManager } from '@/components/admin/notifications/notifications-manager'

export default async function NotificationsPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== 'admin') {
    redirect('/?error=unauthorized')
  }

  // Get notification statistics
  const stats = await getNotificationStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications Center</h1>
        <p className="text-gray-600">Send announcements and manage user communications</p>
      </div>

      <NotificationsManager stats={stats} />
    </div>
  )
}

async function getNotificationStats() {
  const totalUsers = await prisma.user.count()
  const activeUsers = await prisma.user.count({
    where: {
      answers: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }
    }
  })

  const completedUsers = await prisma.user.count({
    where: {
      reports: {
        some: {}
      }
    }
  })

  return {
    totalUsers,
    activeUsers,
    completedUsers,
    pendingUsers: totalUsers - completedUsers
  }
}
