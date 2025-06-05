import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { sessionId, questionId, answer } = await request.json();

    if (!sessionId || !questionId || answer === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify session belongs to user
    const assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
        status: { in: ['started', 'in_progress'] }
      }
    });

    if (!assessmentSession) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    // Save or update answer
    const savedAnswer = await prisma.answer.upsert({
      where: {
        userId_questionId_version: {
          userId: user.id,
          questionId,
          version: 1
        }
      },
      update: {
        answer,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        questionId,
        answer,
        version: 1
      }
    });

    // Update session status to in_progress if it was just started
    if (assessmentSession.status === 'started') {
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: { 
          status: 'in_progress',
          lastActivityAt: new Date()
        }
      });
    } else {
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: { lastActivityAt: new Date() }
      });
    }

    return NextResponse.json({ success: true, answerId: savedAnswer.id });

  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}