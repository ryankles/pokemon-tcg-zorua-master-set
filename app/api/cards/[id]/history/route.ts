import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const history = await prisma.priceHistory.findMany({
      where: { cardId: id },
      orderBy: { recordedAt: 'asc' },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { price } = await request.json();

    const priceRecord = await prisma.priceHistory.create({
      data: {
        cardId: id,
        price,
      },
    });

    return NextResponse.json(priceRecord);
  } catch (error) {
    console.error('Error creating price history:', error);
    return NextResponse.json(
      { error: 'Failed to create price history' },
      { status: 500 }
    );
  }
}
