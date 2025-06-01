import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ReportsTable } from '@/components/admin/reports/reports-table'
import { ReportsStats } from '@/components/admin/reports/reports-stats'

export default async function ReportsPage() {
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

  // Fetch reports with user information
  const reports = await prisma.report.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Calculate statistics
  const totalReports = reports.length
  const reportsThisMonth = reports.filter(report => {
    const now = new Date()
    const reportDate = new Date(report.createdAt)
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
  }).length

  const averageCompletionTime = await calculateAverageCompletionTime()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600">View and analyze user assessment reports</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ReportsStats 
        totalReports={totalReports}
        reportsThisMonth={reportsThisMonth}
        averageCompletionTime={averageCompletionTime}
      />

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow">
        <ReportsTable reports={reports} />
      </div>
    </div>
  )
}

async function calculateAverageCompletionTime() {
  // Calculate average time between user creation and report generation
  const reportsWithTime = await prisma.report.findMany({
    include: {
      user: {
        select: {
          createdAt: true
        }
      }
    }
  })

  if (reportsWithTime.length === 0) return 0

  const totalMinutes = reportsWithTime.reduce((acc, report) => {
    const userCreated = new Date(report.user.createdAt)
    const reportCreated = new Date(report.createdAt)
    const diffMinutes = (reportCreated.getTime() - userCreated.getTime()) / (1000 * 60)
    return acc + diffMinutes
  }, 0)

  return Math.round(totalMinutes / reportsWithTime.length)
}
