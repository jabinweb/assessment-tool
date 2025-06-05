import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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

    const body = await request.json();
    const {
      sessionId,
      scores,
      careerMatches,
      targetAudience = 'college_student',
      reportType = 'standard',
      ...additionalData
    } = body;

    // Generate summaries
    const personalitySummary = generatePersonalitySummary(scores.personality || {});
    const interestSummary = generateInterestSummary(scores.interest || {});
    const recommendations = generateRecommendations(careerMatches, targetAudience);
    const strengths = extractStrengths(scores.aptitude || {}, scores.personality || {});
    const developmentAreas = generateDevelopmentAreas(scores.aptitude || {});

    // Create or update report
    const report = await prisma.report.upsert({
      where: {
        userId_version: {
          userId: user.id,
          version: 1
        }
      },
      update: {
        aptitudeScores: scores.aptitude || {},
        personalityScores: scores.personality || {},
        interestScores: scores.interest || {},
        personalitySummary,
        interestSummary,
        careerMatches,
        recommendations,
        strengths,
        developmentAreas,
        reliability: { score: 85, factors: ['response_consistency'] },
        reportType,
        targetAudience,
        actionPlan: generateActionPlan(careerMatches, targetAudience),
        skillGaps: generateSkillGaps(scores.aptitude || {}),
        careerPathways: generateCareerPathways(careerMatches),
        parentSummary: targetAudience === 'school_student' ? 
          generateParentSummary(scores.personality || {}, careerMatches) : null,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        version: 1,
        isLatest: true,
        aptitudeScores: scores.aptitude || {},
        personalityScores: scores.personality || {},
        interestScores: scores.interest || {},
        personalitySummary,
        interestSummary,
        careerMatches,
        recommendations,
        strengths,
        developmentAreas,
        reliability: { score: 85, factors: ['response_consistency'] },
        reportType,
        targetAudience,
        actionPlan: generateActionPlan(careerMatches, targetAudience),
        skillGaps: generateSkillGaps(scores.aptitude || {}),
        careerPathways: generateCareerPathways(careerMatches),
        parentSummary: targetAudience === 'school_student' ? 
          generateParentSummary(scores.personality || {}, careerMatches) : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      reportId: report.id,
      message: 'Report saved successfully' 
    });

  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json(
      { error: 'Failed to save report' }, 
      { status: 500 }
    );
  }
}

// Helper functions
function generatePersonalitySummary(scores: Record<string, number>): string {
  const topTraits = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([trait]) => trait);
  
  return `Your personality profile shows strong ${topTraits.join(', ')} characteristics. These traits indicate your natural preferences and working style.`;
}

function generateInterestSummary(scores: Record<string, number>): string {
  const topInterests = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([interest]) => interest);
  
  return `Your interests align most strongly with ${topInterests.join(', ')} activities. These areas represent where you're likely to find satisfaction and engagement.`;
}

function generateRecommendations(careerMatches: any[], targetAudience: string): string[] {
  const topCareer = careerMatches[0];
  const recommendations = [];
  
  if (targetAudience === 'school_student') {
    recommendations.push(
      `Explore subjects related to ${topCareer?.title || 'your top career matches'}`,
      'Consider extracurricular activities that build relevant skills',
      'Talk to professionals in your field of interest'
    );
  } else {
    recommendations.push(
      `Consider exploring ${topCareer?.title || 'your top career matches'} in more detail`,
      'Build relevant skills through courses and practical experience',
      'Connect with professionals in your field of interest'
    );
  }
  
  return recommendations;
}

function extractStrengths(aptitudeScores: any, personalityScores: any): string[] {
  const strengths = [];
  
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) > 70) {
      strengths.push(`Strong ${trait} characteristics`);
    }
  }
  
  return strengths.slice(0, 5);
}

function generateDevelopmentAreas(aptitudeScores: any): string[] {
  const areas = [];
  
  for (const [aptitude, scoreData] of Object.entries(aptitudeScores)) {
    if (typeof scoreData === 'object' && scoreData && (scoreData as any).adjusted < 50) {
      areas.push(`Develop ${aptitude} skills through practice and learning`);
    }
  }
  
  return areas.slice(0, 3);
}

function generateActionPlan(careerMatches: any[], targetAudience: string): any {
  const topCareer = careerMatches[0];
  
  return {
    immediate: [`Research ${topCareer?.title || 'matched careers'} in detail`],
    next30Days: ['Update resume and LinkedIn profile', 'Identify skill gaps'],
    next90Days: ['Network with professionals', 'Consider additional training']
  };
}

function generateSkillGaps(aptitudeScores: any): any {
  const gaps = [];
  
  for (const [aptitude, scoreData] of Object.entries(aptitudeScores)) {
    if (typeof scoreData === 'object' && scoreData && (scoreData as any).adjusted < 60) {
      gaps.push({
        skill: aptitude,
        currentLevel: (scoreData as any).adjusted,
        recommendedActions: [`Practice ${aptitude} exercises`]
      });
    }
  }
  
  return gaps.slice(0, 3);
}

function generateCareerPathways(careerMatches: any[]): any {
  return careerMatches.slice(0, 3).map(career => ({
    title: career.title,
    description: career.description,
    pathway: ['Entry-level position', 'Gain experience', 'Advance to senior roles']
  }));
}

function generateParentSummary(personalityScores: any, careerMatches: any[]): string {
  const topCareer = careerMatches[0];
  return `Your child shows potential in ${topCareer?.title || 'various career areas'}. Encourage exploration of their interests while supporting their natural strengths.`;
}
