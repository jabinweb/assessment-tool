import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth()
    const { sessionId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { 
        id: sessionId,
        userId: session.user.id
      },
      include: {
        assessmentType: {
          include: {
            questions: {
              where: { isActive: true },
              orderBy: [{ section: 'asc' }, { order: 'asc' }]
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            age: true,
            targetAudience: true
          }
        }
      }
    })

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Assessment session not found' }, { status: 404 })
    }

    // Get answered questions
    const answeredQuestions = await prisma.answer.findMany({
      where: {
        userId: session.user.id,
        questionId: {
          in: assessmentSession.assessmentType?.questions.map(q => q.id) || []
        }
      },
      select: {
        questionId: true,
        answer: true
      }
    })

    return NextResponse.json({
      session: assessmentSession,
      answeredQuestions: answeredQuestions.reduce((acc, answer) => {
        acc[answer.questionId] = answer.answer
        return acc
      }, {} as Record<string, string>)
    })

  } catch (error) {
    console.error('Error fetching assessment session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
