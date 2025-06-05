import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AssessmentTypeReport } from '@/components/report/assessment-type-report';
import { AssessmentScoring } from '@/lib/scoring-algorithms';
import { SchoolStudentReport } from '@/components/report/school-student-report';
import { CollegeStudentReport } from '@/components/report/college-student-report';

export default async function AssessmentReportPage({ 
  params 
}: { 
  params: Promise<{ sessionId: string }> 
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/auth/login');
  }

  // Await params before accessing sessionId
  const { sessionId } = await params;

  // Get the assessment session with all related data
  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { 
      id: sessionId,
      userId: user.id 
    },
    include: {
      assessmentType: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          gradeLevel: true,
          schoolName: true,
          targetAudience: true
        }
      }
    }
  });

  if (!assessmentSession) {
    redirect('/dashboard?error=session-not-found');
  }

  // If session is not completed, redirect to continue the assessment
  if (assessmentSession.status !== 'completed') {
    redirect(`/assessment/${sessionId}/continue`);
  }

  // Get all answers for this assessment session
  const answers = await prisma.answer.findMany({
    where: { 
      userId: user.id,
      version: assessmentSession.version || 1
    },
    include: {
      question: {
        include: {
          assessmentType: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Filter answers for the current assessment type
  const currentAssessmentAnswers = answers.filter(answer => 
    answer.question.assessmentTypeId === assessmentSession.assessmentTypeId
  );

  if (currentAssessmentAnswers.length === 0) {
    redirect('/dashboard?error=no-assessment-data');
  }

  // Get questions for this assessment type
  const questions = await prisma.question.findMany({
    where: {
      assessmentTypeId: assessmentSession.assessmentTypeId,
      isActive: true
    },
    orderBy: { order: 'asc' }
  });

  // Get careers relevant to this assessment type
  const careers = await prisma.career.findMany({
    where: {
      targetAudience: {
        has: assessmentSession.assessmentType?.targetAudience
      },
      isActive: true
    }
  });

  // Calculate scores using real data
  const aptitudeAnswers = currentAssessmentAnswers.filter(a => a.question.section === 'aptitude');
  const personalityAnswers = currentAssessmentAnswers.filter(a => a.question.section === 'personality');
  const interestAnswers = currentAssessmentAnswers.filter(a => a.question.section === 'interest');

  const aptitudeQuestions = questions.filter(q => q.section === 'aptitude');
  const personalityQuestions = questions.filter(q => q.section === 'personality');
  const interestQuestions = questions.filter(q => q.section === 'interest');

  console.log('Debug data:', {
    aptitudeAnswers: aptitudeAnswers.length,
    personalityAnswers: personalityAnswers.length,
    interestAnswers: interestAnswers.length,
    aptitudeQuestions: aptitudeQuestions.length,
    personalityQuestions: personalityQuestions.length,
    interestQuestions: interestQuestions.length,
    sampleAnswer: aptitudeAnswers[0],
    sampleQuestion: aptitudeQuestions[0]
  });

  // Ensure answers have the correct format for scoring
  const formattedAptitudeAnswers = aptitudeAnswers.map(answer => ({
    id: answer.id,
    userId: answer.userId,
    questionId: answer.questionId,
    answer: answer.answer,
    score: answer.score || 0,
    timeSpent: answer.timeSpent || 0,
    isCorrect: answer.isCorrect || false,
    rawScore: answer.rawScore || 0,
    createdAt: answer.createdAt,
    question: answer.question
  }));

  const formattedPersonalityAnswers = personalityAnswers.map(answer => ({
    id: answer.id,
    userId: answer.userId,
    questionId: answer.questionId,
    answer: answer.answer,
    score: answer.score || 0,
    timeSpent: answer.timeSpent || 0,
    createdAt: answer.createdAt,
    question: answer.question
  }));

  const formattedInterestAnswers = interestAnswers.map(answer => ({
    id: answer.id,
    userId: answer.userId,
    questionId: answer.questionId,
    answer: answer.answer,
    score: answer.score || 0,
    timeSpent: answer.timeSpent || 0,
    createdAt: answer.createdAt,
    question: answer.question
  }));

  let aptitudeScores = {};
  let personalityScores = {};
  let interestScores = {};

  // Calculate scores with error handling
  try {
    if (formattedAptitudeAnswers.length > 0 && aptitudeQuestions.length > 0) {
      aptitudeScores = AssessmentScoring.calculateAptitudeScores(formattedAptitudeAnswers, aptitudeQuestions);
    }
  } catch (error) {
    console.error('Error calculating aptitude scores:', error);
    aptitudeScores = { logical: 50, numerical: 50, verbal: 50, spatial: 50 };
  }

  try {
    if (formattedPersonalityAnswers.length > 0 && personalityQuestions.length > 0) {
      personalityScores = AssessmentScoring.calculatePersonalityScores(formattedPersonalityAnswers, personalityQuestions);
    }
  } catch (error) {
    console.error('Error calculating personality scores:', error);
    personalityScores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  }

  try {
    if (formattedInterestAnswers.length > 0 && interestQuestions.length > 0) {
      interestScores = AssessmentScoring.calculateInterestScores(formattedInterestAnswers, interestQuestions);
    }
  } catch (error) {
    console.error('Error calculating interest scores:', error);
    interestScores = { realistic: 50, investigative: 50, artistic: 50, social: 50, enterprising: 50, conventional: 50 };
  }

  console.log('Calculated scores:', { aptitudeScores, personalityScores, interestScores });

  let careerMatches = [];
  try {
    if (careers.length > 0) {
      careerMatches = AssessmentScoring.calculateCareerMatches(
        aptitudeScores,
        personalityScores,
        interestScores,
        careers
      );
      
      // Ensure each career match has required score fields
      careerMatches = careerMatches.map((career, index) => ({
        ...career,
        score: career.score || career.matchPercentage || Math.max(0, 90 - (index * 5)),
        matchPercentage: career.matchPercentage || career.score || Math.max(0, 90 - (index * 5))
      }));
    }
  } catch (error) {
    console.error('Error calculating career matches:', error);
    // Provide fallback career matches with proper score calculation
    careerMatches = careers.slice(0, 5).map((career, index) => {
      // Calculate a basic match score based on RIASEC profile
      let matchScore = 50; // Base score
      
      if (career.riasecProfile && Object.keys(interestScores).length > 0) {
        const riasecKeys = ['R', 'I', 'A', 'S', 'E', 'C'];
        const interestKeys = Object.keys(interestScores);
        
        // Map interest scores to RIASEC if possible
        const riasecMap = {
          'realistic': 'R',
          'investigative': 'I', 
          'artistic': 'A',
          'social': 'S',
          'enterprising': 'E',
          'conventional': 'C'
        };
        
        let totalWeight = 0;
        let weightedScore = 0;
        
        for (const [interestType, score] of Object.entries(interestScores)) {
          const riasecCode = riasecMap[interestType as keyof typeof riasecMap];
          if (riasecCode && career.riasecProfile && typeof career.riasecProfile === 'object' && !Array.isArray(career.riasecProfile) && riasecCode in career.riasecProfile) {
            const careerWeight = (career.riasecProfile as Record<string, number>)[riasecCode] / 100;
            const userScore = score as number;
            weightedScore += (careerWeight * userScore);
            totalWeight += careerWeight;
          }
        }
        
        if (totalWeight > 0) {
          matchScore = Math.round(weightedScore / totalWeight);
        }
      }
      
      // Ensure score is reasonable (50-95 range)
      matchScore = Math.max(50, Math.min(95, matchScore - (index * 3)));
      
      return {
        ...career,
        score: matchScore,
        matchPercentage: matchScore
      };
    });
  }

  console.log('Career matches with scores:', careerMatches.slice(0, 3).map(c => ({ 
    title: c.title, 
    score: c.score, 
    matchPercentage: c.matchPercentage 
  })));

  // Create a comprehensive report object that mimics the database report structure
  const reportData = {
    id: `${assessmentSession.id}-report`,
    userId: user.id,
    version: assessmentSession.version || 1,
    isLatest: true,
    aptitudeScores: aptitudeScores,
    personalityScores: personalityScores,
    interestScores: interestScores,
    personalitySummary: generatePersonalitySummary(personalityScores),
    interestSummary: generateInterestSummary(interestScores),
    careerMatches: careerMatches,
    recommendations: generateRecommendations(careerMatches, assessmentSession.assessmentType?.targetAudience),
    strengths: extractStrengths(aptitudeScores, personalityScores),
    developmentAreas: generateDevelopmentAreas(aptitudeScores),
    reliability: { score: 85, factors: ['response_consistency'] },
    reportType: getReportType(assessmentSession.assessmentType?.targetAudience || 'college_student'),
    targetAudience: assessmentSession.assessmentType?.targetAudience || 'college_student',
    visualElements: { useEmojis: true, colorScheme: 'bright' },
    parentSummary: assessmentSession.assessmentType?.targetAudience === 'school_student' 
      ? generateParentSummary(personalityScores, careerMatches) 
      : null,
    counselorNotes: {},
    actionPlan: generateActionPlan(careerMatches, assessmentSession.assessmentType?.targetAudience),
    skillGaps: generateSkillGaps(aptitudeScores),
    careerPathways: generateCareerPathways(careerMatches),
    pdfUrl: null,
    createdAt: assessmentSession.completedAt || new Date(),
    updatedAt: new Date(),
    user: {
      name: assessmentSession.user.name ?? undefined,
      email: assessmentSession.user.email ?? undefined,
      age: assessmentSession.user.age ?? undefined,
      gradeLevel: assessmentSession.user.gradeLevel ?? undefined,
      schoolName: assessmentSession.user.schoolName ?? undefined
    }
  };

  // Render appropriate report component based on target audience
  const targetAudience = assessmentSession.assessmentType?.targetAudience || user.targetAudience || 'college_student';

  const reportProps = {
    user: assessmentSession.user,
    scores: {
      aptitude: aptitudeScores,
      personality: personalityScores,
      interest: interestScores
    },
    careerMatches,
    sessionId: assessmentSession.id
  };

  switch (targetAudience) {
    case 'school_student':
      return <SchoolStudentReport data={reportProps} />;
    case 'working_professional':
      return <CollegeStudentReport data={reportProps} />; // Use college report for now
    case 'college_student':
    default:
      return <CollegeStudentReport data={reportProps} />;
  }
}

// Helper functions to generate meaningful report content
function generatePersonalitySummary(scores: any): string {
  const topTraits = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([trait]) => trait);
  
  return `Your personality profile shows strong ${topTraits.join(', ')} characteristics. These traits indicate your natural preferences and working style.`;
}

function generateInterestSummary(scores: any): string {
  const topInterests = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest]) => interest);
  
  return `Your interests align most strongly with ${topInterests.join(', ')} activities. These areas represent where you're likely to find satisfaction and engagement.`;
}

function generateRecommendations(careerMatches: any[], targetAudience?: string): string[] {
  const topCareer = careerMatches[0];
  const recommendations = [];
  
  if (targetAudience === 'school_student') {
    recommendations.push(
      `Explore subjects related to ${topCareer?.title || 'your top career matches'}`,
      'Consider extracurricular activities that build relevant skills',
      'Talk to professionals in your field of interest',
      'Look into relevant college programs or vocational training'
    );
  } else if (targetAudience === 'working_professional') {
    recommendations.push(
      `Consider transitioning to roles in ${topCareer?.title || 'your matched fields'}`,
      'Develop skills through professional development courses',
      'Network with professionals in your target industry',
      'Create a career transition plan with timeline and milestones'
    );
  } else {
    recommendations.push(
      `Consider exploring ${topCareer?.title || 'your top career matches'} in more detail`,
      'Build relevant skills through courses and practical experience',
      'Connect with professionals in your field of interest',
      'Look for internships or entry-level opportunities'
    );
  }
  
  return recommendations;
}

function extractStrengths(aptitudeScores: any, personalityScores: any): string[] {
  const strengths = [];
  
  // Add personality strengths
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) > 70) {
      strengths.push(`Strong ${trait} characteristics`);
    }
  }
  
  // Add aptitude strengths
  for (const [aptitude, scoreData] of Object.entries(aptitudeScores)) {
    if (typeof scoreData === 'object' && scoreData && (scoreData as any).adjusted > 70) {
      strengths.push(`High ${aptitude} ability`);
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

function getReportType(targetAudience: string): string {
  const types = {
    'school_student': 'simplified',
    'college_student': 'standard',
    'working_professional': 'detailed'
  };
  return types[targetAudience as keyof typeof types] || 'standard';
}

function generateParentSummary(personalityScores: any, careerMatches: any[]): string {
  const topCareer = careerMatches[0];
  const topTrait = Object.entries(personalityScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
    
  return `Your child shows potential in ${topCareer?.title || 'various career areas'} with strong ${topTrait} characteristics. Encourage exploration of their interests while supporting their natural strengths. Consider discussing their career interests and helping them explore relevant educational paths.`;
}

function generateActionPlan(careerMatches: any[], targetAudience?: string): any {
  const topCareer = careerMatches[0];
  
  if (targetAudience === 'school_student') {
    return {
      shortTerm: [
        'Research relevant school subjects',
        'Join related clubs or activities',
        'Talk to career counselor'
      ],
      mediumTerm: [
        'Explore college programs',
        'Seek mentorship opportunities',
        'Gain relevant experience through volunteering'
      ],
      longTerm: [
        'Plan educational pathway',
        'Build relevant skills',
        'Create portfolio of experiences'
      ]
    };
  }
  
  return {
    immediate: [`Research ${topCareer?.title || 'matched careers'} in detail`],
    next30Days: ['Update resume and LinkedIn profile', 'Identify skill gaps'],
    next90Days: ['Network with professionals', 'Consider additional training'],
    next6Months: ['Apply for relevant positions', 'Build portfolio']
  };
}

function generateSkillGaps(aptitudeScores: any): any {
  const gaps = [];
  
  for (const [aptitude, scoreData] of Object.entries(aptitudeScores)) {
    if (typeof scoreData === 'object' && scoreData && (scoreData as any).adjusted < 60) {
      gaps.push({
        skill: aptitude,
        currentLevel: (scoreData as any).adjusted,
        recommendedActions: [`Practice ${aptitude} exercises`, `Take relevant courses`]
      });
    }
  }
  
  return gaps.slice(0, 3);
}

function generateCareerPathways(careerMatches: any[]): any {
  return careerMatches.slice(0, 3).map(career => ({
    title: career.title,
    description: career.description,
    pathway: [
      'Entry-level position',
      'Gain experience and skills',
      'Advance to senior roles',
      'Leadership opportunities'
    ],
    requirements: career.requiredSkills || []
  }));
}
