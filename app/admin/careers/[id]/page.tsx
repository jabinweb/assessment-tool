import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CareerDetailView } from '@/components/admin/career-detail-view';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CareerDetailPage({ params }: Props) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const career = await prisma.career.findUnique({
    where: { id }
  });

  if (!career) {
    redirect('/admin/careers');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CareerDetailView career={career} />
      </div>
    </div>
  );
}
