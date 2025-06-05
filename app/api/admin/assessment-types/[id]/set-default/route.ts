import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Remove default from all other assessment types
    await prisma.assessmentType.updateMany({
      where: { isDefault: true },
      data: { isDefault: false }
    })

    // Set this assessment type as default
    const assessmentType = await prisma.assessmentType.update({
      where: { id },
      data: { 
        isDefault: true,
        updatedBy: session.user.id
      }
    })

    return NextResponse.json(assessmentType)
  } catch (error) {
    console.error('Error setting default assessment type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
