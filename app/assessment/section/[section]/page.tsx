import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AssessmentSection } from '@/components/assessment/assessment-section';

interface Props {
  params: Promise<{
    section: string;
  }>;
}

export default async function AssessmentSectionPage({ params }: Props) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const { section } = await params;

  // Validate section
  if (!['aptitude', 'personality', 'interest'].includes(section)) {
    redirect('/assessment/start');
  }

  let user;
  let questions = [];
  let existingAnswers = [];
  let assessmentSession = null;

  try {
    // Get user
    user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      redirect('/auth/login');
    }

    // Get questions for the section with proper JSON handling
    const rawQuestions = await prisma.question.findMany({
      where: { section },
      orderBy: { order: 'asc' }
    });

    console.log(`Found ${rawQuestions.length} questions for section: ${section}`);

    // If no questions found, check if we need to seed the database
    if (rawQuestions.length === 0) {
      console.log('No questions found, redirecting to start with error');
      redirect('/assessment/start?error=no_questions');
    }

    // Ensure options are properly formatted for client-side consumption
    questions = rawQuestions.map(question => ({
      ...question,
      options: typeof question.options === 'string' 
        ? JSON.parse(question.options) 
        : question.options
    }));

    // Get existing answers for this section
    existingAnswers = await prisma.answer.findMany({
      where: {
        userId: user.id,
        question: { section }
      },
      include: { question: true }
    });

    // Get or create assessment session
    assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        userId: user.id,
        section,
        status: 'in_progress'
      }
    });

    if (!assessmentSession) {
      assessmentSession = await prisma.assessmentSession.create({
        data: {
          userId: user.id,
          section,
          status: 'in_progress',
          totalQuestions: questions.length,
          answeredCount: existingAnswers.length
        }
      });
    }

  } catch (error) {
    console.error('Database error in assessment section:', error);
    redirect('/assessment/start?error=database_error');
  }

  // Safety check - ensure we have questions
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">No Questions Available</h2>
          <p className="text-yellow-700 mb-4">
            There are no questions available for the {section} section at this time.
          </p>
          <p className="text-yellow-600 text-sm mb-4">
            This might be because the database hasn't been seeded with questions yet.
          </p>
          <a
            href="/assessment/start"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Assessment Start
          </a>
        </div>
      </div>
    );
  }

  return (
    <AssessmentSection
      section={section}
      questions={questions}
      existingAnswers={existingAnswers}
      sessionId={assessmentSession.id}
      userId={user.id}
    />
  );
}
