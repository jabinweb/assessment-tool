import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AssessmentScoring } from '@/lib/scoring-algorithms';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();

    // Get all user answers with questions
    const answers = await prisma.answer.findMany({
      where: { userId },
      include: { question: true }
    });

    if (answers.length === 0) {
      return NextResponse.json({ error: 'No answers found' }, { status: 400 });
    }

    // Get all questions for proper scoring
    const questions = await prisma.question.findMany();
    
    // Get all careers for matching
    const careers = await prisma.career.findMany({
      where: { isActive: true }
    });

    // Calculate scores using the scoring algorithm
    const aptitudeAnswers = answers.filter(a => a.question.section === 'aptitude').map(a => ({
      questionId: a.questionId,
      answer: a.answer,
      timeSpent: a.timeSpent ?? undefined
    }));
    const personalityAnswers = answers.filter(a => a.question.section === 'personality').map(a => ({
      questionId: a.questionId,
      answer: a.answer,
      timeSpent: a.timeSpent ?? undefined
    }));
    const interestAnswers = answers.filter(a => a.question.section === 'interest').map(a => ({
      questionId: a.questionId,
      answer: a.answer,
      timeSpent: a.timeSpent ?? undefined
    }));

    const aptitudeQuestions = questions.filter(q => q.section === 'aptitude').map(q => ({
      id: q.id,
      section: q.section,
      subDomain: q.subDomain,
      type: q.type,
      options: q.options,
      trait: q.trait,
      riasecCode: q.riasecCode
    }));
    const personalityQuestions = questions.filter(q => q.section === 'personality').map(q => ({
      id: q.id,
      section: q.section,
      subDomain: q.subDomain,
      type: q.type,
      options: q.options,
      trait: q.trait,
      riasecCode: q.riasecCode
    }));
    const interestQuestions = questions.filter(q => q.section === 'interest').map(q => ({
      id: q.id,
      section: q.section,
      subDomain: q.subDomain,
      type: q.type,
      options: q.options,
      trait: q.trait,
      riasecCode: q.riasecCode
    }));

    const aptitudeScores = AssessmentScoring.calculateAptitudeScores(aptitudeAnswers, aptitudeQuestions);
    const personalityScores = AssessmentScoring.calculatePersonalityScores(personalityAnswers, personalityQuestions);
    const interestScores = AssessmentScoring.calculateInterestScores(interestAnswers, interestQuestions);

    // Calculate career matches
    const careerMatches = AssessmentScoring.calculateCareerMatches(
      aptitudeScores,
      personalityScores,
      interestScores,
      careers
    );

    // Generate summaries
    const personalitySummary = generatePersonalitySummary(personalityScores);
    const interestSummary = generateInterestSummary(interestScores);

    // Generate recommendations
    const recommendations = generateRecommendations(careerMatches.slice(0, 5));
    const strengths = identifyStrengths(aptitudeScores, personalityScores, interestScores);
    const developmentAreas = identifyDevelopmentAreas(aptitudeScores, personalityScores, interestScores);

    // Calculate reliability
    const reliability = AssessmentScoring.calculateReliability(
      answers.map(a => ({
        questionId: a.questionId,
        answer: a.answer,
        timeSpent: a.timeSpent ?? undefined
      })),
      questions.map(q => ({
        id: q.id,
        section: q.section,
        subDomain: q.subDomain,
        type: q.type,
        options: q.options,
        trait: q.trait,
        riasecCode: q.riasecCode
      }))
    );

    // Get the current assessment version
    const currentAssessment = await prisma.assessmentSession.findFirst({
      where: {
        userId: userId,
        status: 'in_progress'
      },
      orderBy: { startedAt: 'desc' }
    });

    const version = currentAssessment?.version || 1;

    // Mark all previous reports as not latest
    await prisma.report.updateMany({
      where: { 
        userId: userId,
        isLatest: true 
      },
      data: { isLatest: false }
    });

    // Create or update report using userId_version unique constraint
    const report = await prisma.report.upsert({
      where: { 
        userId_version: {
          userId: userId,
          version: version
        }
      },
      update: {
        aptitudeScores,
        personalityScores,
        interestScores,
        personalitySummary,
        interestSummary,
        careerMatches,
        recommendations,
        strengths,
        developmentAreas,
        reliability,
        isLatest: true
      },
      create: {
        userId: userId,
        version: version,
        isLatest: true,
        aptitudeScores,
        personalityScores,
        interestScores,
        personalitySummary,
        interestSummary,
        careerMatches,
        recommendations,
        strengths,
        developmentAreas,
        reliability
      }
    });

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error) {
    console.error('Error completing assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generatePersonalitySummary(scores: any): string {
  const traits = Object.entries(scores).map(([trait, score]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    score: score as number,
    level: (score as number) > 70 ? 'High' : (score as number) > 40 ? 'Moderate' : 'Low'
  }));

  return `Your personality profile shows ${traits.map(t => `${t.level} ${t.trait}`).join(', ')}. This combination suggests you are ${traits[0].level === 'High' ? 'highly ' + traits[0].trait.toLowerCase() : 'moderately balanced'} in your approach to life and work.`;
}

function generateInterestSummary(scores: any): string {
  const interests = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest, score]) => ({ interest: interest.charAt(0).toUpperCase() + interest.slice(1), score }));

  return `Your top interests are ${interests.map(i => i.interest).join(', ')}. This suggests you are drawn to ${interests[0].interest.toLowerCase()} activities and environments.`;
}

function generateRecommendations(topCareers: any[]): any[] {
  // If no careers or empty array, provide general recommendations
  if (!topCareers || topCareers.length === 0) {
    return [
      {
        title: 'Explore Career Assessment Results',
        description: 'Continue exploring different career paths based on your personality and interests. Consider informational interviews with professionals in fields that interest you.',
        actionItems: [
          'Review your personality and interest scores in detail',
          'Research careers that match your top interest areas',
          'Consider taking additional career exploration assessments',
          'Schedule informational interviews with professionals',
          'Explore volunteer opportunities in areas of interest'
        ]
      },
      {
        title: 'Develop Your Skills',
        description: 'Focus on building transferable skills that will benefit you in multiple career paths.',
        actionItems: [
          'Identify your strongest skill areas from the assessment',
          'Take online courses to strengthen weak areas',
          'Seek leadership opportunities in school or community',
          'Practice communication and presentation skills',
          'Build a portfolio of your achievements and projects'
        ]
      }
    ];
  }

  return topCareers.map((career, index) => ({
    title: `Pursue ${career.career || career.title || `Career Option ${index + 1}`}`,
    description: `Based on your assessment results, ${career.career || career.title || 'this career'} is ${career.matchPercentage ? `an excellent career match with ${Math.round(career.matchPercentage / 100)}% compatibility` : 'a good potential match'}. This role aligns well with your interests and personality traits.`,
    actionItems: career.nextSteps || [
      `Research current job market trends in this field`,
      `Consider pursuing relevant education if not already completed`,
      `Network with professionals working in similar environments`,
      `Look for internship or volunteer opportunities in related roles`,
      `Develop skills relevant to this career`
    ]
  }));
}

function identifyStrengths(aptitude: any, personality: any, interest: any): string[] {
  const strengths = [];
  
  // Handle both object and primitive score formats
  const aptitudeOverall = typeof aptitude.overall === 'object' ? 
    (aptitude.overall.adjusted || aptitude.overall.total || 0) : 
    (aptitude.overall || 0);
    
  const conscientiousness = typeof personality.conscientiousness === 'object' ? 
    (personality.conscientiousness.adjusted || personality.conscientiousness.total || 0) : 
    (personality.conscientiousness || 0);
    
  const extraversion = typeof personality.extraversion === 'object' ? 
    (personality.extraversion.adjusted || personality.extraversion.total || 0) : 
    (personality.extraversion || 0);
    
  const openness = typeof personality.openness === 'object' ? 
    (personality.openness.adjusted || personality.openness.total || 0) : 
    (personality.openness || 0);
    
  const agreeableness = typeof personality.agreeableness === 'object' ? 
    (personality.agreeableness.adjusted || personality.agreeableness.total || 0) : 
    (personality.agreeableness || 0);
  
  if (aptitudeOverall > 75) strengths.push('Strong analytical and problem-solving abilities');
  if (conscientiousness > 75) strengths.push('Highly organized and reliable');
  if (extraversion > 75) strengths.push('Excellent communication and leadership skills');
  if (openness > 75) strengths.push('Creative and open to new experiences');
  if (agreeableness > 75) strengths.push('Collaborative and empathetic');

  // Add interest-based strengths
  if (interest) {
    const topInterests = Object.entries(interest)
      .sort(([,a], [,b]) => {
        const scoreA = typeof a === 'object' ? (a as any).adjusted || (a as any).total || 0 : a as number;
        const scoreB = typeof b === 'object' ? (b as any).adjusted || (b as any).total || 0 : b as number;
        return scoreB - scoreA;
      })
      .slice(0, 2);
      
    topInterests.forEach(([interestType, score]) => {
      const interestScore = typeof score === 'object' ? (score as any).adjusted || (score as any).total || 0 : score as number;
      if (interestScore > 70) {
        strengths.push(`Strong interest in ${interestType} activities and environments`);
      }
    });
  }

  return strengths.length > 0 ? strengths : ['Well-rounded skill set with balanced abilities'];
}

function identifyDevelopmentAreas(aptitude: any, personality: any, interest: any): string[] {
  const areas = [];
  
  if (aptitude.overall < 50) areas.push('Consider developing analytical and logical reasoning skills');
  if (personality.conscientiousness < 50) areas.push('Work on organization and time management skills');
  if (personality.extraversion < 30) areas.push('Practice communication and networking skills');
  
  return areas.length > 0 ? areas : ['Continue building on your existing strengths'];
}