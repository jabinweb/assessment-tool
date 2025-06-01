import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SettingsManager } from '@/components/admin/settings/settings-manager'

export default async function SettingsPage() {
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

  // Get current settings and statistics
  const settingsData = await getSettingsData()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure assessment parameters and system preferences</p>
      </div>

      <SettingsManager data={settingsData} />
    </div>
  )
}

async function getSettingsData() {
  const [totalQuestions, totalUsers, questionsBySection] = await Promise.all([
    prisma.question.count(),
    prisma.user.count(),
    prisma.question.groupBy({
      by: ['section'],
      _count: { id: true }
    })
  ])

  return {
    systemStats: {
      totalQuestions,
      totalUsers,
      questionsBySection
    },
    // Default settings - in a real app, these would come from a settings table
    assessmentSettings: {
      scoringWeights: {
        aptitude: 40,
        personality: 35,
        interest: 25
      },
      timeouts: {
        sessionTimeout: 30, // minutes
        assessmentTimeout: 60 // minutes
      },
      features: {
        allowRetakes: false,
        showProgressBar: true,
        randomizeQuestions: false,
        emailNotifications: true
      }
    }
  }
}
