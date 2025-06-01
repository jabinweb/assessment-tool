import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (!report.pdfUrl) {
      return NextResponse.json({ error: 'PDF not available' }, { status: 404 })
    }

    // For now, return the PDF URL - in production, you'd fetch and return the actual file
    return NextResponse.json({ downloadUrl: report.pdfUrl })

  } catch (error) {
    console.error('Error downloading report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
