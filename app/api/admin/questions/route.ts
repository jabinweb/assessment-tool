import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const section = searchParams.get('section')
    const assessmentTypeId = searchParams.get('assessmentTypeId')
    const targetAudience = searchParams.get('targetAudience')
    const complexity = searchParams.get('complexity')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    
    if (section) where.section = section
    if (assessmentTypeId) where.assessmentTypeId = assessmentTypeId
    if (targetAudience) where.targetAudience = { has: targetAudience }
    if (complexity) where.complexity = complexity
    if (isActive !== null) where.isActive = isActive === 'true'

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
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
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.question.count({ where })
    ])

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    const { section, type, text, options, order } = data
    if (!section || !type || !text || !options || order === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: section, type, text, options, order' 
      }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        section,
        subDomain: data.subDomain,
        type,
        text,
        options: data.options,
        order,
        timeLimit: data.timeLimit,
        difficulty: data.difficulty,
        trait: data.trait,
        riasecCode: data.riasecCode,
        targetAudience: data.targetAudience || ['college_student'],
        ageGroup: data.ageGroup || ['18-22'],
        educationLevel: data.educationLevel || ['college'],
        complexity: data.complexity || 'basic',
        visualAid: data.visualAid,
        schoolFriendlyText: data.schoolFriendlyText,
        examples: data.examples,
        isActive: data.isActive ?? true,
        questionGroup: data.questionGroup,
        prerequisites: data.prerequisites || [],
        assessmentTypeId: data.assessmentTypeId
      },
      include: {
        assessmentType: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
