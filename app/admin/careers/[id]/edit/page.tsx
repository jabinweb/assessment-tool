import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CareerEditForm } from '@/components/admin/career-edit-form';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCareerPage({ params }: Props) {
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Career</h1>
            <p className="text-gray-600 mt-1">
              Modify career details and assessment requirements.
            </p>
          </div>
          <CareerEditForm career={career} />
        </div>
      </div>
    </div>
  );
}
