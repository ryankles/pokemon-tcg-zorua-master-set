import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  validatePrice,
  validateSort,
  validateOrder,
  validatePagination,
  ValidationError,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pokemon = searchParams.get('pokemon');
    const owned = searchParams.get('owned');
    const favorite = searchParams.get('favorite');
    const setName = searchParams.get('set');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'cardName';
    const order = searchParams.get('order') || 'asc';
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '100');

    // Validate inputs
    try {
      validateSort(sort);
      validateOrder(order);
      validatePagination(skip, take);

      if (minPrice !== null) validatePrice(minPrice);
      if (maxPrice !== null) validatePrice(maxPrice);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    const where: any = {};

    if (pokemon) where.pokemon = pokemon;
    if (owned !== null) where.owned = owned === 'true';
    if (favorite !== null) where.favorite = favorite === 'true';
    if (setName) where.setName = setName;

    if (minPrice || maxPrice) {
      where.currentPrice = {};
      if (minPrice) where.currentPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.currentPrice.lte = parseFloat(maxPrice);
    }

    const orderBy: any = {};
    orderBy[sort] = order;

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.card.count({ where }),
    ]);

    return NextResponse.json({ cards, total, skip, take });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}
