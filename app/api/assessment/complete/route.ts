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

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the assessment session to determine the assessment type
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        assessmentType: true
      }
    });

    if (!assessmentSession || assessmentSession.userId !== user.id) {
      return NextResponse.json({ error: 'Assessment session not found' }, { status: 404 });
    }

    // Get all answers for this user
    const allAnswers = await prisma.answer.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: {
            assessmentType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter answers for the current assessment type
    const currentAssessmentAnswers = allAnswers.filter(answer => 
      answer.question.assessmentTypeId === assessmentSession.assessmentTypeId
    );

    // Get questions for this assessment type
    const questions = await prisma.question.findMany({
      where: {
        assessmentTypeId: assessmentSession.assessmentTypeId,
        isActive: true
      }
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

    // Generate the report using the assessment type-specific logic
    const reportData = await generateAssessmentTypeReport(
      user,
      currentAssessmentAnswers,
      questions,
      careers,
      assessmentSession.assessmentType
    );

    // Mark assessment session as completed
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        reportId: reportData.reportId
      }
    });

    return NextResponse.json({
      success: true,
      reportId: reportData.reportId,
      message: 'Assessment completed successfully'
    });

  } catch (error) {
    console.error('Error completing assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateAssessmentTypeReport(
  user: any,
  answers: any[],
  questions: any[],
  careers: any[],
  assessmentType: any
) {
  // Separate answers by section
  const aptitudeAnswers = answers.filter(a => a.question.section === 'aptitude');
  const personalityAnswers = answers.filter(a => a.question.section === 'personality');
  const interestAnswers = answers.filter(a => a.question.section === 'interest');

  // Calculate scores using the enhanced scoring system
  const aptitudeScores = AssessmentScoring.calculateAptitudeScores(
    aptitudeAnswers, 
    questions.filter(q => q.section === 'aptitude')
  );
  
  const personalityScores = AssessmentScoring.calculatePersonalityScores(
    personalityAnswers,
    questions.filter(q => q.section === 'personality')
  );
  
  const interestScores = AssessmentScoring.calculateInterestScores(
    interestAnswers,
    questions.filter(q => q.section === 'interest')
  );

  // Generate career matches
  const careerMatches = AssessmentScoring.calculateCareerMatches(
    aptitudeScores,
    personalityScores,
    interestScores,
    careers
  );

  // Generate assessment type-specific content
  const reportContent = generateReportContent(
    assessmentType.targetAudience,
    aptitudeScores,
    personalityScores,
    interestScores,
    careerMatches
  );

  // Create the report in database
  const report = await prisma.report.create({
    data: {
      userId: user.id,
      aptitudeScores: JSON.stringify(aptitudeScores),
      personalityScores: JSON.stringify(personalityScores),
      interestScores: JSON.stringify(interestScores),
      personalitySummary: reportContent.personalitySummary,
      interestSummary: reportContent.interestSummary,
      careerMatches: JSON.stringify(careerMatches),
      recommendations: JSON.stringify(reportContent.recommendations),
      strengths: JSON.stringify(reportContent.strengths),
      developmentAreas: JSON.stringify(reportContent.developmentAreas),
      reliability: JSON.stringify({ score: 85, factors: ['response_consistency', 'time_taken'] }),
      reportType: getReportType(assessmentType.targetAudience),
      targetAudience: assessmentType.targetAudience,
      visualElements: JSON.stringify(reportContent.visualElements),
      parentSummary: reportContent.parentSummary,
      counselorNotes: JSON.stringify(reportContent.counselorNotes),
      actionPlan: JSON.stringify(reportContent.actionPlan),
      skillGaps: JSON.stringify(reportContent.skillGaps),
      careerPathways: JSON.stringify(reportContent.careerPathways)
    }
  });

  return { reportId: report.id };
}

function generateReportContent(targetAudience: string, aptitudeScores: any, personalityScores: any, interestScores: any, careerMatches: any[]) {
  if (targetAudience === 'school_student') {
    return generateSchoolStudentReport(aptitudeScores, personalityScores, interestScores, careerMatches);
  } else if (targetAudience === 'college_student') {
    return generateCollegeStudentReport(aptitudeScores, personalityScores, interestScores, careerMatches);
  } else {
    return generateProfessionalReport(aptitudeScores, personalityScores, interestScores, careerMatches);
  }
}

function generateSchoolStudentReport(aptitudeScores: any, personalityScores: any, interestScores: any, careerMatches: any[]) {
  return {
    personalitySummary: generateSchoolPersonalitySummary(personalityScores),
    interestSummary: generateSchoolInterestSummary(interestScores),
    recommendations: generateSchoolRecommendations(careerMatches),
    strengths: extractSchoolStrengths(aptitudeScores, personalityScores, interestScores),
    developmentAreas: generateSchoolDevelopmentAreas(aptitudeScores, personalityScores),
    visualElements: {
      useEmojis: true,
      colorScheme: 'bright',
      chartType: 'simple_bar',
      includeIcons: true
    },
    parentSummary: generateParentSummary(personalityScores, interestScores, careerMatches),
    counselorNotes: {
      academicFocus: getAcademicFocus(interestScores),
      developmentPriorities: getSchoolDevelopmentPriorities(aptitudeScores),
      parentEngagement: getParentEngagementSuggestions(personalityScores)
    },
    actionPlan: generateSchoolActionPlan(careerMatches, interestScores),
    skillGaps: identifySchoolSkillGaps(aptitudeScores),
    careerPathways: generateSchoolCareerPathways(careerMatches)
  };
}

function generateCollegeStudentReport(aptitudeScores: any, personalityScores: any, interestScores: any, careerMatches: any[]) {
  return {
    personalitySummary: generateCollegePersonalitySummary(personalityScores),
    interestSummary: generateCollegeInterestSummary(interestScores),
    recommendations: generateCollegeRecommendations(careerMatches),
    strengths: extractCollegeStrengths(aptitudeScores, personalityScores, interestScores),
    developmentAreas: generateCollegeDevelopmentAreas(aptitudeScores, personalityScores),
    visualElements: {
      useEmojis: false,
      colorScheme: 'professional',
      chartType: 'detailed_radar',
      includeIcons: false
    },
    parentSummary: null, // College students typically don't need parent summaries
    counselorNotes: {
      careerGuidance: getCareerGuidance(careerMatches),
      skillDevelopment: getSkillDevelopmentPlan(aptitudeScores),
      internshipSuggestions: getInternshipSuggestions(careerMatches)
    },
    actionPlan: generateCollegeActionPlan(careerMatches, interestScores),
    skillGaps: identifyCollegeSkillGaps(aptitudeScores, careerMatches),
    careerPathways: generateCollegeCareerPathways(careerMatches)
  };
}

function generateCollegeInterestSummary(interestScores: any): string {
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest]) => interest);

  const interestDescriptions = {
    realistic: "practical applications and hands-on work",
    investigative: "research, analysis, and problem-solving",
    artistic: "creative expression and innovative design",
    social: "collaborative work and helping others",
    enterprising: "leadership, business, and entrepreneurial activities",
    conventional: "organization, data management, and systematic approaches"
  };

  return `Your interest profile shows strong alignment with ${topInterests.map(i => interestDescriptions[i as keyof typeof interestDescriptions]).join(', ')}. These interests can guide your course selection, extracurricular activities, and career exploration during college.`;
}

// Helper functions for School Student Reports
function generateSchoolPersonalitySummary(personalityScores: any): string {
  const topTraits = Object.entries(personalityScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([trait]) => trait);

  return `You're someone who shows strong ${topTraits[0]} and ${topTraits[1]} qualities! This means you're likely to do well in activities that match your natural personality. Keep exploring different subjects and activities to see what excites you most.`;
}

function generateSchoolInterestSummary(interestScores: any): string {
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest]) => interest);

  const interestDescriptions = {
    realistic: "hands-on activities and working with tools",
    investigative: "solving problems and discovering how things work",
    artistic: "creative projects and expressing yourself",
    social: "helping others and working with people",
    enterprising: "leading projects and starting new things",
    conventional: "organizing information and following systems"
  };

  return `You seem most interested in ${topInterests.map(i => interestDescriptions[i as keyof typeof interestDescriptions]).join(', ')}. These interests can guide you toward school subjects and activities you'll enjoy!`;
}

function generateParentSummary(personalityScores: any, interestScores: any, careerMatches: any[]): string {
  const topCareer = careerMatches[0];
  const strongTraits = Object.entries(personalityScores)
    .filter(([, score]) => (score as number) > 70)
    .map(([trait]) => trait);

  return `Your child shows strong potential in ${topCareer?.title || 'multiple career areas'}. Their personality assessment reveals strengths in ${strongTraits.join(', ')}, which aligns well with their interests. Consider encouraging activities related to their top interest areas and supporting their natural strengths while helping them develop in areas that need growth.`;
}

// Helper functions for College Student Reports
function generateCollegePersonalitySummary(personalityScores: any): string {
  const traits = Object.entries(personalityScores).map(([trait, score]) => ({
    trait,
    score: score as number,
    level: (score as number) > 70 ? 'high' : (score as number) > 40 ? 'moderate' : 'developing'
  }));

  const highTraits = traits.filter(t => t.level === 'high').map(t => t.trait);
  const developingTraits = traits.filter(t => t.level === 'developing').map(t => t.trait);

  return `Your personality profile indicates strong ${highTraits.join(' and ')} characteristics, which are valuable assets in professional environments. ${developingTraits.length > 0 ? `Areas for continued development include ${developingTraits.join(' and ')}, which can be strengthened through targeted activities and experiences.` : 'Your well-rounded personality profile suggests adaptability across various work environments.'}`;
}

function getReportType(targetAudience: string): string {
  const reportTypes = {
    'school_student': 'simplified',
    'college_student': 'standard',
    'working_professional': 'detailed'
  };
  return reportTypes[targetAudience as keyof typeof reportTypes] || 'standard';
}

function generateSchoolCareerPathways(careerMatches: any[]) {
  const topCareers = careerMatches.slice(0, 5);
  
  return topCareers.map(career => ({
    careerTitle: career.title,
    matchScore: career.matchScore,
    pathway: {
      immediateSteps: [
        `Focus on ${career.fieldOfStudy || 'related'} subjects in school`,
        `Join clubs or activities related to ${career.title.toLowerCase()}`,
        'Talk to adults who work in this field to learn more'
      ],
      mediumTermGoals: [
        'Choose high school courses that prepare you for this career',
        'Look for summer programs or camps in this area',
        'Volunteer or help out in places where people do this work'
      ],
      longTermVision: [
        `Study ${career.fieldOfStudy || 'the right subjects'} in college`,
        `Get training or education needed to become a ${career.title}`,
        'Start your career and grow your skills over time'
      ]
    },
    requiredSkills: career.requiredSkills || [],
    educationRequirements: career.educationLevel || 'High school diploma',
    industryGrowth: career.growthProjection || 'Good opportunities',
    salaryRange: career.salaryRange || 'Fair pay'
  }));
}

function generateSchoolActionPlan(careerMatches: any[], interestScores: any) {
  const topCareers = careerMatches.slice(0, 3);
  const topInterest = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

  return {
    immediate: {
      title: "This School Year (Next few months)",
      actions: [
        `Learn more about ${topCareers[0]?.title || 'your top career match'} by talking to adults who do this work`,
        `Join clubs or activities related to ${topInterest} interests`,
        "Focus on doing well in your favorite subjects",
        "Ask your teachers about careers related to subjects you enjoy"
      ]
    },
    shortTerm: {
      title: "Next Year or Two",
      actions: [
        `Look for summer programs or camps related to ${topCareers[0]?.title || 'your interests'}`,
        "Try volunteering in places where people do work you find interesting",
        `Take classes that help you learn about ${topCareers.slice(0, 2).map(c => c.title).join(' or ')} careers`,
        "Visit workplaces or job sites to see different careers in action",
        "Talk to your school counselor about high school course planning"
      ]
    },
    mediumTerm: {
      title: "In High School",
      actions: [
        "Choose high school courses that prepare you for careers you're interested in",
        "Look for internships, job shadowing, or part-time work in your areas of interest",
        `Build skills that are important for ${topCareers[0]?.title || 'your target careers'}`,
        "Join high school clubs and activities related to your career interests",
        "Start thinking about college majors that could lead to careers you want"
      ]
    },
    longTerm: {
      title: "After High School",
      actions: [
        `Study subjects in college that prepare you for ${topCareers[0]?.title || 'your chosen career'}`,
        "Get work experience through internships and part-time jobs",
        "Keep learning and growing your skills",
        "Build relationships with people who work in careers you want",
        "Start your career and keep exploring new opportunities"
      ]
    },
    keyMilestones: [
      "Talk to someone who works in your dream job",
      "Try a summer program related to your interests",
      "Choose high school courses for your career path",
      "Get your first work experience",
      "Graduate and start your next step"
    ],
    resources: [
      "School counselors and teachers",
      "Family members and family friends",
      "Library books and websites about careers",
      "Career day events at school",
      "Community programs for students"
    ]
  };
}

function generateCollegeCareerPathways(careerMatches: any[]) {
  const topCareers = careerMatches.slice(0, 5);
  
  return topCareers.map(career => ({
    careerTitle: career.title,
    matchScore: career.matchScore,
    pathway: {
      immediateSteps: [
        `Complete relevant coursework in ${career.fieldOfStudy || 'your field'}`,
        `Seek internships or co-op opportunities in ${career.title.toLowerCase()} roles`,
        'Join professional student organizations related to this field'
      ],
      mediumTermGoals: [
        'Build a portfolio of relevant projects and experiences',
        'Network with professionals in the industry through events and LinkedIn',
        'Consider specialized certifications or additional training'
      ],
      longTermVision: [
        `Graduate with strong foundation for ${career.title} role`,
        'Secure entry-level position in target company or industry',
        'Develop expertise and advance to senior roles over 5-10 years'
      ]
    },
    requiredSkills: career.requiredSkills || [],
    educationRequirements: career.educationLevel || 'Bachelor\'s degree',
    industryGrowth: career.growthProjection || 'Stable',
    salaryRange: career.salaryRange || 'Competitive'
  }));
}
function identifyCollegeSkillGaps(aptitudeScores: any, careerMatches: any[]) {
  const topCareers = careerMatches.slice(0, 3);
  interface SkillGap {
    skillArea: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
    developmentSuggestions: string[];
    relevantCareers: string[];
  }

  const skillGaps: SkillGap[] = [];

  // Define skill thresholds for different aptitude areas
  const skillThresholds = {
    logical: 60,
    verbal: 55,
    numerical: 60,
    spatial: 50,
    mechanical: 55,
    abstract: 55
  };

  // Analyze aptitude scores against thresholds
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    const threshold = skillThresholds[aptitude as keyof typeof skillThresholds] || 50;
    if ((score as number) < threshold) {
      skillGaps.push({
        skillArea: aptitude,
        currentLevel: score as number,
        targetLevel: threshold,
        gap: threshold - (score as number),
        priority: threshold - (score as number) > 20 ? 'high' : 'medium',
        developmentSuggestions: getSkillDevelopmentSuggestions(aptitude),
        relevantCareers: topCareers.filter(career => 
          career.requiredSkills?.includes(aptitude) || 
          career.title.toLowerCase().includes(getSkillKeywords(aptitude))
        ).map(c => c.title)
      });
    }
  }

  // Add career-specific skill gaps
  topCareers.forEach(career => {
    if (career.requiredSkills) {
      career.requiredSkills.forEach((skill: string) => {
        const aptitudeScore = aptitudeScores[skill.toLowerCase()] || 0;
        if (aptitudeScore < 65) {
          const existingGap = skillGaps.find(gap => gap.skillArea === skill.toLowerCase());
          if (!existingGap) {
            skillGaps.push({
              skillArea: skill.toLowerCase(),
              currentLevel: aptitudeScore,
              targetLevel: 65,
              gap: 65 - aptitudeScore,
              priority: 'medium',
              developmentSuggestions: getSkillDevelopmentSuggestions(skill.toLowerCase()),
              relevantCareers: [career.title]
            });
          }
        }
      });
    }
  });

  return skillGaps.sort((a, b) => b.gap - a.gap);
}

function getSkillDevelopmentSuggestions(skill: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    logical: [
      'Practice logic puzzles and brain teasers',
      'Take courses in critical thinking or philosophy',
      'Engage in programming or coding exercises'
    ],
    verbal: [
      'Read diverse literature and academic texts',
      'Join debate clubs or public speaking groups',
      'Practice writing essays and research papers'
    ],
    numerical: [
      'Take additional mathematics or statistics courses',
      'Practice quantitative reasoning problems',
      'Use mathematical concepts in real-world projects'
    ],
    spatial: [
      'Practice with 3D modeling software',
      'Engage in activities like drawing, design, or architecture',
      'Play spatial reasoning games and puzzles'
    ],
    mechanical: [
      'Take hands-on engineering or physics labs',
      'Work on DIY projects or mechanical repairs',
      'Study mechanical systems and how they work'
    ],
    abstract: [
      'Study theoretical concepts in your field',
      'Practice pattern recognition exercises',
      'Engage with complex theoretical problems'
    ]
  };

  return suggestions[skill] || [
    'Seek additional coursework in this area',
    'Find practical applications to practice',
    'Consider tutoring or additional support'
  ];
}

function getSkillKeywords(skill: string): string {
  const keywords: { [key: string]: string } = {
    logical: 'analyst|logic|reasoning',
    verbal: 'communication|writing|language',
    numerical: 'math|data|statistics|finance',
    spatial: 'design|architecture|engineering',
    mechanical: 'engineering|technical|mechanical',
    abstract: 'research|theory|concept'
  };

  return keywords[skill] || skill;
}
function generateCollegeActionPlan(careerMatches: any[], interestScores: any) {
  const topCareers = careerMatches.slice(0, 3);
  const topInterest = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

  return {
    immediate: {
      title: "This Semester (Next 3-4 months)",
      actions: [
        `Research ${topCareers[0]?.title || 'your top career match'} through informational interviews`,
        `Join student organizations related to ${topInterest} activities`,
        "Update your resume and LinkedIn profile with recent achievements",
        "Schedule a meeting with your academic advisor to discuss career alignment"
      ]
    },
    shortTerm: {
      title: "This Academic Year (Next 6-12 months)",
      actions: [
        `Apply for internships in ${topCareers.slice(0, 2).map(c => c.title).join(' or ')} fields`,
        "Attend career fairs and networking events in your areas of interest",
        `Take elective courses that align with ${topCareers[0]?.title || 'your career goals'}`,
        "Build a portfolio of projects relevant to your target career path",
        "Seek mentorship from professionals or alumni in your field of interest"
      ]
    },
    mediumTerm: {
      title: "Before Graduation (Next 2-3 years)",
      actions: [
        "Complete at least one substantial internship or co-op experience",
        "Develop leadership experience through clubs, projects, or part-time work",
        `Build expertise in key skills required for ${topCareers[0]?.title || 'your chosen field'}`,
        "Create a strong professional network through industry connections",
        "Consider graduate school or professional certifications if needed for your career path"
      ]
    },
    longTerm: {
      title: "Post-Graduation Goals (3-5 years)",
      actions: [
        `Secure an entry-level position in ${topCareers[0]?.title || 'your target field'}`,
        "Continue professional development through workshops and courses",
        "Build expertise and work toward advancement opportunities",
        "Maintain and expand your professional network",
        "Consider specialization areas within your chosen field"
      ]
    },
    keyMilestones: [
      "Complete first internship",
      "Join professional organization",
      "Attend industry conference",
      "Complete capstone project",
      "Secure job offer before graduation"
    ],
    resources: [
      "Career Services Office",
      "Alumni network",
      "Professional associations",
      "Industry publications and websites",
      "LinkedIn Learning courses"
    ]
  };
}
function generateProfessionalReport(aptitudeScores: any, personalityScores: any, interestScores: any, careerMatches: any[]) {
  return {
    personalitySummary: generateProfessionalPersonalitySummary(personalityScores),
    interestSummary: generateProfessionalInterestSummary(interestScores),
    recommendations: generateProfessionalRecommendations(careerMatches),
    strengths: extractProfessionalStrengths(aptitudeScores, personalityScores, interestScores),
    developmentAreas: generateProfessionalDevelopmentAreas(aptitudeScores, personalityScores),
    visualElements: {
      useEmojis: false,
      colorScheme: 'corporate',
      chartType: 'comprehensive_analytics',
      includeIcons: false
    },
    parentSummary: null, // Not applicable for working professionals
    counselorNotes: {
      careerTransition: getCareerTransitionGuidance(careerMatches),
      leadershipDevelopment: getLeadershipDevelopmentPlan(personalityScores),
      strategicPlanning: getStrategicCareerPlanning(aptitudeScores, careerMatches)
    },
    actionPlan: generateProfessionalActionPlan(careerMatches, interestScores),
    skillGaps: identifyProfessionalSkillGaps(aptitudeScores, careerMatches),
    careerPathways: generateProfessionalCareerPathways(careerMatches)
  };
}

function generateProfessionalPersonalitySummary(personalityScores: any): string {
  const traits = Object.entries(personalityScores).map(([trait, score]) => ({
    trait,
    score: score as number,
    level: (score as number) > 75 ? 'exceptional' : (score as number) > 60 ? 'strong' : (score as number) > 40 ? 'moderate' : 'developing'
  }));

  const exceptionalTraits = traits.filter(t => t.level === 'exceptional').map(t => t.trait);
  const strongTraits = traits.filter(t => t.level === 'strong').map(t => t.trait);

  return `Your leadership profile demonstrates ${exceptionalTraits.length > 0 ? `exceptional ${exceptionalTraits.join(' and ')} capabilities` : `strong ${strongTraits.join(' and ')} competencies`}. These characteristics position you well for senior-level responsibilities and strategic decision-making roles. Your personality profile suggests readiness for expanded leadership opportunities and cross-functional collaboration.`;
}

function generateProfessionalInterestSummary(interestScores: any): string {
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([interest]) => interest);

  const interestDescriptions = {
    realistic: "operational excellence and hands-on problem solving",
    investigative: "strategic analysis and research-driven decision making",
    artistic: "innovation and creative solution development",
    social: "team leadership and organizational development",
    enterprising: "business development and strategic growth initiatives",
    conventional: "process optimization and systematic management"
  };

  return `Your professional interests align strongly with ${topInterests.map(i => interestDescriptions[i as keyof typeof interestDescriptions]).join(' and ')}. This suggests optimal engagement in roles that leverage these core motivational drivers for sustained career satisfaction and peak performance.`;
}

function generateProfessionalRecommendations(careerMatches: any[]): string[] {
  const topCareers = careerMatches.slice(0, 3);
  return [
    `Consider transitioning toward ${topCareers[0]?.title || 'senior leadership'} roles that align with your strengths`,
    `Develop expertise in emerging areas relevant to ${topCareers[1]?.title || 'your field'}`,
    "Pursue executive education or advanced certifications to enhance your competitive positioning",
    "Build strategic relationships with industry leaders and potential mentors",
    "Consider board positions or advisory roles to leverage your experience"
  ];
}

function extractProfessionalStrengths(aptitudeScores: any, personalityScores: any, interestScores: any): string[] {
  const strengths = [];
  
  // Aptitude-based strengths
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) > 70) {
      strengths.push(`Advanced ${aptitude} reasoning capabilities`);
    }
  }

  // Personality-based strengths
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) > 75) {
      strengths.push(`Exceptional ${trait} leadership qualities`);
    }
  }

  return strengths.slice(0, 5);
}

function generateProfessionalDevelopmentAreas(aptitudeScores: any, personalityScores: any): string[] {
  const developmentAreas = [];

  // Areas for improvement based on scores
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < 50) {
      developmentAreas.push(`Enhanced ${aptitude} analytical skills for strategic decision-making`);
    }
  }

  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) < 50) {
      developmentAreas.push(`Strengthened ${trait} competencies for leadership effectiveness`);
    }
  }

  return developmentAreas.slice(0, 3);
}

function getCareerTransitionGuidance(careerMatches: any[]): string[] {
  return [
    "Assess current market positioning and competitive advantages",
    "Develop transition timeline with specific milestones",
    "Identify skill gaps and create development plan"
  ];
}

function getLeadershipDevelopmentPlan(personalityScores: any): string[] {
  return [
    "Executive coaching for enhanced leadership presence",
    "360-degree feedback assessment for comprehensive development",
    "Strategic thinking workshops and scenario planning exercises"
  ];
}

function getStrategicCareerPlanning(aptitudeScores: any, careerMatches: any[]): string[] {
  return [
    "Five-year career roadmap with key decision points",
    "Industry trend analysis and positioning strategy",
    "Personal brand development and thought leadership"
  ];
}

function generateProfessionalActionPlan(careerMatches: any[], interestScores: any) {
  const topCareer = careerMatches[0];
  
  return {
    immediate: {
      title: "Next 3 Months",
      actions: [
        "Conduct comprehensive career assessment with executive coach",
        `Research market opportunities in ${topCareer?.title || 'target roles'}`,
        "Update professional brand across all platforms"
      ]
    },
    shortTerm: {
      title: "6-12 Months",
      actions: [
        "Complete strategic leadership development program",
        "Expand professional network in target industry/function",
        "Secure board or advisory positions for experience"
      ]
    },
    mediumTerm: {
      title: "1-2 Years",
      actions: [
        `Transition to ${topCareer?.title || 'target role'} or similar position`,
        "Establish thought leadership through speaking/writing",
        "Mentor junior professionals in your field"
      ]
    },
    longTerm: {
      title: "3-5 Years",
      actions: [
        "Achieve senior executive or C-suite position",
        "Drive organizational transformation initiatives",
        "Consider entrepreneurial or investment opportunities"
      ]
    }
  };
}

function identifyProfessionalSkillGaps(aptitudeScores: any, careerMatches: any[]) {
  const skillGaps = [];
  
  // Executive-level skill requirements
  const executiveSkills = ['strategic_thinking', 'financial_acumen', 'digital_literacy', 'global_perspective'];
  
  for (const skill of executiveSkills) {
    skillGaps.push({
      skillArea: skill,
      currentLevel: 60, // Placeholder assessment
      targetLevel: 80,
      gap: 20,
      priority: 'high' as const,
      developmentSuggestions: [`Executive education in ${skill}`, `Mentorship in ${skill} development`]
    });
  }

  return skillGaps;
}

function generateProfessionalCareerPathways(careerMatches: any[]) {
  const topCareers = careerMatches.slice(0, 3);
  
  return topCareers.map(career => ({
    careerTitle: career.title,
    matchScore: career.matchScore,
    pathway: {
      immediateSteps: [
        "Strategic assessment of current position",
        "Market research and opportunity identification",
        "Professional brand enhancement"
      ],
      mediumTermGoals: [
        "Secure target role through strategic networking",
        "Complete executive development program",
        "Establish industry thought leadership"
      ],
      longTermVision: [
        "Achieve C-suite or equivalent senior position",
        "Drive organizational and industry transformation",
        "Mentor next generation of leaders"
      ]
    },
    requiredSkills: career.requiredSkills || ['Strategic Leadership', 'Change Management', 'Business Acumen'],
    experienceLevel: 'Senior Executive',
    industryGrowth: career.growthProjection || 'Expanding',
    compensationRange: career.salaryRange || 'Executive level'
  }));
}
function getAcademicFocus(interestScores: any): string[] {
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([interest]) => interest);

  const academicFocusMap: { [key: string]: string[] } = {
    realistic: [
      'STEM subjects (Science, Technology, Engineering, Mathematics)',
      'Applied sciences and hands-on laboratory work',
      'Technical and vocational education programs'
    ],
    investigative: [
      'Advanced sciences (Biology, Chemistry, Physics)',
      'Research methodology and analytical thinking',
      'Mathematics and computer science fundamentals'
    ],
    artistic: [
      'Creative arts (Visual arts, Music, Drama, Creative writing)',
      'Design and multimedia programs',
      'Literature and humanities with creative components'
    ],
    social: [
      'Social sciences (Psychology, Sociology, History)',
      'Language arts and communication skills',
      'Community service and leadership programs'
    ],
    enterprising: [
      'Business studies and entrepreneurship programs',
      'Leadership and public speaking activities',
      'Economics and marketing fundamentals'
    ],
    conventional: [
      'Organizational and administrative skills',
      'Mathematics and data management',
      'Business and accounting fundamentals'
    ]
  };

  const focusAreas: string[] = [];
  
  topInterests.forEach(interest => {
    const areas = academicFocusMap[interest] || [];
    focusAreas.push(...areas);
  });

  // Remove duplicates and return top recommendations
  return Array.from(new Set(focusAreas)).slice(0, 5);
}
function getSchoolDevelopmentPriorities(aptitudeScores: any): string[] {
  const priorities: string[] = [];
  const scoreThreshold = 40; // Lower threshold for school students
  
  // Check each aptitude area and suggest development priorities
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < scoreThreshold) {
      const aptitudePriorities: { [key: string]: string } = {
        logical: 'Critical thinking and problem-solving skills development',
        verbal: 'Reading comprehension and communication skills enhancement',
        numerical: 'Mathematical foundations and quantitative reasoning',
        spatial: 'Visual-spatial awareness and geometric thinking',
        mechanical: 'Understanding of basic mechanical principles and hands-on learning',
        abstract: 'Pattern recognition and conceptual thinking abilities'
      };
      
      if (aptitudePriorities[aptitude]) {
        priorities.push(aptitudePriorities[aptitude]);
      }
    }
  }

  // If no major gaps, suggest general development areas
  if (priorities.length === 0) {
    priorities.push(
      'Continue building strong study habits and time management skills',
      'Explore diverse subject areas to discover hidden talents',
      'Develop leadership skills through group projects and activities'
    );
  }

  // Limit to top 3 priorities to avoid overwhelming students
  return priorities.slice(0, 3);
}
function getParentEngagementSuggestions(personalityScores: any): string[] {
  const suggestions: string[] = [];
  
  // Analyze personality scores to provide targeted parent engagement suggestions
  for (const [trait, score] of Object.entries(personalityScores)) {
    const numericScore = score as number;
    
    switch (trait) {
      case 'extroversion':
        if (numericScore > 60) {
          suggestions.push('Encourage participation in group activities and social clubs');
          suggestions.push('Support their involvement in team sports or collaborative projects');
        } else {
          suggestions.push('Respect their need for quiet time and individual activities');
          suggestions.push('Help them find smaller group settings where they feel comfortable');
        }
        break;
        
      case 'conscientiousness':
        if (numericScore < 50) {
          suggestions.push('Help establish consistent study routines and organizational systems');
          suggestions.push('Use positive reinforcement for completing tasks and meeting deadlines');
        } else {
          suggestions.push('Acknowledge their responsibility and avoid micromanaging');
        }
        break;
        
      case 'openness':
        if (numericScore > 60) {
          suggestions.push('Expose them to diverse experiences, cultures, and learning opportunities');
          suggestions.push('Encourage creative pursuits and exploration of new subjects');
        } else {
          suggestions.push('Introduce new experiences gradually and with clear structure');
        }
        break;
        
      case 'agreeableness':
        if (numericScore > 60) {
          suggestions.push('Help them develop assertiveness skills and learn to say no when appropriate');
          suggestions.push('Teach them to balance helping others with their own needs');
        } else {
          suggestions.push('Model and encourage empathy and cooperation in daily interactions');
        }
        break;
        
      case 'neuroticism':
        if (numericScore > 60) {
          suggestions.push('Provide emotional support and teach stress management techniques');
          suggestions.push('Create a calm, predictable home environment');
          suggestions.push('Consider counseling support if anxiety levels are concerning');
        } else {
          suggestions.push('Encourage them to take on age-appropriate challenges');
        }
        break;
    }
  }
  
  // Add general engagement suggestions
  suggestions.push('Maintain open communication about their interests and concerns');
  suggestions.push('Celebrate their unique strengths and progress rather than comparing to others');
  suggestions.push('Collaborate with teachers to ensure consistent support between home and school');
  
  // Remove duplicates and limit to most relevant suggestions
  return Array.from(new Set(suggestions)).slice(0, 6);
}
function getCareerGuidance(careerMatches: any[]): string[] {
  const topCareers = careerMatches.slice(0, 3);
  const guidance: string[] = [];

  if (topCareers.length > 0) {
    const primaryCareer = topCareers[0];
    
    guidance.push(`Focus your coursework and projects toward ${primaryCareer.title} requirements`);
    guidance.push(`Research companies that hire for ${primaryCareer.title} positions and their specific requirements`);
    
    if (primaryCareer.requiredSkills && primaryCareer.requiredSkills.length > 0) {
      guidance.push(`Develop proficiency in key skills: ${primaryCareer.requiredSkills.slice(0, 3).join(', ')}`);
    }
    
    guidance.push(`Connect with professionals working as ${primaryCareer.title} through LinkedIn or informational interviews`);
    
    if (topCareers.length > 1) {
      guidance.push(`Consider ${topCareers[1].title} as an alternative path with similar skill requirements`);
    }
    
    guidance.push('Tailor your resume and cover letters to highlight relevant experiences for your target roles');
    guidance.push('Attend industry events and career fairs related to your field of interest');
  } else {
    // Fallback guidance if no career matches
    guidance.push('Explore various career options through informational interviews and job shadowing');
    guidance.push('Take career assessment tests and consult with career counselors for personalized guidance');
    guidance.push('Build a diverse skill set while discovering your professional interests');
  }

  return guidance;
}
function generateSchoolDevelopmentAreas(aptitudeScores: any, personalityScores: any): string[] {
  const developmentAreas: string[] = [];
  const scoreThreshold = 40; // Lower threshold for school students
  
  // Check aptitude scores for areas needing development
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < scoreThreshold) {
      const aptitudeDevelopment: { [key: string]: string } = {
        logical: 'Critical thinking and problem-solving through puzzles and logic games',
        verbal: 'Reading comprehension and vocabulary through diverse reading materials',
        numerical: 'Math skills through practice problems and real-world applications',
        spatial: 'Visual-spatial skills through drawing, building, and geometry activities',
        mechanical: 'Understanding of how things work through hands-on projects',
        abstract: 'Pattern recognition and creative thinking through art and music'
      };
      
      if (aptitudeDevelopment[aptitude]) {
        developmentAreas.push(aptitudeDevelopment[aptitude]);
      }
    }
  }

  // Check personality scores for areas needing development
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) < 40) {
      const personalityDevelopment: { [key: string]: string } = {
        extroversion: 'Social skills through group activities and team projects',
        conscientiousness: 'Organization and time management through structured routines',
        openness: 'Creativity and curiosity through new experiences and learning',
        agreeableness: 'Teamwork and empathy through collaborative activities',
        neuroticism: 'Emotional regulation through mindfulness and stress management'
      };
      
      if (personalityDevelopment[trait]) {
        developmentAreas.push(personalityDevelopment[trait]);
      }
    }
  }

  // If no specific areas identified, provide general development suggestions
  if (developmentAreas.length === 0) {
    developmentAreas.push(
      'Continue building strong study habits and time management skills',
      'Explore different subjects to discover new interests and talents',
      'Develop communication skills through presentations and group work'
    );
  }

  return developmentAreas.slice(0, 4); // Limit to avoid overwhelming students
}

function generateSchoolRecommendations(careerMatches: any[]) {
  const topCareers = careerMatches.slice(0, 5);
  const recommendations: string[] = [];

  if (topCareers.length > 0) {
    const primaryCareer = topCareers[0];
    
    // Primary career recommendation
    recommendations.push(`Your top career match is ${primaryCareer.title}! This means you might really enjoy work that involves ${primaryCareer.description || 'these types of activities'}.`);
    
    // Subject focus recommendations
    if (primaryCareer.fieldOfStudy) {
      recommendations.push(`Focus on doing well in ${primaryCareer.fieldOfStudy} subjects at school - they'll help you prepare for this career.`);
    }
    
    // Activity recommendations
    recommendations.push(`Look for clubs, activities, or volunteer opportunities related to ${primaryCareer.title.toLowerCase()} to learn more about what it's like.`);
    
    // Skills development
    if (primaryCareer.requiredSkills && primaryCareer.requiredSkills.length > 0) {
      recommendations.push(`Try to develop skills like ${primaryCareer.requiredSkills.slice(0, 2).join(' and ')} through school projects and activities.`);
    }
    
    // Alternative options
    if (topCareers.length > 1) {
      recommendations.push(`Other careers that might interest you include ${topCareers.slice(1, 3).map(c => c.title).join(' and ')}. Keep exploring different options!`);
    }
    
    // General encouragement
    recommendations.push('Remember, you have plenty of time to explore and learn. Try different activities to see what you enjoy most!');
    recommendations.push('Talk to adults who work in jobs that interest you - they can share what their work is really like.');
  } else {
    // Fallback recommendations if no career matches
    recommendations.push('Keep exploring different subjects and activities to discover what interests you most.');
    recommendations.push('Try joining various clubs and activities to learn about different career possibilities.');
    recommendations.push('Talk to your teachers, parents, and other adults about different types of jobs.');
    recommendations.push('Focus on building strong study habits and basic skills that will help in any career.');
  }

  return recommendations;
}
function getInternshipSuggestions(careerMatches: any[]): string[] {
  const topCareers = careerMatches.slice(0, 3);
  const suggestions: string[] = [];

  if (topCareers.length > 0) {
    const primaryCareer = topCareers[0];
    
    // Industry-specific internship suggestions
    suggestions.push(`Seek internships at companies that hire ${primaryCareer.title} professionals`);
    
    // Field-specific suggestions
    if (primaryCareer.fieldOfStudy) {
      suggestions.push(`Look for research opportunities or internships in ${primaryCareer.fieldOfStudy} departments`);
    }
    
    // Skill-building internships
    if (primaryCareer.requiredSkills && primaryCareer.requiredSkills.length > 0) {
      suggestions.push(`Target internships that develop ${primaryCareer.requiredSkills.slice(0, 2).join(' and ')} skills`);
    }
    
    // Alternative career paths
    if (topCareers.length > 1) {
      suggestions.push(`Consider internships in ${topCareers[1].title} roles as an alternative path`);
    }
    
    // General internship advice
    suggestions.push('Apply to both large corporations and smaller companies for diverse experiences');
    suggestions.push('Look for summer programs, co-ops, or part-time internships during the school year');
    suggestions.push('Network with alumni and professionals in your field through career services');
  } else {
    // Fallback suggestions if no career matches
    suggestions.push('Explore internships across different industries to discover your interests');
    suggestions.push('Consider rotational programs that expose you to multiple career paths');
    suggestions.push('Look for general business or research internships to build foundational skills');
  }

  return suggestions;
}
function extractSchoolStrengths(aptitudeScores: any, personalityScores: any, interestScores: any): string[] {
  const strengths: string[] = [];
  const scoreThreshold = 60; // Threshold for identifying strengths in school students
  
  // Extract aptitude-based strengths
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) > scoreThreshold) {
      const aptitudeStrengths: { [key: string]: string } = {
        logical: 'Strong problem-solving and critical thinking abilities',
        verbal: 'Excellent reading and communication skills',
        numerical: 'Great with numbers and mathematical concepts',
        spatial: 'Good at visualizing and working with shapes and spaces',
        mechanical: 'Natural understanding of how things work',
        abstract: 'Creative thinking and pattern recognition skills'
      };
      
      if (aptitudeStrengths[aptitude]) {
        strengths.push(aptitudeStrengths[aptitude]);
      }
    }
  }

  // Extract personality-based strengths
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) > scoreThreshold) {
      const personalityStrengths: { [key: string]: string } = {
        extroversion: 'Outgoing and comfortable working with others',
        conscientiousness: 'Organized, responsible, and good at following through',
        openness: 'Curious, creative, and eager to learn new things',
        agreeableness: 'Kind, helpful, and good at working in teams',
        neuroticism: 'Emotionally aware and sensitive to others\' feelings'
      };
      
      if (personalityStrengths[trait]) {
        strengths.push(personalityStrengths[trait]);
      }
    }
  }

  // Extract interest-based strengths
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([interest]) => interest);

  const interestStrengths: { [key: string]: string } = {
    realistic: 'Enjoys hands-on activities and practical work',
    investigative: 'Loves to explore, research, and figure things out',
    artistic: 'Creative and enjoys expressing ideas in unique ways',
    social: 'Great at helping others and working with people',
    enterprising: 'Natural leadership abilities and enjoys taking charge',
    conventional: 'Good at organizing and managing information'
  };

  topInterests.forEach(interest => {
    if (interestStrengths[interest]) {
      strengths.push(interestStrengths[interest]);
    }
  });

  // If no specific strengths identified, provide encouraging general strengths
  if (strengths.length === 0) {
    strengths.push(
      'Shows potential across multiple areas',
      'Demonstrates well-rounded abilities',
      'Has room to grow and discover hidden talents'
    );
  }

  // Limit to top 5 strengths to keep it focused and encouraging
  return strengths.slice(0, 5);
}
function identifySchoolSkillGaps(aptitudeScores: any) {
  const skillGaps = [];
  const scoreThreshold = 50; // Threshold for school students
  
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < scoreThreshold) {
      skillGaps.push({
        skillArea: aptitude,
        currentLevel: score as number,
        targetLevel: scoreThreshold,
        gap: scoreThreshold - (score as number),
        priority: scoreThreshold - (score as number) > 20 ? 'high' : 'medium',
        developmentSuggestions: getSkillDevelopmentSuggestions(aptitude),
        ageAppropriate: true
      });
    }
  }

  return skillGaps.sort((a, b) => b.gap - a.gap);
}
function generateCollegeRecommendations(careerMatches: any[]): string[] {
  const topCareers = careerMatches.slice(0, 3);
  const recommendations: string[] = [];

  if (topCareers.length > 0) {
    const primaryCareer = topCareers[0];
    
    recommendations.push(`Your strongest career match is ${primaryCareer.title}, which aligns well with your assessment results.`);
    recommendations.push(`Focus your coursework and projects toward developing skills relevant to ${primaryCareer.title} roles.`);
    recommendations.push(`Seek internships or co-op opportunities in companies that hire ${primaryCareer.title} professionals.`);
    
    if (primaryCareer.requiredSkills && primaryCareer.requiredSkills.length > 0) {
      recommendations.push(`Build expertise in ${primaryCareer.requiredSkills.slice(0, 3).join(', ')} through relevant courses and projects.`);
    }
    
    if (topCareers.length > 1) {
      recommendations.push(`Consider ${topCareers[1].title} as an alternative career path with similar requirements.`);
    }
    
    recommendations.push('Connect with professionals in your field of interest through networking events and informational interviews.');
    recommendations.push('Join student organizations and clubs related to your career interests.');
  } else {
    recommendations.push('Continue exploring different career paths through internships and informational interviews.');
    recommendations.push('Focus on building a strong foundation in your major while exploring interdisciplinary opportunities.');
    recommendations.push('Work with career services to identify careers that match your skills and interests.');
  }

  return recommendations;
}
function extractCollegeStrengths(aptitudeScores: any, personalityScores: any, interestScores: any): string[] {
  const strengths: string[] = [];
  const scoreThreshold = 65; // Higher threshold for college students
  
  // Extract aptitude-based strengths
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) > scoreThreshold) {
      const aptitudeStrengths: { [key: string]: string } = {
        logical: 'Advanced analytical and problem-solving capabilities',
        verbal: 'Strong written and oral communication skills',
        numerical: 'Excellent quantitative analysis and mathematical reasoning',
        spatial: 'Superior visual-spatial processing and design thinking',
        mechanical: 'Strong technical aptitude and systems understanding',
        abstract: 'Advanced conceptual thinking and pattern recognition'
      };
      
      if (aptitudeStrengths[aptitude]) {
        strengths.push(aptitudeStrengths[aptitude]);
      }
    }
  }

  // Extract personality-based strengths
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) > scoreThreshold) {
      const personalityStrengths: { [key: string]: string } = {
        extroversion: 'Natural leadership and team collaboration abilities',
        conscientiousness: 'Exceptional organization and project management skills',
        openness: 'Innovation mindset and adaptability to change',
        agreeableness: 'Strong interpersonal skills and emotional intelligence',
        neuroticism: 'High emotional awareness and attention to detail'
      };
      
      if (personalityStrengths[trait]) {
        strengths.push(personalityStrengths[trait]);
      }
    }
  }

  // Extract top interests as strengths
  const topInterests = Object.entries(interestScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([interest]) => interest);

  const interestStrengths: { [key: string]: string } = {
    realistic: 'Practical problem-solving and hands-on implementation skills',
    investigative: 'Research abilities and analytical thinking',
    artistic: 'Creative innovation and design thinking',
    social: 'Leadership and people development capabilities',
    enterprising: 'Business acumen and strategic thinking',
    conventional: 'Process optimization and systematic management'
  };

  topInterests.forEach(interest => {
    if (interestStrengths[interest]) {
      strengths.push(interestStrengths[interest]);
    }
  });

  return strengths.slice(0, 6);
}
function generateCollegeDevelopmentAreas(aptitudeScores: any, personalityScores: any): string[] {
  const developmentAreas: string[] = [];
  const scoreThreshold = 50; // Threshold for college students
  
  // Check aptitude scores for areas needing development
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < scoreThreshold) {
      const aptitudeDevelopment: { [key: string]: string } = {
        logical: 'Critical thinking and analytical reasoning through case studies and problem-solving exercises',
        verbal: 'Communication skills through presentations, writing courses, and debate activities',
        numerical: 'Quantitative skills through statistics, data analysis, and mathematical modeling',
        spatial: 'Design thinking and visualization through CAD software and design projects',
        mechanical: 'Technical understanding through engineering labs and hands-on projects',
        abstract: 'Conceptual thinking through theoretical coursework and research projects'
      };
      
      if (aptitudeDevelopment[aptitude]) {
        developmentAreas.push(aptitudeDevelopment[aptitude]);
      }
    }
  }

  // Check personality scores for areas needing development
  for (const [trait, score] of Object.entries(personalityScores)) {
    if ((score as number) < 50) {
      const personalityDevelopment: { [key: string]: string } = {
        extroversion: 'Leadership and public speaking through student organizations and presentations',
        conscientiousness: 'Time management and organization through project planning and goal setting',
        openness: 'Innovation and creativity through diverse course selection and new experiences',
        agreeableness: 'Collaboration and teamwork through group projects and volunteer work',
        neuroticism: 'Stress management and emotional regulation through counseling and mindfulness practices'
      };
      
      if (personalityDevelopment[trait]) {
        developmentAreas.push(personalityDevelopment[trait]);
      }
    }
  }

  // If no specific areas identified, provide general development suggestions
  if (developmentAreas.length === 0) {
    developmentAreas.push(
      'Continue building professional skills through internships and practical experience',
      'Expand global perspective through study abroad or international experiences',
      'Develop cross-functional knowledge through interdisciplinary courses'
    );
  }

  return developmentAreas.slice(0, 4);
}

function getSkillDevelopmentPlan(aptitudeScores: any): string[] {
  const developmentPlan: string[] = [];
  
  // Analyze aptitude scores and suggest specific development activities
  for (const [aptitude, score] of Object.entries(aptitudeScores)) {
    if ((score as number) < 60) {
      const skillPlans: { [key: string]: string } = {
        logical: 'Enroll in logic, critical thinking, or philosophy courses to strengthen analytical skills',
        verbal: 'Join debate team, take advanced writing courses, or participate in public speaking clubs',
        numerical: 'Take additional mathematics, statistics, or data analysis courses',
        spatial: 'Practice with CAD software, take geometry or design courses, engage in visual arts',
        mechanical: 'Take engineering courses, work on hands-on projects, or join maker spaces',
        abstract: 'Study theoretical subjects, engage in research projects, practice pattern recognition exercises'
      };
      
      if (skillPlans[aptitude]) {
        developmentPlan.push(skillPlans[aptitude]);
      }
    }
  }
  
  // Add general skill development suggestions
  developmentPlan.push('Seek mentorship from professionals in your field of interest');
  developmentPlan.push('Complete relevant online courses or certifications');
  developmentPlan.push('Gain practical experience through internships and project work');
  
  return developmentPlan.slice(0, 5);
}

