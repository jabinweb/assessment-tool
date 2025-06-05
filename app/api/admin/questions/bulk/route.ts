import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, questionIds, data } = await request.json()

    if (!action || !questionIds || !Array.isArray(questionIds)) {
      return NextResponse.json({ 
        error: 'Missing required fields: action, questionIds' 
      }, { status: 400 })
    }

    let result

    switch (action) {
      case 'activate':
        result = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { isActive: true }
        })
        break

      case 'deactivate':
        result = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { isActive: false }
        })
        break

      case 'update_assessment_type':
        if (!data?.assessmentTypeId) {
          return NextResponse.json({ 
            error: 'assessmentTypeId required for update_assessment_type action' 
          }, { status: 400 })
        }
        result = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { assessmentTypeId: data.assessmentTypeId }
        })
        break

      case 'update_complexity':
        if (!data?.complexity) {
          return NextResponse.json({ 
            error: 'complexity required for update_complexity action' 
          }, { status: 400 })
        }
        result = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { complexity: data.complexity }
        })
        break

      case 'delete':
        // Check if any questions have answers
        const answersCount = await prisma.answer.count({
          where: { questionId: { in: questionIds } }
        })

        if (answersCount > 0) {
          return NextResponse.json({ 
            error: 'Cannot delete questions with existing answers. Consider deactivating instead.' 
          }, { status: 400 })
        }

        result = await prisma.question.deleteMany({
          where: { id: { in: questionIds } }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      affected: result.count || questionIds.length 
    })
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
