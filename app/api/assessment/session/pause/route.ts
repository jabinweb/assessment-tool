import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, currentQuestionIndex } = await request.json();

    // Update session with pause information
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'paused',
        // Store current progress in a JSON field if needed
        timeSpent: {
          increment: 0 // Keep current time
        }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error pausing session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
