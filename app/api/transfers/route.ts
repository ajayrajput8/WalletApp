export const dynamic = 'force-dynamic'; // MUST be at the very top

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { recipientPhone, amount, description } = await request.json();

    if (!recipientPhone || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid transfer details' },
        { status: 400 }
      );
    }

    // Find sender
    const sender = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: { wallet: true },
    });

    if (!sender || !sender.wallet) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Find recipient by phone
    const recipient = await prisma.user.findUnique({
      where: { phone: recipientPhone },
      include: { wallet: true },
    });

    if (!recipient || !recipient.wallet) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    if (sender.id === recipient.id) {
      return NextResponse.json(
        { error: 'Cannot transfer to yourself' },
        { status: 400 }
      );
    }

    if (sender.wallet.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          fromUserId: sender.id,
          toUserId: recipient.id,
          fromWalletId: sender?.wallet.id,
          toWalletId: recipient?.wallet.id,
          amount,
          description: description || 'Money transfer',
          status: 'COMPLETED',
        },
      });

      await tx.wallet.update({
        where: { id: sender.wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { id: recipient.wallet.id },
        data: { balance: { increment: amount } },
      });

      return payment;
    });

    return NextResponse.json({
      message: 'Transfer completed successfully',
      payment: result,
    });
  } catch (error) {
    console.error('Error processing transfer:', error);
    return NextResponse.json(
      { error: 'Failed to process transfer' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const transactions = await prisma.payment.findMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id },
        ],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
