import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { UserDetails } from '@/components/admin/users/user-details'

export default async function UserDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (adminUser?.role !== 'admin') {
    redirect('/?error=unauthorized')
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      reports: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              section: true,
              text: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          answers: true,
          reports: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <div>
      <UserDetails user={user} />
    </div>
  )
}
