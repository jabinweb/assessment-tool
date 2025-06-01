import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Aptitude scoring - correct answers mapping
const APTITUDE_CORRECT_ANSWERS: { [key: string]: number } = {
  // This will be populated with actual question IDs and correct answer indices
  // Example: "question-id-1": 1, "question-id-2": 3, etc.
};

// Personality trait mapping for Big Five model
const PERSONALITY_TRAIT_MAPPING = {
  extraversion: {
    positive: [], // Question IDs that positively correlate
    negative: []  // Question IDs that need reverse scoring
  },
  openness: {
    positive: [],
    negative: []
  },
  conscientiousness: {
    positive: [],
    negative: []
  },
  emotionalStability: {
    positive: [],
    negative: []
  },
  agreeableness: {
    positive: [],
    negative: []
  }
};

// RIASEC interest categories mapping
const RIASEC_MAPPING = {
  realistic: [],      // Question IDs for Realistic interests
  investigative: [],  // Question IDs for Investigative interests
  artistic: [],       // Question IDs for Artistic interests
  social: [],         // Question IDs for Social interests
  enterprising: [],   // Question IDs for Enterprising interests
  conventional: []    // Question IDs for Conventional interests
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers, section } = await request.json();

    if (!answers || !section) {
      return NextResponse.json({ error: 'Missing answers or section' }, { status: 400 });
    }

    if (!['aptitude', 'personality', 'interest'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get questions for validation
    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { 
        id: { in: questionIds },
        section: section
      }
    });

    if (questions.length !== answers.length) {
      return NextResponse.json({ error: 'Invalid questions provided' }, { status: 400 });
    }

    // Save answers to database with calculated scores
    const savedAnswers = [];
    for (const answer of answers) {
    const question = questions.find((q: any) => q.id === answer.questionId);
      if (!question) continue;

      const score = calculateScore(answer, question, section);
      
      const savedAnswer = await prisma.answer.upsert({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId: answer.questionId
          }
        },
        update: {
          answer: answer.answer,
          score: score
        },
        create: {
          userId: user.id,
          questionId: answer.questionId,
          answer: answer.answer,
          score: score
        }
      });
      
      savedAnswers.push(savedAnswer);
    }

    // Check if all sections are completed
    const allAnswers = await prisma.answer.findMany({
      where: { userId: user.id },
      include: { question: true }
    });

    const completedSections = getCompletedSections(allAnswers);
    const isAssessmentComplete = completedSections.length === 3;

    if (isAssessmentComplete) {
      // Generate comprehensive report
      const reportId = await generateCompleteReport(user.id, allAnswers);
      
      return NextResponse.json({ 
        message: 'Assessment completed successfully',
        reportId,
        completed: true,
        completedSections,
        totalSections: 3
      });
    }

    return NextResponse.json({ 
      message: `${section} section completed`,
      completed: false,
      completedSections,
      totalSections: 3,
      nextSection: getNextSection(completedSections)
    });

  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateScore(answer: any, question: any, section: string): number {
  const answerValue = parseInt(answer.answer);
  
  switch (section) {
    case 'aptitude':
      // Binary scoring: 1 for correct, 0 for incorrect
      const correctAnswer = APTITUDE_CORRECT_ANSWERS[question.id];
      return correctAnswer === answerValue ? 1 : 0;
    
    case 'personality':
      // Likert scale 1-5, validate range
      if (answerValue < 1 || answerValue > 5) return 0;
      return answerValue;
    
    case 'interest':
      // Preference scoring: 2 for like, 1 for neutral, 0 for dislike
      const scoreMap: { [key: number]: number } = { 0: 0, 1: 1, 2: 2 };
      return scoreMap[answerValue] || 0;
    
    default:
      return 0;
  }
}

function getCompletedSections(answers: any[]): string[] {
  const sections = ['aptitude', 'personality', 'interest'];
  return sections.filter(section => 
    answers.some(answer => answer.question.section === section)
  );
}

function getNextSection(completedSections: string[]): string | null {
  const allSections = ['aptitude', 'personality', 'interest'];
  return allSections.find(section => !completedSections.includes(section)) || null;
}

async function generateCompleteReport(userId: string, allAnswers: any[]): Promise<string> {
  // Separate answers by section
  const aptitudeAnswers = allAnswers.filter(a => a.question.section === 'aptitude');
  const personalityAnswers = allAnswers.filter(a => a.question.section === 'personality');
  const interestAnswers = allAnswers.filter(a => a.question.section === 'interest');

  // Calculate comprehensive scores
  const aptitudeScores = calculateDetailedAptitudeScores(aptitudeAnswers);
  const personalityScores = calculatePersonalityTraitScores(personalityAnswers);
  const interestScores = calculateRIASECScores(interestAnswers);

  // Generate narrative summaries
  const personalitySummary = generatePersonalitySummary(personalityScores);
  const interestSummary = generateInterestSummary(interestScores);
  
  // Generate career recommendations
  const careerMatches = generateCareerRecommendations(
    aptitudeScores, 
    personalityScores, 
    interestScores
  );

  // Create report in database
  const report = await prisma.report.create({
    data: {
      userId,
      aptitudeScores: JSON.stringify(aptitudeScores),
      personalityScores: JSON.stringify(personalityScores),
      interestScores: JSON.stringify(interestScores),
      personalitySummary,
      interestSummary,
      careerMatches: JSON.stringify(careerMatches)
    }
  });

  return report.id;
}

function calculateDetailedAptitudeScores(answers: any[]) {
  const totalQuestions = answers.length;
  const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
  
  // Calculate subsection scores (you can customize based on your questions)
  const verbalScore = answers
    .filter(a => a.question.text.toLowerCase().includes('verbal') || 
                 a.question.text.toLowerCase().includes('language'))
    .reduce((sum, a) => sum + (a.score || 0), 0);
    
  const logicalScore = answers
    .filter(a => a.question.text.toLowerCase().includes('logical') || 
                 a.question.text.toLowerCase().includes('reasoning'))
    .reduce((sum, a) => sum + (a.score || 0), 0);
    
  const numericalScore = answers
    .filter(a => a.question.text.toLowerCase().includes('numerical') || 
                 a.question.text.toLowerCase().includes('math') ||
                 a.question.text.toLowerCase().includes('%') ||
                 a.question.text.toLowerCase().includes('speed'))
    .reduce((sum, a) => sum + (a.score || 0), 0);

  return {
    totalScore,
    scaledScore: Math.round((totalScore / totalQuestions) * 100),
    subsections: {
      verbal: {
        raw: verbalScore,
        scaled: Math.round((verbalScore / Math.max(1, answers.filter(a => 
          a.question.text.toLowerCase().includes('verbal')).length)) * 100)
      },
      logical: {
        raw: logicalScore,
        scaled: Math.round((logicalScore / Math.max(1, answers.filter(a => 
          a.question.text.toLowerCase().includes('logical')).length)) * 100)
      },
      numerical: {
        raw: numericalScore,
        scaled: Math.round((numericalScore / Math.max(1, answers.filter(a => 
          a.question.text.toLowerCase().includes('numerical') ||
          a.question.text.includes('%')).length)) * 100)
      }
    },
    performance: getPerformanceLevel(Math.round((totalScore / totalQuestions) * 100))
  };
}

function calculatePersonalityTraitScores(answers: any[]) {
  // For demonstration, calculate average scores
  // In production, you'd map specific questions to traits
  const avgScore = answers.reduce((sum, a) => sum + (a.score || 0), 0) / answers.length;
  
  return {
    extraversion: Math.round(avgScore * 20), // Scale to 0-100
    openness: Math.round((avgScore + 0.5) * 18),
    conscientiousness: Math.round((avgScore + 1) * 16),
    emotionalStability: Math.round((avgScore - 0.3) * 22),
    agreeableness: Math.round((avgScore + 0.8) * 17)
  };
}

function calculateRIASECScores(answers: any[]) {
  // Map answers to RIASEC categories based on question content
  const categories = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0
  };

  answers.forEach(answer => {
    const text = answer.question.text.toLowerCase();
    const score = answer.score || 0;
    
    if (text.includes('mechanical') || text.includes('build') || text.includes('outdoor')) {
      categories.realistic += score;
    } else if (text.includes('mathematical') || text.includes('research') || text.includes('laboratory')) {
      categories.investigative += score;
    } else if (text.includes('creative') || text.includes('artistic') || text.includes('design')) {
      categories.artistic += score;
    } else if (text.includes('helping') || text.includes('people') || text.includes('social')) {
      categories.social += score;
    } else if (text.includes('business') || text.includes('leadership') || text.includes('sales')) {
      categories.enterprising += score;
    } else {
      categories.conventional += score;
    }
  });

  return categories;
}

function generatePersonalitySummary(scores: any): string {
  const traits = Object.entries(scores).map(([trait, score]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    score: score as number,
    level: getTraitLevel(score as number)
  }));

  const highTraits = traits.filter(t => t.level === 'High').map(t => t.trait);
  const lowTraits = traits.filter(t => t.level === 'Low').map(t => t.trait);

  return `Your personality profile shows ${highTraits.length > 0 ? `high ${highTraits.join(', ')}` : 'balanced traits'}.${
    lowTraits.length > 0 ? ` Areas for development include ${lowTraits.join(', ')}.` : ''
  } This suggests you work well in collaborative environments and approach tasks with a balanced perspective.`;
}

function generateInterestSummary(scores: any): string {
  const sortedInterests = Object.entries(scores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest]) => interest.charAt(0).toUpperCase() + interest.slice(1));

  return `Your interests align primarily with ${sortedInterests.join(', ')} activities. This suggests you would thrive in environments that combine ${sortedInterests[0].toLowerCase()} and ${sortedInterests[1].toLowerCase()} elements.`;
}

function generateCareerRecommendations(aptitude: any, personality: any, interest: any): any[] {
  // Sample career matching logic
  const careers = [
    {
      title: 'Software Developer',
      match: Math.min(95, aptitude.subsections.logical.scaled + interest.investigative + personality.openness) / 3,
      description: 'Strong analytical skills and investigative interests make this an excellent fit.',
      requirements: ['Programming skills', 'Problem-solving', 'Continuous learning']
    },
    {
      title: 'UX Designer',
      match: Math.min(95, aptitude.subsections.verbal.scaled + interest.artistic + personality.openness) / 3,
      description: 'Creative problem-solving combined with user empathy.',
      requirements: ['Design skills', 'User research', 'Creative thinking']
    },
    {
      title: 'Data Analyst',
      match: Math.min(95, aptitude.subsections.numerical.scaled + interest.investigative + personality.conscientiousness) / 3,
      description: 'Strong numerical abilities with investigative approach to data.',
      requirements: ['Statistical analysis', 'Data visualization', 'Critical thinking']
    },
    {
      title: 'Project Manager',
      match: Math.min(95, aptitude.scaledScore + personality.extraversion + personality.conscientiousness) / 3,
      description: 'Leadership abilities with strong organizational skills.',
      requirements: ['Leadership', 'Communication', 'Planning']
    }
  ];

  return careers
    .sort((a, b) => b.match - a.match)
    .slice(0, 3)
    .map(career => ({
      ...career,
      match: Math.round(career.match)
    }));
}

function getPerformanceLevel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Improvement';
}

function getTraitLevel(score: number): string {
  if (score >= 70) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}
