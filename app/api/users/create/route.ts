import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const { name, phone, email } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', user: existingUser });
    }

    // Create user with wallet (100 rupees default balance)
    const user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email,
        phone,
        name,
        wallet: {
          create: {
            balance: 100.0,
          },
        },
      },
      include: {
        wallet: true,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}