import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PortfolioStats } from '@/lib/types';

export async function GET(_request: NextRequest) {
  try {
    const cards = await prisma.card.findMany();
    const ownedCards = cards.filter(c => c.owned);

    // Calculate value by Pokémon
    const valueByPokemon: Record<string, number> = {};
    const ownedByPokemon: Record<string, number> = {};
    const totalByPokemon: Record<string, number> = {};

    cards.forEach(card => {
      if (!totalByPokemon[card.pokemon]) {
        totalByPokemon[card.pokemon] = 0;
      }
      totalByPokemon[card.pokemon]++;

      if (card.owned) {
        if (!ownedByPokemon[card.pokemon]) {
          ownedByPokemon[card.pokemon] = 0;
        }
        ownedByPokemon[card.pokemon]++;

        if (!valueByPokemon[card.pokemon]) {
          valueByPokemon[card.pokemon] = 0;
        }
        valueByPokemon[card.pokemon] += card.currentPrice || 0;
      }
    });

    // Calculate value by Set
    const valueBySet: Record<string, number> = {};
    ownedCards.forEach(card => {
      if (!valueBySet[card.setName]) {
        valueBySet[card.setName] = 0;
      }
      valueBySet[card.setName] += card.currentPrice || 0;
    });

    const totalValue = ownedCards.reduce((sum, card) => {
      return sum + (card.currentPrice || 0);
    }, 0);

    const stats: PortfolioStats = {
      totalValue,
      valueByPokemon,
      valueBySet,
      ownedByPokemon,
      totalByPokemon,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio stats' },
      { status: 500 }
    );
  }
}
