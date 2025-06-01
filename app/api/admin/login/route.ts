import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // In a real implementation, you would verify the password using bcrypt
    // For this example, we'll simulate password verification
    // This should be replaced with proper password hashing and verification
    const isPasswordValid = true; // Replace with actual password verification
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate a session token
    // In a real implementation, you would use a proper authentication system
    // For this example, we'll simulate session creation
    
    return NextResponse.json({ 
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}