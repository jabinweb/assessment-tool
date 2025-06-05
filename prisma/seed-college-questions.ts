import { PrismaClient } from '@prisma/client'

export async function seedCollegeQuestions(prisma: PrismaClient, assessmentTypeId: string) {

  const COLLEGE_APTITUDE_QUESTIONS = [
    {
      section: "aptitude",
      subDomain: "logical",
      type: "multiple-choice", 
      text: "In a research study, if all participants who received Treatment A showed improvement, and some participants who showed improvement were in the control group, which conclusion is valid?",
      options: [
        "All improved participants received Treatment A",
        "Treatment A is effective for all participants", 
        "Some participants in the control group may have improved without treatment",
        "The control group was ineffective"
      ],
      correctAnswer: 2,
      difficulty: "hard",
      timeLimit: 120,
      complexity: "advanced",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 1
    },
    {
      section: "aptitude",
      subDomain: "analytical",
      type: "multiple-choice",
      text: "A company's revenue increased by 15% in Q1, decreased by 8% in Q2, and increased by 12% in Q3. If the starting revenue was $100,000, what is the revenue at the end of Q3?",
      options: ["$118,564", "$119,840", "$121,296", "$123,200"],
      correctAnswer: 0,
      difficulty: "hard",
      timeLimit: 180,
      complexity: "advanced",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 2
    }
    // Add 33 more advanced aptitude questions...
  ]

  const COLLEGE_PERSONALITY_QUESTIONS = [
    {
      section: "personality",
      subDomain: "leadership",
      type: "likert",
      text: "In group projects, I naturally take on the role of coordinating team efforts and ensuring deadlines are met",
      trait: "leadership",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      complexity: "intermediate",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 31
    },
    {
      section: "personality",
      subDomain: "teamwork",
      type: "likert",
      text: "I prefer collaborative work environments where diverse perspectives contribute to innovative solutions",
      trait: "teamwork",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      complexity: "intermediate",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 32
    }
    // Add 33 more personality questions...
  ]

  const COLLEGE_INTEREST_QUESTIONS = [
    {
      section: "interest",
      subDomain: "investigative",
      type: "preference",
      text: "How interested are you in conducting original research that could contribute to academic or scientific knowledge?",
      riasecCode: "I",
      options: ["Not at all interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"],
      complexity: "intermediate",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 71
    },
    {
      section: "interest",
      subDomain: "enterprising",
      type: "preference",
      text: "How appealing is the prospect of leading a startup company and managing business operations?",
      riasecCode: "E", 
      options: ["Not appealing", "Slightly appealing", "Moderately appealing", "Very appealing", "Extremely appealing"],
      complexity: "intermediate",
      targetAudience: ["college_student"],
      ageGroup: ["18-22", "22+"],
      educationLevel: ["college"],
      order: 72
    }
    // Add 38 more interest questions...
  ]

  // Insert all questions with assessmentTypeId
  const allCollegeQuestions = [
    ...COLLEGE_APTITUDE_QUESTIONS,
    ...COLLEGE_PERSONALITY_QUESTIONS,
    ...COLLEGE_INTEREST_QUESTIONS
  ]

  for (const questionData of allCollegeQuestions) {
    const options = questionData.options
    const correctAnswer = (questionData as any).correctAnswer
    const isReversed = (questionData as any).isReversed

    let finalOptions: any = options
    if (questionData.section === 'aptitude' && correctAnswer !== undefined) {
      finalOptions = { options, correctAnswer }
    } else if (questionData.section === 'personality' && isReversed) {
      finalOptions = { options, isReversed }
    } else {
      finalOptions = options
    }

    await prisma.question.create({
      data: {
        section: questionData.section,
        subDomain: questionData.subDomain,
        type: questionData.type,
        text: questionData.text,
        options: finalOptions,
        order: questionData.order,
        timeLimit: (questionData as any).timeLimit || null,
        difficulty: (questionData as any).difficulty || null,
        trait: (questionData as any).trait || null,
        riasecCode: (questionData as any).riasecCode || null,
        targetAudience: questionData.targetAudience,
        ageGroup: questionData.ageGroup,
        educationLevel: questionData.educationLevel,
        complexity: questionData.complexity,
        assessmentTypeId: assessmentTypeId
      }
    })
  }

  console.log(`✅ Created ${allCollegeQuestions.length} college questions`)
}
