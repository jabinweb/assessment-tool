import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ReportDetails } from '@/components/admin/reports/report-details'

export default async function ReportDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
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

  const { id } = await params

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          age: true
        }
      }
    }
  })

  if (!report) {
    notFound()
  }

  return (
    <div>
      <ReportDetails report={report} />
    </div>
  )
}
