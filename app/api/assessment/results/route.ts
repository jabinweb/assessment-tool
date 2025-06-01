import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user and report data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        age: true,
        email: true
      }
    });

    const report = await prisma.report.findUnique({
      where: { userId }
    });

    if (!user || !report) {
      return NextResponse.json({ error: 'Results not found' }, { status: 404 });
    }

    return NextResponse.json({
      user,
      report: {
        id: report.id,
        aptitudeScores: report.aptitudeScores,
        personalityScores: report.personalityScores,
        interestScores: report.interestScores,
        personalitySummary: report.personalitySummary,
        interestSummary: report.interestSummary,
        careerMatches: report.careerMatches,
        recommendations: report.recommendations,
        strengths: report.strengths,
        developmentAreas: report.developmentAreas,
        pdfUrl: report.pdfUrl
      }
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}