import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalQuestions,
      activeQuestions,
      questionsBySection,
      questionsByComplexity,
      questionsByAssessmentType,
      questionsByTargetAudience
    ] = await Promise.all([
      prisma.question.count(),
      prisma.question.count({ where: { isActive: true } }),
      prisma.question.groupBy({
        by: ['section'],
        _count: { _all: true }
      }),
      prisma.question.groupBy({
        by: ['complexity'],
        _count: { _all: true }
      }),
      prisma.question.groupBy({
        by: ['assessmentTypeId'],
        _count: { _all: true },
        where: { assessmentTypeId: { not: null } }
      }),
      prisma.$queryRaw`
        SELECT 
          unnest("targetAudience") as audience,
          COUNT(*) as count
        FROM "Question" 
        GROUP BY unnest("targetAudience")
      `
    ])

    // Get assessment type names for the grouped data
    const assessmentTypeIds = questionsByAssessmentType.map(item => item.assessmentTypeId).filter(Boolean)
    const assessmentTypes = await prisma.assessmentType.findMany({
      where: { id: { in: assessmentTypeIds as string[] } },
      select: { id: true, name: true }
    })

    const assessmentTypeMap = assessmentTypes.reduce((acc, type) => {
      acc[type.id] = type.name
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      summary: {
        total: totalQuestions,
        active: activeQuestions,
        inactive: totalQuestions - activeQuestions
      },
      bySection: questionsBySection.map(item => ({
        section: item.section,
        count: item._count._all
      })),
      byComplexity: questionsByComplexity.map(item => ({
        complexity: item.complexity,
        count: item._count._all
      })),
      byAssessmentType: questionsByAssessmentType.map(item => ({
        assessmentTypeId: item.assessmentTypeId,
        assessmentTypeName: assessmentTypeMap[item.assessmentTypeId!] || 'Unknown',
        count: item._count._all
      })),
      byTargetAudience: questionsByTargetAudience
    })
  } catch (error) {
    console.error('Error fetching question stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
