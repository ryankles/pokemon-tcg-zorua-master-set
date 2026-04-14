import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pokemon = searchParams.get('pokemon');
    const owned = searchParams.get('owned');
    const setName = searchParams.get('set');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const sort = searchParams.get('sort') || 'created';

    // Build filter conditions
    const where: any = {};

    if (pokemon) {
      where.pokemon = pokemon;
    }

    if (owned) {
      where.owned = owned === 'true';
    }

    if (setName) {
      where.setName = setName;
    }

    if (search) {
      where.OR = [
        { cardName: { contains: search, mode: 'insensitive' } },
        { pokemon: { contains: search, mode: 'insensitive' } },
        { setName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'owned') {
      orderBy = { owned: 'desc' };
    } else if (sort === 'price') {
      orderBy = { currentPrice: 'desc' };
    }

    const cards = await prisma.card.findMany({
      where,
      orderBy,
      take: limit,
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.pokemon || !body.cardName || !body.setName || !body.cardNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({
      data: {
        pokemon: body.pokemon,
        cardName: body.cardName,
        setName: body.setName,
        cardNumber: body.cardNumber,
        owned: body.owned || false,
        purchasePrice: body.purchasePrice || null,
        currentPrice: body.currentPrice || null,
        condition: body.condition || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
