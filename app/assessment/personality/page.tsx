import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AssessmentSection } from '@/components/assessment/assessment-section';

export default async function PersonalityPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <AssessmentSection 
      section="personality"
      title="Personality Profile"
      description="Understand your personality traits and work preferences"
      nextSection="/assessment/interest"
    />
  );
}
