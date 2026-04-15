import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await prisma.card.findUnique({
      where: { id },
      include: { priceHistory: { orderBy: { recordedAt: 'desc' }, take: 30 } },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const card = await prisma.card.update({
      where: { id },
      data: {
        owned: body.owned !== undefined ? body.owned : undefined,
        favorite: body.favorite !== undefined ? body.favorite : undefined,
        purchasePrice: body.purchasePrice,
        currentPrice: body.currentPrice,
        condition: body.condition,
        acquiredDate: body.acquiredDate
          ? new Date(body.acquiredDate)
          : undefined,
        notes: body.notes,
        wishlistPriority: body.wishlistPriority,
        imageUrl: body.imageUrl,
      },
    });

    // Record price history if price was updated
    if (body.currentPrice && card.currentPrice !== body.currentPrice) {
      await prisma.priceHistory.create({
        data: {
          cardId: id,
          price: body.currentPrice,
        },
      });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}
