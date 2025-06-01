import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { QuestionsTable } from '@/components/admin/questions/questions-table'
import { CreateQuestionButton } from '@/components/admin/questions/create-question-button'

export default async function QuestionsPage() {
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

  const questions = await prisma.question.findMany({
    orderBy: [
      { section: 'asc' },
      { order: 'asc' }
    ]
  })

  const questionStats = await prisma.question.groupBy({
    by: ['section'],
    _count: {
      id: true
    }
  })

  // Get additional stats for better overview
  const aptitudeStats = await prisma.question.groupBy({
    by: ['subDomain'],
    where: { section: 'aptitude' },
    _count: { id: true }
  })

  const personalityStats = await prisma.question.groupBy({
    by: ['trait'],
    where: { section: 'personality', trait: { not: null } },
    _count: { id: true }
  })

  const interestStats = await prisma.question.groupBy({
    by: ['riasecCode'],
    where: { section: 'interest', riasecCode: { not: null } },
    _count: { id: true }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions Management</h1>
          <p className="text-gray-600">Manage assessment questions and sections ({questions.length} total questions)</p>
        </div>
        <CreateQuestionButton />
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
          <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
        </div>
        {questionStats.map((stat) => (
          <div key={stat.section} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 capitalize">{stat.section}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat._count.id}</p>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Aptitude Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aptitude Domains</h3>
          <div className="space-y-2">
            {aptitudeStats.map((stat) => (
              <div key={stat.subDomain} className="flex justify-between">
                <span className="capitalize text-gray-600">{stat.subDomain}</span>
                <span className="font-medium">{stat._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Traits</h3>
          <div className="space-y-2">
            {personalityStats.map((stat) => (
              <div key={stat.trait} className="flex justify-between">
                <span className="capitalize text-gray-600">{stat.trait}</span>
                <span className="font-medium">{stat._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interest Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RIASEC Codes</h3>
          <div className="space-y-2">
            {interestStats.map((stat) => (
              <div key={stat.riasecCode} className="flex justify-between">
                <span className="text-gray-600">{stat.riasecCode}</span>
                <span className="font-medium">{stat._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow">
        <QuestionsTable questions={questions} />
      </div>
    </div>
  )
}
