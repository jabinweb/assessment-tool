import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { sessionId, currentSection, status } = await request.json()

    if (!sessionId || !currentSection) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify session belongs to user
    const assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id
      }
    })

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session
    const updatedSession = await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        currentSection,
        status: status || 'in_progress',
        lastActivityAt: new Date()
      }
    })

    return NextResponse.json({ success: true, session: updatedSession })

  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
