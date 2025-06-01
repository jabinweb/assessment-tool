import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
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

    const settings = await request.json()

    // Validate settings
    const { scoringWeights, timeouts, features } = settings

    // Validate scoring weights sum to 100
    const totalWeight = Object.values(scoringWeights).reduce((sum: number, weight: any) => sum + weight, 0)
    if (Math.abs(totalWeight - 100) > 1) {
      return NextResponse.json({ error: 'Scoring weights must sum to 100%' }, { status: 400 })
    }

    // In a real application, you would store these settings in a database
    // For now, we'll just log them and return success
    console.log('Settings updated:', settings)

    // You could create a Settings model in your schema and store these values:
    // await prisma.settings.upsert({
    //   where: { id: 'system' },
    //   update: { 
    //     scoringWeights: scoringWeights,
    //     timeouts: timeouts,
    //     features: features,
    //     updatedAt: new Date()
    //   },
    //   create: {
    //     id: 'system',
    //     scoringWeights: scoringWeights,
    //     timeouts: timeouts,
    //     features: features
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    // Return current settings
    // In a real app, fetch from database
    const defaultSettings = {
      scoringWeights: {
        aptitude: 40,
        personality: 35,
        interest: 25
      },
      timeouts: {
        sessionTimeout: 30,
        assessmentTimeout: 60
      },
      features: {
        allowRetakes: false,
        showProgressBar: true,
        randomizeQuestions: false,
        emailNotifications: true
      }
    }

    return NextResponse.json(defaultSettings)

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
