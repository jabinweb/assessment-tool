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
    const industry = searchParams.get('industry')
    const targetAudience = searchParams.get('targetAudience')
    const educationLevel = searchParams.get('educationLevel')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (industry) where.industry = industry
    if (targetAudience) where.targetAudience = { has: targetAudience }
    if (educationLevel) where.educationLevel = educationLevel
    if (isActive !== null) where.isActive = isActive === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        where,
        orderBy: [
          { industry: 'asc' },
          { title: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.career.count({ where })
    ])

    return NextResponse.json({
      careers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching careers:', error)
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
    const { title, description, industry, educationLevel } = data
    if (!title || !description || !industry || !educationLevel) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, description, industry, educationLevel' 
      }, { status: 400 })
    }

    const career = await prisma.career.create({
      data: {
        title,
        description,
        riasecProfile: data.riasecProfile || {},
        requiredSkills: data.requiredSkills || {},
        educationLevel,
        salaryRange: data.salaryRange || {},
        growthOutlook: data.growthOutlook || 'stable',
        workEnvironment: data.workEnvironment || 'office',
        personalityFit: data.personalityFit || {},
        industry,
        workStyle: data.workStyle || 'independent',
        isActive: data.isActive ?? true,
        targetAudience: data.targetAudience || ['college_student'],
        entryPaths: data.entryPaths || {},
        schoolSubjects: data.schoolSubjects || [],
        collegePrograms: data.collegePrograms || [],
        internships: data.internships,
        skillDevelopment: data.skillDevelopment || {},
        realWorldExamples: data.realWorldExamples || {},
        careerProgression: data.careerProgression || {},
        alternativePaths: data.alternativePaths || {}
      }
    })

    return NextResponse.json(career)
  } catch (error) {
    console.error('Error creating career:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
