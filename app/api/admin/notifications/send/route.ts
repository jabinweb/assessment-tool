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

    const { title, message, type, targetGroup } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    // Get target users based on group
    let targetUsers = []
    
    switch (targetGroup) {
      case 'all':
        targetUsers = await prisma.user.findMany({
          select: { id: true, email: true, name: true }
        })
        break
      case 'active':
        targetUsers = await prisma.user.findMany({
          where: {
            answers: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          },
          select: { id: true, email: true, name: true }
        })
        break
      case 'completed':
        targetUsers = await prisma.user.findMany({
          where: {
            reports: {
              some: {}
            }
          },
          select: { id: true, email: true, name: true }
        })
        break
      case 'pending':
        targetUsers = await prisma.user.findMany({
          where: {
            reports: {
              none: {}
            }
          },
          select: { id: true, email: true, name: true }
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid target group' }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Store the notification in a notifications table
    // 2. Send emails using a service like SendGrid/Nodemailer
    // 3. Push notifications to connected clients via WebSocket/SSE
    // 4. Log the notification for audit purposes

    console.log(`Sending notification to ${targetUsers.length} users:`, {
      title,
      message,
      type,
      targetGroup
    })

    // Simulate sending notifications
    // In production, implement actual email/push notification logic here

    return NextResponse.json({
      success: true,
      sentTo: targetUsers.length,
      message: `Notification sent to ${targetUsers.length} users`
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
