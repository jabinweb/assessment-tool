import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { QuestionsManagement } from '@/components/admin/questions/questions-management'
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Compass,
  TrendingUp,
  Users,
  Clock,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react'

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
    include: {
      assessmentType: {
        select: {
          id: true,
          name: true,
          code: true
        }
      },
      _count: {
        select: {
          answers: true
        }
      }
    },
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

  // Additional stats for enhanced UI
  const complexityStats = await prisma.question.groupBy({
    by: ['complexity'],
    _count: { id: true }
  })

  const activeStats = {
    active: await prisma.question.count({ where: { isActive: true } }),
    inactive: await prisma.question.count({ where: { isActive: false } })
  }

  const difficultyStats = await prisma.question.groupBy({
    by: ['difficulty'],
    where: { difficulty: { not: null } },
    _count: { id: true }
  })

  const audienceStats = await prisma.$queryRaw`
    SELECT 
      unnest("targetAudience") as audience,
      COUNT(*) as count
    FROM "Question" 
    GROUP BY unnest("targetAudience")
  `

  // Transform questions to match the expected Question type
  const transformedQuestions = questions.map(question => ({
    ...question,
    subDomain: question.subDomain ?? undefined,
    trait: question.trait ?? undefined,
    riasecCode: question.riasecCode ?? undefined,
    timeLimit: question.timeLimit ?? undefined,
    difficulty: question.difficulty ?? undefined,
    assessmentType: question.assessmentType ?? undefined
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Questions Management</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Manage assessment questions and content across all sections</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{questions.length} Total Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    <span>{activeStats.active} Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                    <span>{activeStats.inactive} Inactive</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-3 lg:gap-4">
                <div className="text-center lg:text-right">
                  <div className="text-xs sm:text-sm text-gray-500">Completion Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {Math.round((activeStats.active / questions.length) * 100)}%
                  </div>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray={`${Math.round((activeStats.active / questions.length) * 100)}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {/* Section Stats with Icons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Aptitude Questions</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                  {questionStats.find(s => s.section === 'aptitude')?._count.id || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-start sm:self-auto">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{aptitudeStats.length} domains</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Personality Questions</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                  {questionStats.find(s => s.section === 'personality')?._count.id || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg self-start sm:self-auto">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{personalityStats.length} traits</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Interest Questions</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                  {questionStats.find(s => s.section === 'interest')?._count.id || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg self-start sm:self-auto">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{interestStats.length} RIASEC codes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Active Questions</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">{activeStats.active}</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg self-start sm:self-auto">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{Math.round((activeStats.active / questions.length) * 100)}% active rate</span>
            </div>
          </div>
        </div>

        {/* Enhanced Breakdown Cards - Mobile Responsive Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Aptitude Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-100">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 flex items-center">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Aptitude Domains
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                {aptitudeStats.map((stat) => (
                  <div key={stat.subDomain} className="flex justify-between items-center">
                    <span className="capitalize text-gray-600 text-xs sm:text-sm truncate flex-1 mr-2">{stat.subDomain}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-12 sm:w-16 lg:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ 
                            width: `${(stat._count.id / Math.max(...aptitudeStats.map(s => s._count.id))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 text-xs sm:text-sm min-w-[1.5rem] text-right">
                        {stat._count.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personality Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-green-100">
              <h3 className="text-base sm:text-lg font-semibold text-green-900 flex items-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Personality Traits
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                {personalityStats.map((stat) => (
                  <div key={stat.trait} className="flex justify-between items-center">
                    <span className="capitalize text-gray-600 text-xs sm:text-sm truncate flex-1 mr-2">{stat.trait}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-12 sm:w-16 lg:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-green-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ 
                            width: `${(stat._count.id / Math.max(...personalityStats.map(s => s._count.id))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 text-xs sm:text-sm min-w-[1.5rem] text-right">
                        {stat._count.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interest/RIASEC Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-purple-900 flex items-center">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                RIASEC Codes
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                {interestStats.map((stat) => (
                  <div key={stat.riasecCode} className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs sm:text-sm truncate flex-1 mr-2">{stat.riasecCode}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-12 sm:w-16 lg:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-purple-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ 
                            width: `${(stat._count.id / Math.max(...interestStats.map(s => s._count.id))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 text-xs sm:text-sm min-w-[1.5rem] text-right">
                        {stat._count.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden md:col-span-2 xl:col-span-1">
            <div className="bg-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-indigo-100">
              <h3 className="text-base sm:text-lg font-semibold text-indigo-900 flex items-center">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Question Analytics
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Complexity Distribution */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">By Complexity</h4>
                <div className="space-y-1 sm:space-y-2">
                  {complexityStats.map((stat) => (
                    <div key={stat.complexity} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="capitalize text-gray-600">{stat.complexity}</span>
                      <span className="font-medium text-gray-900">{stat._count.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">By Audience</h4>
                <div className="space-y-1 sm:space-y-2">
                  {(audienceStats as any[]).slice(0, 3).map((stat) => (
                    <div key={stat.audience} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">{stat.audience.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-900 flex-shrink-0">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Management Component */}
        <QuestionsManagement initialQuestions={transformedQuestions} />
      </div>
    </div>
  )
}
