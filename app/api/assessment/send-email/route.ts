import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, reportId } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const report = await prisma.report.findUnique({
      where: { id: reportId }
    });

    if (!user || !report) {
      return NextResponse.json({ error: 'User or report not found' }, { status: 404 });
    }

    // TODO: Implement actual email sending using services like Resend, SendGrid, etc.
    // For now, simulate email sending
    console.log(`Sending assessment results to ${user.email}`);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Assessment Results Sent',
        message: `Your career assessment results have been sent to ${user.email}`,
        type: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Results sent to ${user.email}`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}