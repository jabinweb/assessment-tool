import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile using email to ensure consistency
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        educationLevel: true,
        targetAudience: true,
        age: true,
        gradeLevel: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine user's target audience if not set
    let userTargetAudience = user?.targetAudience
    if (!userTargetAudience && user?.age) {
      if (user.age < 18) {
        userTargetAudience = 'school_student'
      } else if (user.age <= 25) {
        userTargetAudience = 'college_student'
      } else {
        userTargetAudience = 'working_professional'
      }
    }

    // Get assessment types
    const assessmentTypes = await prisma.assessmentType.findMany({
      where: {
        isActive: true,
        ...(userTargetAudience && {
          targetAudience: userTargetAudience
        })
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            questions: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    // Get user's assessment history
    const recentSessions = await prisma.assessmentSession.findMany({
      where: {
        userId: user.id,
        status: 'completed'
      },
      orderBy: { completedAt: 'desc' },
      take: 3,
      include: {
        assessmentType: {
          select: { name: true, code: true }
        }
      }
    })

    return NextResponse.json({
      assessmentTypes,
      userProfile: {
        targetAudience: userTargetAudience,
        educationLevel: user?.educationLevel,
        age: user?.age
      },
      recentAssessments: recentSessions
    })

  } catch (error) {
    console.error('Error fetching assessment types:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
