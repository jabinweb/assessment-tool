import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        assessmentType: {
          select: {
            id: true,
            name: true,
            code: true,
            targetAudience: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
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

    // Remove read-only fields
    const { 
      id: _id, 
      createdAt, 
      updatedAt,
      answers,
      assessmentType,
      _count,
      ...updateData 
    } = data

    const question = await prisma.question.update({
      where: { id },
      data: updateData,
      include: {
        assessmentType: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error updating question:', error)
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

    // Check if there are answers for this question
    const answersCount = await prisma.answer.count({
      where: { questionId: id }
    })

    if (answersCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete question with existing answers. Consider deactivating instead.' 
      }, { status: 400 })
    }

    await prisma.question.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
