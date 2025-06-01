import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { QuestionForm } from '@/components/admin/questions/question-form'

export default async function CreateQuestionPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== 'admin') {
    redirect('/?error=unauthorized')
  }

  // Get the next order number for each section
  const maxOrders = await prisma.question.groupBy({
    by: ['section'],
    _max: {
      order: true
    }
  })

  const nextOrderBySections = {
    aptitude: (maxOrders.find(m => m.section === 'aptitude')?._max.order || 0) + 1,
    personality: (maxOrders.find(m => m.section === 'personality')?._max.order || 0) + 1,
    interest: (maxOrders.find(m => m.section === 'interest')?._max.order || 0) + 1,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Question</h1>
        <p className="text-gray-600">Add a new assessment question</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <QuestionForm nextOrderBySections={nextOrderBySections} />
      </div>
    </div>
  )
}
