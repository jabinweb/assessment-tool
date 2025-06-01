import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updatedCareer = await prisma.career.update({
      where: { id },
      data: { isActive: body.isActive }
    });

    return NextResponse.json({
      message: 'Career status updated successfully',
      career: updatedCareer
    });

  } catch (error) {
    console.error('Career update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.career.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Career deleted successfully'
    });

  } catch (error) {
    console.error('Career delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updatedCareer = await prisma.career.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        industry: body.industry,
        educationLevel: body.educationLevel,
        workStyle: body.workStyle,
        workEnvironment: body.workEnvironment,
        growthOutlook: body.growthOutlook,
        requiredSkills: body.requiredSkills,
        riasecProfile: body.riasecProfile,
        personalityFit: body.personalityFit,
        salaryRange: body.salaryRange,
        isActive: body.isActive
      }
    });

    return NextResponse.json({
      message: 'Career updated successfully',
      career: updatedCareer
    });

  } catch (error) {
    console.error('Career update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
