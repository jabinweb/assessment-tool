import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { questionId, answer, timeSpent } = await request.json();

    // Get the current assessment version
    const currentAssessment = await prisma.assessmentSession.findFirst({
      where: {
        userId: user.id,
        status: 'in_progress'
      },
      orderBy: { startedAt: 'desc' }
    });

    const version = currentAssessment?.version || 1;

    // Get question details for scoring
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Calculate score based on question type
    let score = 0;
    let isCorrect = null;
    let rawScore = 0;

    if (question.type === 'multiple-choice' && question.section === 'aptitude') {
      // For aptitude questions, check if answer is correct
      let options;
      let correctAnswer;
      
      try {
        // Handle both string and object JSON data
        const questionOptions = typeof question.options === 'string' 
          ? JSON.parse(question.options) 
          : question.options;
        
        // Check if it's the nested structure with options and correctAnswer
        if (questionOptions.options && Array.isArray(questionOptions.options)) {
          options = questionOptions.options;
          correctAnswer = questionOptions.correctAnswer;
        } else if (Array.isArray(questionOptions)) {
          // Direct array of options with isCorrect property
          options = questionOptions;
          correctAnswer = options.findIndex((opt: any) => opt.isCorrect === true);
        } else {
          console.error('Unexpected options structure:', questionOptions);
          options = [];
          correctAnswer = -1;
        }
      } catch (e) {
        console.error('Failed to parse question options:', e);
        options = [];
        correctAnswer = -1;
      }

      isCorrect = parseInt(answer) === correctAnswer;
      score = isCorrect ? 1 : 0;
      rawScore = score;
    } else if (question.type === 'likert') {
      // For personality/interest questions, normalize score
      const maxValue = 5; // Assuming 5-point Likert scale
      score = parseInt(answer) / maxValue;
      rawScore = parseInt(answer);
    }

    // Save or update answer using the correct unique constraint
    await prisma.answer.upsert({
      where: {
        userId_questionId_version: {
          userId: user.id,
          questionId: questionId,
          version: version
        }
      },
      update: {
        answer: answer.toString(),
        score: score,
        timeSpent: timeSpent,
        isCorrect: isCorrect,
        rawScore: rawScore
      },
      create: {
        userId: user.id,
        questionId: questionId,
        answer: answer.toString(),
        score: score,
        version: version,
        timeSpent: timeSpent,
        isCorrect: isCorrect,
        rawScore: rawScore
      }
    });

    // Update assessment session progress
    if (currentAssessment) {
      const answeredCount = await prisma.answer.count({
        where: {
          userId: user.id,
          version: version,
          question: {
            section: currentAssessment.section
          }
        }
      });

      await prisma.assessmentSession.update({
        where: { id: currentAssessment.id },
        data: {
          answeredCount: answeredCount,
          timeSpent: currentAssessment.timeSpent + (timeSpent || 0)
        }
      });
    }

    return NextResponse.json({
      message: 'Answer saved successfully',
      score: score
    });

  } catch (error) {
    console.error('Assessment answer error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}