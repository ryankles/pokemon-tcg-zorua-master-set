import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  validatePrice,
  validateWishlistPriority,
  validateCondition,
  validateDate,
  ValidationError,
} from '@/lib/validation';

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

    // Validate all input fields
    try {
      if (body.currentPrice !== undefined && body.currentPrice !== null) {
        validatePrice(body.currentPrice);
      }
      if (body.purchasePrice !== undefined && body.purchasePrice !== null) {
        validatePrice(body.purchasePrice);
      }
      if (body.wishlistPriority !== undefined && body.wishlistPriority !== null) {
        validateWishlistPriority(body.wishlistPriority);
      }
      if (body.condition !== undefined && body.condition !== null) {
        validateCondition(body.condition);
      }
      if (body.acquiredDate !== undefined && body.acquiredDate !== null) {
        validateDate(body.acquiredDate);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    // FIX #2: Get the OLD card data BEFORE update to compare prices
    const oldCard = await prisma.card.findUnique({ where: { id } });
    if (!oldCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Determine if price actually changed
    const priceChanged = body.currentPrice !== undefined && oldCard.currentPrice !== body.currentPrice;

    // Perform the update
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        owned: body.owned !== undefined ? body.owned : undefined,
        favorite: body.favorite !== undefined ? body.favorite : undefined,
        purchasePrice: body.purchasePrice,
        currentPrice: body.currentPrice,
        condition: body.condition,
        acquiredDate: body.acquiredDate ? new Date(body.acquiredDate) : undefined,
        notes: body.notes,
        wishlistPriority: body.wishlistPriority,
        imageUrl: body.imageUrl,
      },
    });

    // FIX #2: Only create price history if price actually changed
    if (priceChanged && body.currentPrice !== null) {
      await prisma.priceHistory.create({
        data: {
          cardId: id,
          price: body.currentPrice,
        },
      });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}
