import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const data = await request.json()

    const question = await prisma.question.create({
      data: {
        section: data.section,
        subDomain: data.subDomain,
        type: data.type,
        text: data.text,
        options: data.options,
        order: data.order,
        timeLimit: data.timeLimit,
        difficulty: data.difficulty,
        trait: data.trait,
        riasecCode: data.riasecCode
      }
    })

    return NextResponse.json(question)

  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: [
        { section: 'asc' },
        { order: 'asc' }
      ]
    })

    return NextResponse.json(questions)

  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
