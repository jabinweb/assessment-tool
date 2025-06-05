import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessmentTypes = await prisma.assessmentType.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            assessmentSessions: true
          }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(assessmentTypes)
  } catch (error) {
    console.error('Error fetching assessment types:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
        
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // If this is set as default, update other defaults
    if (data.isDefault) {
      await prisma.assessmentType.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const assessmentType = await prisma.assessmentType.create({
      data: {
        ...data,
        createdBy: session.user.id,
        updatedBy: session.user.id
      }
    })

    return NextResponse.json(assessmentType)
  } catch (error) {
    console.error('Error creating assessment type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
