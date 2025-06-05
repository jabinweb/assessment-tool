import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const assessmentType = await prisma.assessmentType.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            section: true,
            subDomain: true,
            order: true,
            difficulty: true,
            isActive: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            questions: true,
            assessmentSessions: true
          }
        }
      }
    })

    if (!assessmentType) {
      return NextResponse.json({ error: 'Assessment type not found' }, { status: 404 })
    }

    return NextResponse.json(assessmentType)
  } catch (error) {
    console.error('Error fetching assessment type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    
    // Remove read-only and nested fields that shouldn't be updated
    const { 
      id: _id, 
      createdAt, 
      updatedAt, 
      createdBy,
      questions, 
      _count, 
      assessmentSessions,
      ...updateData 
    } = data
    
    // If this is set as default, update other defaults
    if (updateData.isDefault) {
      await prisma.assessmentType.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    const assessmentType = await prisma.assessmentType.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: session.user.id
      }
    })

    return NextResponse.json(assessmentType)
  } catch (error) {
    console.error('Error updating assessment type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if there are active sessions using this assessment type
    const sessionsCount = await prisma.assessmentSession.count({
      where: { assessmentTypeId: id }
    })

    if (sessionsCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete assessment type with active sessions' 
      }, { status: 400 })
    }

    await prisma.assessmentType.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assessment type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
