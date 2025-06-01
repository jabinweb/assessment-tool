import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AssessmentSection } from '@/components/assessment/assessment-section';

export default async function AptitudePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <AssessmentSection 
      section="aptitude"
      title="Aptitude Assessment"
      description="Test your logical reasoning, numerical skills, and verbal abilities"
      nextSection="/assessment/personality"
    />
  );
}
