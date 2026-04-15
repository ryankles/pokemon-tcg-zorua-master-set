import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePrice, ValidationError } from '@/lib/validation';

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

    // Validate price input
    try {
      validatePrice(price);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

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
