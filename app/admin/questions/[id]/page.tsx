import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { QuestionDetail } from '@/components/admin/questions/question-detail';

interface Props {
  params: {
    id: string;
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: {
      answers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!question) {
    redirect('/admin/questions?error=not-found');
  }

  // Get answer statistics
  const answerStats = await prisma.answer.groupBy({
    by: ['answer'],
    where: { questionId: question.id },
    _count: {
      id: true
    }
  });

  return <QuestionDetail question={question} answerStats={answerStats} />;
}
