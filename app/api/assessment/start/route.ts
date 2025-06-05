import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database using email to ensure we have the correct user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { assessmentTypeId, sessionType = 'full' } = await request.json();

    if (!assessmentTypeId) {
      return NextResponse.json({ error: 'Assessment type is required' }, { status: 400 });
    }

    // Get assessment type configuration
    const assessmentType = await prisma.assessmentType.findUnique({
      where: { id: assessmentTypeId },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: [{ section: 'asc' }, { order: 'asc' }]
        }
      }
    });

    if (!assessmentType || !assessmentType.isActive) {
      return NextResponse.json({ error: 'Assessment type not found or inactive' }, { status: 404 });
    }

    // Check if user has an active session
    const activeSession = await prisma.assessmentSession.findFirst({
      where: {
        userId: user.id,
        status: { in: ['started', 'in_progress'] }
      }
    });

    if (activeSession) {
      return NextResponse.json({ 
        error: 'You have an active assessment session. Please complete or abandon it first.',
        activeSessionId: activeSession.id
      }, { status: 409 });
    }

    // Create new assessment session with proper data structure
    const newSession = await prisma.assessmentSession.create({
      data: {
        userId: user.id,
        sessionType,
        status: 'started',
        currentSection: 'aptitude',
        assessmentTypeId,
        targetAudience: assessmentType.targetAudience,
        progress: {
          aptitude: { 
            completed: 0, 
            total: assessmentType.questions.filter(q => q.section === 'aptitude').length 
          },
          personality: { 
            completed: 0, 
            total: assessmentType.questions.filter(q => q.section === 'personality').length 
          },
          interest: { 
            completed: 0, 
            total: assessmentType.questions.filter(q => q.section === 'interest').length 
          }
        },
        metadata: {
          startedFrom: 'web',
          userAgent: request.headers.get('user-agent') || 'unknown',
          assessmentConfig: assessmentType.sectionsConfig
        }
      },
      include: {
        assessmentType: {
          select: {
            id: true,
            name: true,
            code: true,
            totalDuration: true
          }
        }
      }
    });

    return NextResponse.json({
      sessionId: newSession.id,
      assessmentType: {
        id: assessmentType.id,
        name: assessmentType.name,
        code: assessmentType.code,
        totalDuration: assessmentType.totalDuration
      },
      totalQuestions: assessmentType.questions.length,
      estimatedDuration: assessmentType.totalDuration,
      currentSection: 'aptitude'
    });

  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // ...existing code...
}