import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ResultsDisplay } from '@/components/results/results-display';

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ResultsPage({ params }: Props) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user is accessing their own results or is admin
  // if (user.id !== userId && user.role !== 'admin') {
  //   redirect('/results');
  // }

  // Get the report for the specified user
  const report = await prisma.report.findFirst({
    where: { userId }
  });

  if (!report) {
    redirect('/assessment/start');
  }

  // Get the target user for the report
  const targetUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ResultsDisplay 
        report={report} 
        userName={targetUser?.name || 'Student'} 
      />
    </div>
  );
}