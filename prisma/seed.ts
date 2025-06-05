import { PrismaClient } from '@prisma/client'
import { seedSchoolQuestions } from './seed-school-questions'
import { seedCollegeQuestions } from './seed-college-questions'
import { seedSchoolCareers } from './seed-school-careers'
import { seedCollegeCareers } from './seed-college-careers'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const ASSESSMENT_TYPES = [
  {
    name: "School Student Assessment",
    code: "school_student",
    description: "Career exploration assessment designed for high school students (grades 9-12). Focuses on broad interest areas, basic aptitude testing, and educational pathway guidance.",
    targetAudience: "school_student",
    ageGroup: ["13-15", "16-18"],
    educationLevel: "school",
    isActive: true,
    isDefault: true,
    totalDuration: 90, // 1.5 hours
    sectionsConfig: {
      aptitude: {
        questionCount: 25,
        timeLimit: 35,
        weight: 0.3,
        subdomains: ["logical", "numerical", "verbal", "spatial"]
      },
      personality: {
        questionCount: 25,
        timeLimit: 20,
        weight: 0.3,
        traits: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
      },
      interest: {
        questionCount: 30,
        timeLimit: 25,
        weight: 0.4,
        categories: ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]
      }
    },
    scoringWeights: {
      aptitude: 0.3,
      personality: 0.3,
      interest: 0.4
    },
    displayStyle: "visual",
    useVisualAids: true,
    useGamification: true,
    languageLevel: "simple",
    reportStyle: "simplified",
    includeParentSummary: true,
    includeCounselorNotes: true
  },
  {
    name: "College Student Assessment",
    code: "college_student", 
    description: "Comprehensive career assessment for college students and young professionals. Includes advanced aptitude testing, detailed personality analysis, and specific career matching.",
    targetAudience: "college_student",
    ageGroup: ["18-22", "22+"],
    educationLevel: "college",
    isActive: true,
    isDefault: false,
    totalDuration: 120, // 2 hours
    sectionsConfig: {
      aptitude: {
        questionCount: 35,
        timeLimit: 50,
        weight: 0.35,
        subdomains: ["logical", "numerical", "verbal", "spatial", "analytical"]
      },
      personality: {
        questionCount: 35,
        timeLimit: 30,
        weight: 0.35,
        traits: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism", "leadership", "teamwork"]
      },
      interest: {
        questionCount: 40,
        timeLimit: 35,
        weight: 0.3,
        categories: ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]
      }
    },
    scoringWeights: {
      aptitude: 0.35,
      personality: 0.35,
      interest: 0.3
    },
    displayStyle: "standard",
    useVisualAids: false,
    useGamification: false,
    languageLevel: "intermediate",
    reportStyle: "standard",
    includeParentSummary: false,
    includeCounselorNotes: false
  }
]

const SYSTEM_SETTINGS = {
  scoringWeights: {
    aptitude: 25,
    personality: 35,
    interest: 40
  },
  timeouts: {
    sessionTimeout: 30,
    assessmentTimeout: 60
  },
  features: {
    allowRetakes: false,
    showProgressBar: true,
    randomizeQuestions: false,
    emailNotifications: true
  },
  emailTemplates: {
    welcome: "Welcome to the Career Assessment Tool!",
    completion: "Congratulations on completing your assessment!",
    reminder: "Don't forget to complete your career assessment."
  },
  careerMatchingWeights: {
    interest: 0.4,
    personality: 0.35,
    aptitude: 0.25
  }
}

async function main() {
  console.log('🌱 Starting seed...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.answer.deleteMany({})
    await prisma.report.deleteMany({})
    await prisma.question.deleteMany({})
    await prisma.assessmentType.deleteMany({})
    await prisma.career.deleteMany({})
    await prisma.systemSettings.deleteMany({})

    // Seed Assessment Types
    console.log('🎯 Seeding assessment types...')
    const assessmentTypes = []
    for (const typeData of ASSESSMENT_TYPES) {
      const assessmentType = await prisma.assessmentType.create({
        data: {
          name: typeData.name,
          code: typeData.code,
          description: typeData.description,
          targetAudience: typeData.targetAudience,
          ageGroup: typeData.ageGroup,
          educationLevel: typeData.educationLevel,
          isActive: typeData.isActive,
          isDefault: typeData.isDefault,
          totalDuration: typeData.totalDuration,
          sectionsConfig: typeData.sectionsConfig,
          scoringWeights: typeData.scoringWeights,
          displayStyle: typeData.displayStyle,
          useVisualAids: typeData.useVisualAids,
          useGamification: typeData.useGamification,
          languageLevel: typeData.languageLevel,
          reportStyle: typeData.reportStyle,
          includeParentSummary: typeData.includeParentSummary,
          includeCounselorNotes: typeData.includeCounselorNotes,
          createdBy: 'system'
        }
      })
      assessmentTypes.push(assessmentType)
      console.log(`✅ Created assessment type: ${assessmentType.name}`)
    }

    // Seed questions for each assessment type
    console.log('📚 Seeding questions...')
    
    // Get assessment types
    const schoolAssessmentType = assessmentTypes.find(at => at.code === 'school_student')
    const collegeAssessmentType = assessmentTypes.find(at => at.code === 'college_student')

    if (schoolAssessmentType) {
      console.log('🏫 Seeding school student questions...')
      await seedSchoolQuestions(prisma, schoolAssessmentType.id)
    }

    if (collegeAssessmentType) {
      console.log('🎓 Seeding college student questions...')
      await seedCollegeQuestions(prisma, collegeAssessmentType.id)
    }

    // Seed careers for each assessment type
    console.log('💼 Seeding careers...')
    
    console.log('🏫 Seeding school careers...')
    await seedSchoolCareers(prisma)
    
    console.log('🎓 Seeding college careers...')
    await seedCollegeCareers(prisma)

    // Seed system settings
    console.log('⚙️ Seeding system settings...')
    await prisma.systemSettings.create({
      data: {
        id: 'system',
        scoringWeights: SYSTEM_SETTINGS.scoringWeights,
        timeouts: SYSTEM_SETTINGS.timeouts,
        features: SYSTEM_SETTINGS.features,
        emailTemplates: SYSTEM_SETTINGS.emailTemplates,
        careerMatchingWeights: SYSTEM_SETTINGS.careerMatchingWeights,
        updatedBy: 'system'
      }
    })

    console.log('✅ Seed completed successfully!')
    console.log(`🎯 Created ${ASSESSMENT_TYPES.length} assessment types`)
    console.log('⚙️ Created system settings')

  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })