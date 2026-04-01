import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: {
      reviewer: { select: { id: true, name: true } },
    },
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null;

  return NextResponse.json({ reviews, averageRating });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = (await request.json()) as {
      productId?: string;
      rating?: number;
      comment?: string;
    };

    if (!productId || !rating || !comment?.trim()) {
      return NextResponse.json({ error: 'productId, rating and comment are required.' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const purchase = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          paymentStatus: 'paid',
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'You can only review items you purchased.' }, { status: 403 });
    }

    const review = await prisma.review.upsert({
      where: {
        productId_reviewerId: {
          productId,
          reviewerId: session.user.id,
        },
      },
      update: {
        rating,
        comment: comment.trim(),
      },
      create: {
        productId,
        reviewerId: session.user.id,
        rating,
        comment: comment.trim(),
      },
    });

    const aggregation = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { ratings: aggregation._avg.rating ?? null },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Create review failed:', error);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
