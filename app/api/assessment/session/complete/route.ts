import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();

    // Update session status
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
