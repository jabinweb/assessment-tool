import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Add debugging
    console.log('Registration request received')
    
    const body = await request.json();
    console.log('Request body:', { ...body, password: '[HIDDEN]' })
    
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      console.log('Invalid field types')
      return NextResponse.json(
        { message: 'Invalid field types' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Password too short')
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format')
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password using crypto (built-in Node.js module)
    console.log('Hashing password')
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHash('sha256').update(password + salt).digest('hex') + ':' + salt;

    // Create user
    console.log('Creating user in database')
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user'
      }
    });

    console.log('User created successfully:', user.id)

    // Return success (without password)
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: 'User already exists with this email' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
