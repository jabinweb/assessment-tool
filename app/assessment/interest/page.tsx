import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AssessmentSection } from '@/components/assessment/assessment-section';

export default async function InterestPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <AssessmentSection 
      section="interest"
      title="Interest Inventory"
      description="Discover your career interests and preferences"
      nextSection="/assessment/complete"
    />
  );
}
