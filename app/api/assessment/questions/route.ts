import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    let questions;
    if (section) {
      questions = await prisma.question.findMany({
        where: { section },
        orderBy: { order: 'asc' }
      });
    } else {
      questions = await prisma.question.findMany({
        orderBy: { order: 'asc' }
      });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}