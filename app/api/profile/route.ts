import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gradeLevel: true,
        schoolName: true,
        counselorEmail: true,
        parentEmail: true,
        preferredLanguage: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        lastActiveAt: true,
        notifications: {
          where: { isRead: false },
          select: { id: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        emailVerified: user.emailVerified?.toISOString() || null,
        lastActiveAt: user.lastActiveAt?.toISOString() || null,
        notifications: undefined // Remove from response
      },
      notificationCount: user.notifications.length
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      age,
      gradeLevel,
      schoolName,
      counselorEmail,
      parentEmail,
      preferredLanguage
    } = body;

    // Validate age if provided
    if (age && (age < 13 || age > 25)) {
      return NextResponse.json(
        { message: 'Age must be between 13 and 25' },
        { status: 400 }
      );
    }

    // Validate email formats if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (counselorEmail && !emailRegex.test(counselorEmail)) {
      return NextResponse.json(
        { message: 'Invalid counselor email format' },
        { status: 400 }
      );
    }
    if (parentEmail && !emailRegex.test(parentEmail)) {
      return NextResponse.json(
        { message: 'Invalid parent email format' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
        age: age ? parseInt(age) : null,
        gradeLevel: gradeLevel || null,
        schoolName: schoolName || null,
        counselorEmail: counselorEmail || null,
        parentEmail: parentEmail || null,
        preferredLanguage: preferredLanguage || 'en',
        lastActiveAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        gradeLevel: updatedUser.gradeLevel,
        schoolName: updatedUser.schoolName,
        counselorEmail: updatedUser.counselorEmail,
        parentEmail: updatedUser.parentEmail,
        preferredLanguage: updatedUser.preferredLanguage
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const updateData = {
      name: data.name || null,
      age: data.age || null,
      gradeLevel: data.gradeLevel || null,
      schoolName: data.schoolName || null,
      counselorEmail: data.counselorEmail || null,
      parentEmail: data.parentEmail || null,
      educationLevel: data.educationLevel || null,
      targetAudience: data.targetAudience || null,
      assessmentProfile: data.assessmentProfile || null,
      preferredLanguage: data.preferredLanguage || 'en'
    };

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
