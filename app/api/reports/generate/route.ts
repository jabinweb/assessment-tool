import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, assessmentData } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if report already exists for this user
    const existingReport = await prisma.report.findFirst({
      where: {
        userId: user.id,
        isLatest: true
      }
    });

    if (existingReport) {
      return NextResponse.json({ 
        reportId: existingReport.id,
        message: 'Report already exists' 
      });
    }

    // Generate mock analysis results based on assessment data
    const mockResults = generateMockResults(assessmentData);

    // Create new report
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        version: 1,
        isLatest: true,
        aptitudeScores: mockResults.aptitudeScores,
        personalityScores: mockResults.personalityScores,
        interestScores: mockResults.interestScores,
        personalitySummary: mockResults.personalitySummary,
        interestSummary: mockResults.interestSummary,
        careerMatches: mockResults.careerMatches,
        recommendations: mockResults.recommendations,
        strengths: mockResults.strengths,
        developmentAreas: mockResults.developmentAreas,
        reliability: mockResults.reliability,
        reportType: 'standard',
        targetAudience: assessmentData.targetAudience || 'college_student'
      }
    });

    return NextResponse.json({ 
      reportId: report.id,
      message: 'Report generated successfully' 
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMockResults(assessmentData: any) {
  // Generate realistic mock results based on assessment data
  return {
    aptitudeScores: {
      overall: 78,
      numerical: 82,
      verbal: 75,
      logical: 80,
      spatial: 76
    },
    personalityScores: {
      openness: 85,
      conscientiousness: 78,
      extraversion: 72,
      agreeableness: 88,
      neuroticism: 35
    },
    interestScores: {
      realistic: 45,
      investigative: 92,
      artistic: 68,
      social: 85,
      enterprising: 55,
      conventional: 42
    },
    personalitySummary: "You demonstrate strong analytical thinking with excellent collaborative skills.",
    interestSummary: "Your interests align strongly with investigative and social career areas.",
    careerMatches: [
      "Software Engineer",
      "Data Scientist", 
      "UX Designer",
      "Product Manager",
      "Research Scientist"
    ],
    recommendations: [
      "Develop programming skills in Python or JavaScript",
      "Consider pursuing data science certifications",
      "Build a portfolio of technical projects",
      "Network with professionals in tech industry"
    ],
    strengths: [
      "Strong analytical thinking",
      "Excellent problem-solving skills", 
      "Good communication abilities",
      "Detail-oriented approach",
      "Creative thinking"
    ],
    developmentAreas: [
      "Leadership skills",
      "Public speaking",
      "Time management", 
      "Networking abilities"
    ],
    reliability: {
      score: 0.85,
      confidence: "high"
    }
  };
}
