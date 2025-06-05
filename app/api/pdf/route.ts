import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Get the report by ID
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { user: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Verify user owns this report
    if (report.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Helper function to safely parse JSON and ensure array of strings
    const parseJsonToStringArray = (jsonValue: any): string[] => {
      if (!jsonValue) return [];
      
      try {
        const parsed = typeof jsonValue === 'string' ? JSON.parse(jsonValue) : jsonValue;
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item)).filter(item => item !== 'null' && item !== 'undefined');
        }
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.values(parsed).map(item => String(item)).filter(item => item !== 'null' && item !== 'undefined');
        }
        return [String(parsed)];
      } catch (error) {
        console.error('Error parsing JSON to string array:', error);
        return [];
      }
    };

    // Helper function to safely parse JSON objects
    const parseJsonToObject = (jsonValue: any): any => {
      if (!jsonValue) return {};
      
      try {
        return typeof jsonValue === 'string' ? JSON.parse(jsonValue) : jsonValue;
      } catch (error) {
        console.error('Error parsing JSON to object:', error);
        return {};
      }
    };

    // Transform Prisma report to ReportData format for client
    const reportData = {
      id: report.id,
      userId: report.userId,
      version: report.version,
      isLatest: report.isLatest,
      aptitudeScores: parseJsonToObject(report.aptitudeScores),
      personalityScores: parseJsonToObject(report.personalityScores),
      interestScores: parseJsonToObject(report.interestScores),
      personalitySummary: report.personalitySummary,
      interestSummary: report.interestSummary,
      careerMatches: parseJsonToStringArray(report.careerMatches),
      recommendations: parseJsonToStringArray(report.recommendations),
      strengths: parseJsonToStringArray(report.strengths),
      developmentAreas: parseJsonToStringArray(report.developmentAreas),
      reliability: parseJsonToObject(report.reliability),
      pdfUrl: report.pdfUrl,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      reportType: report.reportType,
      targetAudience: report.targetAudience,
      visualElements: parseJsonToObject(report.visualElements),
      parentSummary: report.parentSummary,
      counselorNotes: parseJsonToObject(report.counselorNotes),
      actionPlan: parseJsonToObject(report.actionPlan),
      skillGaps: parseJsonToObject(report.skillGaps),
      careerPathways: parseJsonToObject(report.careerPathways),
      overallScore: calculateOverallScore(report),
      completedAt: report.createdAt,
      analysisResults: {
        aptitudeScores: parseJsonToObject(report.aptitudeScores),
        personalityScores: parseJsonToObject(report.personalityScores),
        interestScores: parseJsonToObject(report.interestScores),
        careerMatches: parseJsonToStringArray(report.careerMatches),
        strengths: parseJsonToStringArray(report.strengths),
        developmentAreas: parseJsonToStringArray(report.developmentAreas),
        recommendations: parseJsonToStringArray(report.recommendations)
      },
      user: {
        id: report.user.id,
        name: report.user.name ?? undefined,
        age: report.user.age ?? undefined,
        email: report.user.email,
        emailVerified: report.user.emailVerified ?? undefined,
        password: report.user.password ?? undefined,
        image: report.user.image ?? undefined,
        role: report.user.role,
        createdAt: report.user.createdAt,
        lastActiveAt: report.user.lastActiveAt ?? undefined,
        preferredLanguage: report.user.preferredLanguage ?? undefined,
        gradeLevel: report.user.gradeLevel ?? undefined,
        schoolName: report.user.schoolName ?? undefined,
        counselorEmail: report.user.counselorEmail ?? undefined,
        parentEmail: report.user.parentEmail ?? undefined,
        educationLevel: report.user.educationLevel ?? undefined,
        targetAudience: report.user.targetAudience ?? undefined,
        assessmentProfile: report.user.assessmentProfile ?? undefined
      }
    };

    // Return the report data to client for PDF generation
    return NextResponse.json({ 
      success: true,
      reportData,
      userName: report.user.name || 'Student'
    });

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate overall score from individual scores
function calculateOverallScore(report: any): number {
  try {
    const aptitudeScores = typeof report.aptitudeScores === 'string' 
      ? JSON.parse(report.aptitudeScores) 
      : report.aptitudeScores;
    
    const personalityScores = typeof report.personalityScores === 'string' 
      ? JSON.parse(report.personalityScores) 
      : report.personalityScores;
    
    const interestScores = typeof report.interestScores === 'string' 
      ? JSON.parse(report.interestScores) 
      : report.interestScores;

    // Calculate average from available scores
    const scores = [];
    
    if (aptitudeScores?.overall || aptitudeScores?.total) {
      scores.push(aptitudeScores.overall || aptitudeScores.total);
    }
    
    if (personalityScores?.overall || personalityScores?.total) {
      scores.push(personalityScores.overall || personalityScores.total);
    }
    
    if (interestScores?.overall || interestScores?.total) {
      scores.push(interestScores.overall || interestScores.total);
    }

    return scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 75; // Default score if no scores available
      
  } catch (error) {
    console.error('Error calculating overall score:', error);
    return 75; // Default fallback score
  }
}
