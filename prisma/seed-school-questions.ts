import { PrismaClient } from '@prisma/client'

export async function seedSchoolQuestions(prisma: PrismaClient, assessmentTypeId: string) {
  
  const SCHOOL_APTITUDE_QUESTIONS = [
    // Logical Reasoning - simplified for school students
    {
      section: "aptitude",
      subDomain: "logical",
      type: "multiple-choice",
      text: "Look at this pattern: ★, ♦, ★, ♦, ★, ?  What comes next?",
      schoolFriendlyText: "What shape comes next in this pattern?",
      options: ["★", "♦", "●", "▲"],
      correctAnswer: 1,
      difficulty: "easy",
      timeLimit: 45,
      complexity: "basic",
      visualAid: { type: "pattern", shapes: ["star", "diamond"] },
      examples: ["Like completing a puzzle pattern"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 1
    },
    {
      section: "aptitude",
      subDomain: "logical",
      type: "multiple-choice",
      text: "If all dogs are animals and some animals are pets, which is true?",
      schoolFriendlyText: "Think about dogs, animals, and pets. Which statement makes sense?",
      options: ["All dogs are pets", "Some dogs might be pets", "All pets are dogs", "No dogs are animals"],
      correctAnswer: 1,
      difficulty: "medium",
      timeLimit: 60,
      complexity: "basic",
      visualAid: { type: "venn_diagram", categories: ["dogs", "animals", "pets"] },
      examples: ["Think about your own pets or pets you know"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 2
    },
    // Add more logical questions...
    
    // Numerical - school level math
    {
      section: "aptitude",
      subDomain: "numerical",
      type: "multiple-choice",
      text: "You buy a game that costs $20. If you get a 25% discount, how much do you pay?",
      schoolFriendlyText: "A video game costs $20, but you have a 25% off coupon. What's your final price?",
      options: ["$15", "$16", "$17", "$18"],
      correctAnswer: 0,
      difficulty: "easy", 
      timeLimit: 60,
      complexity: "basic",
      visualAid: { type: "money", original: 20, discount: 25 },
      examples: ["Like shopping with a discount coupon"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 10
    },
    {
      section: "aptitude",
      subDomain: "numerical",
      type: "multiple-choice",
      text: "In your class of 30 students, 18 like pizza. What percentage likes pizza?",
      schoolFriendlyText: "If 18 out of 30 classmates like pizza, what percentage is that?",
      options: ["50%", "60%", "70%", "80%"],
      correctAnswer: 1,
      difficulty: "medium",
      timeLimit: 75,
      complexity: "basic",
      visualAid: { type: "pie_chart", total: 30, part: 18 },
      examples: ["Like counting how many friends like the same things"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 11
    }
    // Add 20 more aptitude questions...
  ]

  const SCHOOL_PERSONALITY_QUESTIONS = [
    {
      section: "personality",
      subDomain: "openness",
      type: "likert",
      text: "I like trying new foods from different countries",
      schoolFriendlyText: "I enjoy trying foods I've never had before",
      trait: "openness",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      complexity: "basic",
      visualAid: { type: "emoji_scale", emojis: ["😟", "😐", "🙂", "😊", "😍"] },
      examples: ["Like trying sushi, tacos, or Indian food for the first time"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 31
    },
    {
      section: "personality",
      subDomain: "conscientiousness",
      type: "likert",
      text: "I always do my homework before playing games or watching TV",
      schoolFriendlyText: "I finish my homework before doing fun activities",
      trait: "conscientiousness",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      complexity: "basic",
      visualAid: { type: "emoji_scale", emojis: ["😟", "😐", "🙂", "😊", "😍"] },
      examples: ["Like doing assignments before playing video games"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 32
    }
    // Add 23 more personality questions...
  ]

  const SCHOOL_INTEREST_QUESTIONS = [
    {
      section: "interest",
      subDomain: "realistic",
      type: "preference",
      text: "How much would you enjoy building things with LEGO or crafts?",
      schoolFriendlyText: "Do you like building and making things with your hands?",
      riasecCode: "R",
      options: ["Hate it", "Don't like it", "It's okay", "Like it", "Love it"],
      complexity: "basic",
      visualAid: { type: "activity_icons", icons: ["lego", "crafts", "building"] },
      examples: ["Like building LEGO sets, making art projects, or fixing things"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 71
    },
    {
      section: "interest", 
      subDomain: "investigative",
      type: "preference",
      text: "How interested are you in science experiments and discovering how things work?",
      schoolFriendlyText: "Do you like science experiments and figuring out how stuff works?",
      riasecCode: "I",
      options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
      complexity: "basic",
      visualAid: { type: "activity_icons", icons: ["microscope", "experiment", "research"] },
      examples: ["Like chemistry experiments, taking apart gadgets, or science fairs"],
      targetAudience: ["school_student"],
      ageGroup: ["13-15", "16-18"],
      educationLevel: ["school"],
      order: 72
    }
    // Add 28 more interest questions...
  ]

  // Insert all questions with assessmentTypeId
  const allSchoolQuestions = [
    ...SCHOOL_APTITUDE_QUESTIONS,
    ...SCHOOL_PERSONALITY_QUESTIONS,
    ...SCHOOL_INTEREST_QUESTIONS
  ]

  for (const questionData of allSchoolQuestions) {
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
        assessmentTypeId: assessmentTypeId
      }
    })
  }

  console.log(`✅ Created ${allSchoolQuestions.length} school questions`)
}
