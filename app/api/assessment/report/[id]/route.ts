import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const report = await prisma.report.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            age: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Format the report with parsed JSON
    const formattedReport = {
      id: report.id,
      createdAt: report.createdAt,
      user: report.user,
      aptitudeScores: JSON.parse(report.aptitudeScores as string),
      personalityScores: JSON.parse(report.personalityScores as string),
      interestScores: JSON.parse(report.interestScores as string),
      personalitySummary: report.personalitySummary,
      interestSummary: report.interestSummary,
      careerMatches: JSON.parse(report.careerMatches as string),
      pdfUrl: report.pdfUrl
    };

    return NextResponse.json({ report: formattedReport });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
