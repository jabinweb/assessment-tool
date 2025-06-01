import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=user_not_found', request.url));
    }

    // Get the latest report version to determine next version number
    const latestReport = await prisma.report.findFirst({
      where: { userId: user.id },
      orderBy: { version: 'desc' }
    });

    const nextVersion = latestReport ? latestReport.version + 1 : 1;

    // Mark all previous reports as not latest
    if (latestReport) {
      await prisma.report.updateMany({
        where: { 
          userId: user.id,
          isLatest: true 
        },
        data: { isLatest: false }
      });
    }

    // Close any existing assessment sessions
    await prisma.assessmentSession.updateMany({
      where: {
        userId: user.id,
        status: 'in_progress'
      },
      data: {
        status: 'abandoned'
      }
    });

    // Check if the user already has an active assessment session
    const existingSession = await prisma.assessmentSession.findFirst({
      where: {
        userId: user.id,
        status: 'in_progress'
      }
    });

    if (existingSession) {
      return NextResponse.redirect(new URL(`/assessment/section/${existingSession.section}`, request.url));
    }

    // Create a new assessment session with new version
    const newSession = await prisma.assessmentSession.create({
      data: {
        userId: user.id,
        section: 'aptitude',
        status: 'in_progress',
        version: nextVersion,
        totalQuestions: 60,
      }
    });

    return NextResponse.redirect(new URL(`/assessment/section/aptitude`, request.url));

  } catch (error) {
    console.error('Assessment start error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=system_error', request.url));
  }
}

export async function GET(request: NextRequest) {
  // ...existing code...
}