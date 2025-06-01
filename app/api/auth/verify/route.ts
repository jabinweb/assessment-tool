import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' }, 
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email as string }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 401 }
      )
    }

    // Verify password
    const [hashedPassword, salt] = user.password.split(':')
    const verifyHash = createHash('sha256').update(password + salt).digest('hex')
    
    if (hashedPassword !== verifyHash) {
      return NextResponse.json(
        { error: 'Invalid password' }, 
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role
    })

  } catch (error) {
    console.error('Verification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
