import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

const APTITUDE_QUESTIONS = [
  // Logical Reasoning (8 questions)
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "If all roses are flowers and some flowers are red, which statement must be true?",
    options: ["All roses are red", "Some roses are red", "All flowers are roses", "Some roses may be red"],
    correctAnswer: 3,
    difficulty: "medium",
    timeLimit: 90,
    order: 1
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "48"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 60,
    order: 2
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "All cats are mammals. Some mammals are pets. Therefore:",
    options: ["All cats are pets", "Some cats are pets", "All pets are cats", "Some cats may be pets"],
    correctAnswer: 3,
    difficulty: "medium",
    timeLimit: 75,
    order: 3
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "Complete the pattern: △, ○, △, ○, △, ?",
    options: ["△", "○", "□", "◇"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 45,
    order: 4
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "If A = 1, B = 2, C = 3, what is the value of CAB?",
    options: ["312", "321", "123", "132"],
    correctAnswer: 0,
    difficulty: "medium",
    timeLimit: 60,
    order: 5
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "Which number doesn't belong: 2, 4, 6, 9, 10?",
    options: ["2", "4", "9", "10"],
    correctAnswer: 2,
    difficulty: "easy",
    timeLimit: 45,
    order: 6
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "If today is Monday, what day will it be 100 days from now?",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    correctAnswer: 1,
    difficulty: "hard",
    timeLimit: 120,
    order: 7
  },
  {
    section: "aptitude",
    subDomain: "logical",
    type: "multiple-choice",
    text: "Find the missing number: 3, 7, 15, 31, ?",
    options: ["47", "55", "63", "71"],
    correctAnswer: 2,
    difficulty: "hard",
    timeLimit: 90,
    order: 8
  },

  // Numerical Ability (8 questions)
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "If a shirt costs $25 and is discounted by 20%, what is the final price?",
    options: ["$20", "$21", "$22", "$23"],
    correctAnswer: 0,
    difficulty: "easy",
    timeLimit: 45,
    order: 9
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "What is 15% of 240?",
    options: ["32", "36", "38", "42"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 30,
    order: 10
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "A pizza is cut into 8 equal slices. If you eat 3 slices, what percentage is left?",
    options: ["37.5%", "62.5%", "60%", "40%"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 60,
    order: 11
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "If x + 5 = 12, what is x?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 30,
    order: 12
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "What is the average of 15, 25, and 35?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 45,
    order: 13
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "If a car travels 60 miles in 1 hour, how far will it travel in 2.5 hours?",
    options: ["120 miles", "130 miles", "140 miles", "150 miles"],
    correctAnswer: 3,
    difficulty: "medium",
    timeLimit: 60,
    order: 14
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "What is 3² + 4²?",
    options: ["12", "18", "24", "25"],
    correctAnswer: 3,
    difficulty: "medium",
    timeLimit: 45,
    order: 15
  },
  {
    section: "aptitude",
    subDomain: "numerical",
    type: "multiple-choice",
    text: "If 5x = 35, what is x?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    difficulty: "easy",
    timeLimit: 30,
    order: 16
  },

  // Verbal Ability (7 questions)
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Choose the word that best completes the analogy: Cat is to Kitten as Dog is to ___",
    options: ["Bark", "Puppy", "Pet", "Animal"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 45,
    order: 17
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Which word is the opposite of 'generous'?",
    options: ["Kind", "Selfish", "Wealthy", "Poor"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 30,
    order: 18
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Choose the correct spelling:",
    options: ["Recieve", "Receive", "Recive", "Receeve"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 30,
    order: 19
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Book is to Library as Car is to ___",
    options: ["Road", "Garage", "Driver", "Engine"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 45,
    order: 20
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Which word doesn't belong: Apple, Orange, Banana, Carrot?",
    options: ["Apple", "Orange", "Banana", "Carrot"],
    correctAnswer: 3,
    difficulty: "easy",
    timeLimit: 30,
    order: 21
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "What does 'procrastinate' mean?",
    options: ["To hurry", "To delay", "To complete", "To organize"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 45,
    order: 22
  },
  {
    section: "aptitude",
    subDomain: "verbal",
    type: "multiple-choice",
    text: "Choose the sentence with correct grammar:",
    options: [
      "Me and my friend went to the store",
      "My friend and I went to the store",
      "My friend and me went to the store",
      "I and my friend went to the store"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 60,
    order: 23
  },

  // Spatial Intelligence (7 questions)
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "If you rotate a square 90 degrees clockwise, which corner that was at the top-left will now be at the top-right?",
    options: ["The same corner", "The bottom-left corner", "The bottom-right corner", "The top-right corner"],
    correctAnswer: 2,
    difficulty: "medium",
    timeLimit: 60,
    order: 24
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "How many faces does a cube have?",
    options: ["4", "6", "8", "12"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 30,
    order: 25
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "If you fold a piece of paper in half twice, how many sections will you have?",
    options: ["2", "3", "4", "8"],
    correctAnswer: 2,
    difficulty: "easy",
    timeLimit: 45,
    order: 26
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "Which shape can be folded into a cube?",
    options: ["Circle", "Cross pattern", "Triangle", "Oval"],
    correctAnswer: 1,
    difficulty: "medium",
    timeLimit: 75,
    order: 27
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "A mirror image of the letter 'b' would look like:",
    options: ["b", "d", "p", "q"],
    correctAnswer: 1,
    difficulty: "easy",
    timeLimit: 30,
    order: 28
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "How many edges does a triangular pyramid have?",
    options: ["3", "4", "6", "9"],
    correctAnswer: 2,
    difficulty: "medium",
    timeLimit: 60,
    order: 29
  },
  {
    section: "aptitude",
    subDomain: "spatial",
    type: "multiple-choice",
    text: "If you look at a clock from behind (mirror view), what time would 3:00 appear to be?",
    options: ["3:00", "9:00", "6:00", "12:00"],
    correctAnswer: 1,
    difficulty: "hard",
    timeLimit: 90,
    order: 30
  }
]

const PERSONALITY_QUESTIONS = [
  // Openness (8 questions)
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I enjoy trying new and different things",
    trait: "openness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 31
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I prefer routine and familiar activities",
    trait: "openness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 32
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I am interested in learning about different cultures",
    trait: "openness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 33
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I enjoy creative activities like art, music, or writing",
    trait: "openness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 34
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I like to stick with what I know works",
    trait: "openness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 35
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I am curious about how things work",
    trait: "openness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 36
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I prefer practical over abstract ideas",
    trait: "openness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 37
  },
  {
    section: "personality",
    subDomain: "openness",
    type: "likert",
    text: "I enjoy discussing philosophical or theoretical questions",
    trait: "openness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 38
  },

  // Conscientiousness (8 questions)
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I always complete my homework on time",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 39
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I am organized and keep my room tidy",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 40
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I often procrastinate on important tasks",
    trait: "conscientiousness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 41
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I set goals and work hard to achieve them",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 42
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I am reliable and keep my promises",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 43
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I tend to be careless with my belongings",
    trait: "conscientiousness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 44
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I like to plan things in advance",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 45
  },
  {
    section: "personality",
    subDomain: "conscientiousness",
    type: "likert",
    text: "I pay attention to details",
    trait: "conscientiousness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 46
  },

  // Extraversion (8 questions)
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I enjoy being the center of attention",
    trait: "extraversion",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 47
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I feel energized when I'm around other people",
    trait: "extraversion",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 48
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I prefer quiet activities to social gatherings",
    trait: "extraversion",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 49
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I am comfortable speaking in front of groups",
    trait: "extraversion",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 50
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I make friends easily",
    trait: "extraversion",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 51
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I prefer working alone rather than in groups",
    trait: "extraversion",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 52
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I am talkative and outgoing",
    trait: "extraversion",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 53
  },
  {
    section: "personality",
    subDomain: "extraversion",
    type: "likert",
    text: "I need time alone to recharge after social activities",
    trait: "extraversion",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 54
  },

  // Agreeableness (8 questions)
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I try to be cooperative and work well with others",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 55
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I am sympathetic to others' feelings",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 56
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I tend to be critical of others",
    trait: "agreeableness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 57
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I trust that most people have good intentions",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 58
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I enjoy helping others",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 59
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I can be somewhat stubborn",
    trait: "agreeableness",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 60
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I try to see the best in people",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 61
  },
  {
    section: "personality",
    subDomain: "agreeableness",
    type: "likert",
    text: "I am forgiving when someone makes a mistake",
    trait: "agreeableness",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 62
  },

  // Neuroticism (8 questions)
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I often feel stressed or anxious",
    trait: "neuroticism",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 63
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I remain calm under pressure",
    trait: "neuroticism",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 64
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I worry about things that might go wrong",
    trait: "neuroticism",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 65
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I am generally optimistic about the future",
    trait: "neuroticism",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 66
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I get upset easily",
    trait: "neuroticism",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 67
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I handle stress well",
    trait: "neuroticism",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 68
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I tend to feel sad or down",
    trait: "neuroticism",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 69
  },
  {
    section: "personality",
    subDomain: "neuroticism",
    type: "likert",
    text: "I bounce back quickly from setbacks",
    trait: "neuroticism",
    isReversed: true,
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    order: 70
  }
]

const INTEREST_QUESTIONS = [
  // Realistic (5 questions)
  {
    section: "interest",
    subDomain: "realistic",
    type: "preference",
    text: "Would you enjoy fixing or building things with your hands?",
    riasecCode: "R",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 71
  },
  {
    section: "interest",
    subDomain: "realistic",
    type: "preference",
    text: "Do you like working outdoors?",
    riasecCode: "R",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 72
  },
  {
    section: "interest",
    subDomain: "realistic",
    type: "preference",
    text: "Would you enjoy working with tools and machinery?",
    riasecCode: "R",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 73
  },
  {
    section: "interest",
    subDomain: "realistic",
    type: "preference",
    text: "Do you like hands-on, practical activities?",
    riasecCode: "R",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 74
  },
  {
    section: "interest",
    subDomain: "realistic",
    type: "preference",
    text: "Would you enjoy careers in construction or manufacturing?",
    riasecCode: "R",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 75
  },

  // Investigative (5 questions)
  {
    section: "interest",
    subDomain: "investigative",
    type: "preference",
    text: "Do you enjoy solving complex problems or puzzles?",
    riasecCode: "I",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 76
  },
  {
    section: "interest",
    subDomain: "investigative",
    type: "preference",
    text: "Are you interested in scientific research and experiments?",
    riasecCode: "I",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 77
  },
  {
    section: "interest",
    subDomain: "investigative",
    type: "preference",
    text: "Do you like analyzing data and information?",
    riasecCode: "I",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 78
  },
  {
    section: "interest",
    subDomain: "investigative",
    type: "preference",
    text: "Would you enjoy working in a laboratory?",
    riasecCode: "I",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 79
  },
  {
    section: "interest",
    subDomain: "investigative",
    type: "preference",
    text: "Are you curious about how things work?",
    riasecCode: "I",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 80
  },

  // Artistic (5 questions)
  {
    section: "interest",
    subDomain: "artistic",
    type: "preference",
    text: "Would you like to write stories, poems, or create art?",
    riasecCode: "A",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 81
  },
  {
    section: "interest",
    subDomain: "artistic",
    type: "preference",
    text: "Do you enjoy music, theater, or other performing arts?",
    riasecCode: "A",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 82
  },
  {
    section: "interest",
    subDomain: "artistic",
    type: "preference",
    text: "Are you interested in fashion or interior design?",
    riasecCode: "A",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 83
  },
  {
    section: "interest",
    subDomain: "artistic",
    type: "preference",
    text: "Do you like creative and imaginative activities?",
    riasecCode: "A",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 84
  },
  {
    section: "interest",
    subDomain: "artistic",
    type: "preference",
    text: "Would you enjoy careers in media or entertainment?",
    riasecCode: "A",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 85
  },

  // Social (5 questions)
  {
    section: "interest",
    subDomain: "social",
    type: "preference",
    text: "Do you enjoy helping others solve their problems?",
    riasecCode: "S",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 86
  },
  {
    section: "interest",
    subDomain: "social",
    type: "preference",
    text: "Are you interested in teaching or training others?",
    riasecCode: "S",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 87
  },
  {
    section: "interest",
    subDomain: "social",
    type: "preference",
    text: "Do you like working with people from different backgrounds?",
    riasecCode: "S",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 88
  },
  {
    section: "interest",
    subDomain: "social",
    type: "preference",
    text: "Would you enjoy counseling or social work?",
    riasecCode: "S",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 89
  },
  {
    section: "interest",
    subDomain: "social",
    type: "preference",
    text: "Are you interested in healthcare or medicine?",
    riasecCode: "S",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 90
  },

  // Enterprising (5 questions)
  {
    section: "interest",
    subDomain: "enterprising",
    type: "preference",
    text: "Would you like to lead a team or organization?",
    riasecCode: "E",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 91
  },
  {
    section: "interest",
    subDomain: "enterprising",
    type: "preference",
    text: "Are you interested in starting your own business?",
    riasecCode: "E",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 92
  },
  {
    section: "interest",
    subDomain: "enterprising",
    type: "preference",
    text: "Do you enjoy persuading others or selling ideas?",
    riasecCode: "E",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 93
  },
  {
    section: "interest",
    subDomain: "enterprising",
    type: "preference",
    text: "Would you like to work in management or administration?",
    riasecCode: "E",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 94
  },
  {
    section: "interest",
    subDomain: "enterprising",
    type: "preference",
    text: "Are you comfortable taking risks for potential rewards?",
    riasecCode: "E",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 95
  },

  // Conventional (5 questions)
  {
    section: "interest",
    subDomain: "conventional",
    type: "preference",
    text: "Do you prefer working with data, numbers, or detailed records?",
    riasecCode: "C",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 96
  },
  {
    section: "interest",
    subDomain: "conventional",
    type: "preference",
    text: "Do you like organizing and keeping track of information?",
    riasecCode: "C",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 97
  },
  {
    section: "interest",
    subDomain: "conventional",
    type: "preference",
    text: "Would you enjoy working in accounting or finance?",
    riasecCode: "C",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 98
  },
  {
    section: "interest",
    subDomain: "conventional",
    type: "preference",
    text: "Do you like following established procedures and guidelines?",
    riasecCode: "C",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 99
  },
  {
    section: "interest",
    subDomain: "conventional",
    type: "preference",
    text: "Are you detail-oriented and careful with accuracy?",
    riasecCode: "C",
    options: ["Not at all", "A little", "Somewhat", "Very much", "Extremely"],
    order: 100
  }
]

const CAREER_DATABASE = [
  {
    title: "Software Developer",
    description: "Design, develop, and maintain computer programs and applications. Work with programming languages to create software solutions for various industries.",
    riasecProfile: { I: 80, A: 60, E: 40, R: 30, S: 20, C: 70 },
    requiredSkills: ["Programming", "Problem Solving", "Logical Thinking", "Attention to Detail", "Teamwork"],
    educationLevel: "bachelor",
    salaryRange: { min: 60000, max: 120000, median: 85000 },
    growthOutlook: "excellent",
    workEnvironment: "office",
    personalityFit: { openness: 75, conscientiousness: 80, extraversion: 45, agreeableness: 60, neuroticism: 35 },
    industry: "Technology",
    workStyle: "independent"
  },
  {
    title: "Teacher",
    description: "Educate and inspire students in academic subjects. Plan lessons, assess student progress, and create supportive learning environments.",
    riasecProfile: { S: 85, A: 60, E: 70, I: 50, C: 60, R: 20 },
    requiredSkills: ["Communication", "Patience", "Leadership", "Subject Knowledge", "Classroom Management"],
    educationLevel: "bachelor",
    salaryRange: { min: 40000, max: 70000, median: 55000 },
    growthOutlook: "good",
    workEnvironment: "classroom",
    personalityFit: { extraversion: 70, agreeableness: 80, conscientiousness: 75, openness: 65, neuroticism: 40 },
    industry: "Education",
    workStyle: "team"
  },
  {
    title: "Graphic Designer",
    description: "Create visual concepts and designs for various media including websites, advertisements, magazines, and product packaging.",
    riasecProfile: { A: 90, E: 60, I: 40, S: 30, C: 50, R: 20 },
    requiredSkills: ["Creativity", "Visual Design", "Software Proficiency", "Communication", "Color Theory"],
    educationLevel: "associate",
    salaryRange: { min: 35000, max: 65000, median: 50000 },
    growthOutlook: "average",
    workEnvironment: "office",
    personalityFit: { openness: 85, conscientiousness: 70, extraversion: 55, agreeableness: 65, neuroticism: 45 },
    industry: "Creative",
    workStyle: "independent"
  },
  {
    title: "Nurse",
    description: "Provide healthcare services to patients, assist doctors, monitor patient conditions, and educate patients about health maintenance.",
    riasecProfile: { S: 90, I: 60, C: 70, E: 50, A: 30, R: 40 },
    requiredSkills: ["Healthcare Knowledge", "Empathy", "Communication", "Critical Thinking", "Physical Stamina"],
    educationLevel: "associate",
    salaryRange: { min: 55000, max: 85000, median: 70000 },
    growthOutlook: "excellent",
    workEnvironment: "hospital",
    personalityFit: { agreeableness: 85, conscientiousness: 80, extraversion: 60, openness: 65, neuroticism: 35 },
    industry: "Healthcare",
    workStyle: "team"
  },
  {
    title: "Marketing Manager",
    description: "Develop and implement marketing strategies, manage advertising campaigns, analyze market trends, and coordinate with sales teams.",
    riasecProfile: { E: 85, A: 70, S: 60, I: 55, C: 65, R: 20 },
    requiredSkills: ["Strategic Thinking", "Communication", "Data Analysis", "Creativity", "Leadership"],
    educationLevel: "bachelor",
    salaryRange: { min: 50000, max: 95000, median: 72000 },
    growthOutlook: "good",
    workEnvironment: "office",
    personalityFit: { extraversion: 80, openness: 75, conscientiousness: 70, agreeableness: 65, neuroticism: 40 },
    industry: "Business",
    workStyle: "leadership"
  },
  {
    title: "Mechanical Engineer",
    description: "Design, develop, and test mechanical devices including engines, machines, and tools. Solve engineering problems and improve existing systems.",
    riasecProfile: { I: 85, R: 80, C: 70, E: 50, A: 40, S: 30 },
    requiredSkills: ["Engineering Principles", "Problem Solving", "Mathematics", "CAD Software", "Project Management"],
    educationLevel: "bachelor",
    salaryRange: { min: 65000, max: 110000, median: 87000 },
    growthOutlook: "good",
    workEnvironment: "office",
    personalityFit: { openness: 75, conscientiousness: 85, extraversion: 50, agreeableness: 60, neuroticism: 35 },
    industry: "Engineering",
    workStyle: "independent"
  },
  {
    title: "Psychologist",
    description: "Study human behavior and mental processes, provide therapy and counseling, conduct research, and help people overcome psychological challenges.",
    riasecProfile: { S: 85, I: 80, A: 50, E: 60, C: 65, R: 20 },
    requiredSkills: ["Active Listening", "Empathy", "Research Skills", "Critical Thinking", "Communication"],
    educationLevel: "master",
    salaryRange: { min: 55000, max: 95000, median: 75000 },
    growthOutlook: "good",
    workEnvironment: "office",
    personalityFit: { agreeableness: 80, openness: 80, conscientiousness: 75, extraversion: 65, neuroticism: 35 },
    industry: "Healthcare",
    workStyle: "independent"
  },
  {
    title: "Chef",
    description: "Plan menus, prepare food, manage kitchen staff, ensure food quality and safety, and create new recipes and cooking techniques.",
    riasecProfile: { A: 75, R: 70, E: 65, S: 50, I: 40, C: 55 },
    requiredSkills: ["Culinary Skills", "Creativity", "Time Management", "Leadership", "Food Safety"],
    educationLevel: "high_school",
    salaryRange: { min: 35000, max: 75000, median: 55000 },
    growthOutlook: "average",
    workEnvironment: "kitchen",
    personalityFit: { openness: 70, conscientiousness: 75, extraversion: 60, agreeableness: 65, neuroticism: 45 },
    industry: "Hospitality",
    workStyle: "leadership"
  },
  {
    title: "Accountant",
    description: "Prepare and examine financial records, ensure accuracy of financial transactions, compute taxes, and provide financial advice to clients.",
    riasecProfile: { C: 90, I: 60, E: 50, S: 40, A: 20, R: 25 },
    requiredSkills: ["Mathematical Skills", "Attention to Detail", "Analytical Thinking", "Financial Software", "Ethics"],
    educationLevel: "bachelor",
    salaryRange: { min: 45000, max: 80000, median: 62000 },
    growthOutlook: "average",
    workEnvironment: "office",
    personalityFit: { conscientiousness: 90, openness: 55, extraversion: 45, agreeableness: 70, neuroticism: 35 },
    industry: "Finance",
    workStyle: "independent"
  },
  {
    title: "Police Officer",
    description: "Protect and serve the community, enforce laws, investigate crimes, respond to emergencies, and maintain public safety.",
    riasecProfile: { S: 75, E: 70, R: 65, C: 60, I: 50, A: 30 },
    requiredSkills: ["Physical Fitness", "Communication", "Decision Making", "Conflict Resolution", "Law Knowledge"],
    educationLevel: "high_school",
    salaryRange: { min: 45000, max: 75000, median: 60000 },
    growthOutlook: "average",
    workEnvironment: "community",
    personalityFit: { extraversion: 70, conscientiousness: 80, agreeableness: 70, openness: 60, neuroticism: 30 },
    industry: "Public Service",
    workStyle: "team"
  },
  {
    title: "Veterinarian",
    description: "Diagnose and treat illnesses and injuries in animals, perform surgeries, provide preventive care, and educate pet owners about animal health.",
    riasecProfile: { I: 80, S: 75, R: 60, C: 65, A: 40, E: 50 },
    requiredSkills: ["Medical Knowledge", "Animal Handling", "Empathy", "Problem Solving", "Manual Dexterity"],
    educationLevel: "phd",
    salaryRange: { min: 70000, max: 120000, median: 95000 },
    growthOutlook: "good",
    workEnvironment: "clinic",
    personalityFit: { agreeableness: 80, conscientiousness: 85, openness: 70, extraversion: 60, neuroticism: 35 },
    industry: "Healthcare",
    workStyle: "independent"
  },
  {
    title: "Journalist",
    description: "Research, write, and report news stories, conduct interviews, investigate issues, and inform the public about current events and topics of interest.",
    riasecProfile: { A: 80, S: 70, I: 70, E: 75, C: 55, R: 25 },
    requiredSkills: ["Writing", "Research", "Communication", "Critical Thinking", "Interviewing"],
    educationLevel: "bachelor",
    salaryRange: { min: 35000, max: 70000, median: 52000 },
    growthOutlook: "poor",
    workEnvironment: "office",
    personalityFit: { openness: 85, extraversion: 75, conscientiousness: 70, agreeableness: 65, neuroticism: 45 },
    industry: "Media",
    workStyle: "independent"
  },
  {
    title: "Physical Therapist",
    description: "Help patients recover from injuries and improve their physical abilities through therapeutic exercises, treatments, and rehabilitation programs.",
    riasecProfile: { S: 85, I: 65, R: 60, C: 60, E: 55, A: 40 },
    requiredSkills: ["Anatomy Knowledge", "Patient Care", "Manual Therapy", "Communication", "Motivational Skills"],
    educationLevel: "master",
    salaryRange: { min: 70000, max: 100000, median: 85000 },
    growthOutlook: "excellent",
    workEnvironment: "clinic",
    personalityFit: { agreeableness: 80, conscientiousness: 75, extraversion: 70, openness: 65, neuroticism: 35 },
    industry: "Healthcare",
    workStyle: "independent"
  },
  {
    title: "Data Scientist",
    description: "Analyze complex data sets to identify patterns and trends, create predictive models, and provide insights to help organizations make data-driven decisions.",
    riasecProfile: { I: 90, C: 80, A: 50, E: 45, S: 40, R: 35 },
    requiredSkills: ["Statistics", "Programming", "Data Visualization", "Machine Learning", "Critical Thinking"],
    educationLevel: "bachelor",
    salaryRange: { min: 75000, max: 130000, median: 102000 },
    growthOutlook: "excellent",
    workEnvironment: "office",
    personalityFit: { openness: 85, conscientiousness: 80, extraversion: 45, agreeableness: 60, neuroticism: 35 },
    industry: "Technology",
    workStyle: "independent"
  },
  {
    title: "Social Worker",
    description: "Help individuals and families cope with challenges, connect clients with resources and services, advocate for social justice, and support community well-being.",
    riasecProfile: { S: 90, E: 65, I: 55, C: 60, A: 45, R: 25 },
    requiredSkills: ["Empathy", "Communication", "Case Management", "Advocacy", "Cultural Competence"],
    educationLevel: "bachelor",
    salaryRange: { min: 40000, max: 65000, median: 52000 },
    growthOutlook: "good",
    workEnvironment: "community",
    personalityFit: { agreeableness: 85, extraversion: 70, conscientiousness: 75, openness: 75, neuroticism: 40 },
    industry: "Social Services",
    workStyle: "team"
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
    await prisma.career.deleteMany({})
    await prisma.systemSettings.deleteMany({})

    // Seed questions
    console.log('📚 Seeding questions...')
    const allQuestions = [...APTITUDE_QUESTIONS, ...PERSONALITY_QUESTIONS, ...INTEREST_QUESTIONS]
    
    for (const questionData of allQuestions) {
      const options = questionData.options;
      const correctAnswer = (questionData as any).correctAnswer;
      const isReversed = (questionData as any).isReversed;
      
      // For aptitude questions, embed the correct answer in options
      let finalOptions: any = options;
      if (questionData.section === 'aptitude' && correctAnswer !== undefined) {
        finalOptions = { options, correctAnswer };
      } else if (questionData.section === 'personality' && isReversed) {
        finalOptions = { options, isReversed };
      } else {
        finalOptions = options;
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
          riasecCode: (questionData as any).riasecCode || null
        }
      })
    }

    // Seed careers
    console.log('💼 Seeding careers...')
    for (const careerData of CAREER_DATABASE) {
      await prisma.career.create({
        data: careerData
      })
    }

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

    // Create admin user
    console.log('👤 Creating admin user...')
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        age: 30
      }
    })

    console.log('✅ Seed completed successfully!')
    console.log(`📊 Created ${allQuestions.length} questions`)
    console.log(`💼 Created ${CAREER_DATABASE.length} careers`)
    console.log('⚙️ Created system settings')
    console.log('👤 Created admin user')

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