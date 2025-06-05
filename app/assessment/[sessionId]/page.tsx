import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AssessmentSection } from '@/components/assessment/assessment-section';
import { AlertTriangle } from 'lucide-react';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function AssessmentSessionPage({ params }: Props) {
  const session = await auth();
  const { sessionId } = await params;
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  let user;
  let assessmentSession;
  let existingAnswers;
  let error = null;

  try {
    // Get user
    user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      redirect('/auth/signin');
    }

    // Get assessment session
    assessmentSession = await prisma.assessmentSession.findUnique({
      where: { 
        id: sessionId,
        userId: user.id 
      },
      include: {
        assessmentType: {
          include: {
            questions: {
              where: { isActive: true },
              orderBy: [{ section: 'asc' }, { order: 'asc' }]
            }
          }
        }
      }
    });

    if (!assessmentSession) {
      error = 'Assessment session not found or you do not have access to it.';
    } else if (assessmentSession.status === 'completed') {
      redirect(`/assessment/${sessionId}/results`);
    }

    // Get existing answers for this session
    if (assessmentSession) {
      existingAnswers = await prisma.answer.findMany({
        where: {
          userId: user.id,
          question: {
            assessmentTypeId: assessmentSession.assessmentTypeId
          }
        },
        select: {
          questionId: true,
          answer: true,
          timeSpent: true
        }
      });
    }

  } catch (err) {
    console.error('Database error:', err);
    error = 'Unable to load assessment session. Please try again.';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <a
              href="/assessment"
              className="block w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start New Assessment
            </a>
            <a
              href="/dashboard"
              className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Determine current section based on session progress or start with first section
  const currentSection = assessmentSession!.currentSection || 'aptitude';
  
  // Filter questions by current section
  const sectionQuestions = assessmentSession!.assessmentType?.questions.filter(
    q => q.section === currentSection
  ) || [];

  // If no questions for current section, move to next section or complete
  if (sectionQuestions.length === 0) {
    const sectionOrder = ['aptitude', 'personality', 'interest'];
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    if (currentIndex < sectionOrder.length - 1) {
      // Move to next section
      const nextSection = sectionOrder[currentIndex + 1];
      const nextSectionQuestions = assessmentSession!.assessmentType?.questions.filter(
        q => q.section === nextSection
      ) || [];
      
      if (nextSectionQuestions.length > 0) {
        // Update session and redirect to next section
        await prisma.assessmentSession.update({
          where: { id: sessionId },
          data: { currentSection: nextSection }
        });
        redirect(`/assessment/${sessionId}`);
      }
    } else {
      // All sections completed, go to results
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: { status: 'completed', completedAt: new Date() }
      });
      redirect(`/assessment/${sessionId}/results`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssessmentSection 
        section={currentSection}
        questions={sectionQuestions}
        existingAnswers={existingAnswers || []}
        sessionId={sessionId}
        userId={user!.id}
      />
    </div>
  );
}
