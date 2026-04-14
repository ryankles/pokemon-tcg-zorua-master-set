import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DashboardStats } from '@/lib/types';

// GET /api/stats/dashboard
export async function GET(_request: NextRequest) {
  try {
    const cards = await prisma.card.findMany();
    
    const ownedCards = cards.filter(c => c.owned);
    const missingCards = cards.filter(c => !c.owned);
    
    const totalValue = ownedCards.reduce((sum, card) => {
      return sum + (card.currentPrice || 0);
    }, 0);

    const stats: DashboardStats = {
      totalCards: cards.length,
      ownedCards: ownedCards.length,
      missingCards: missingCards.length,
      completionPercentage: Math.round((ownedCards.length / cards.length) * 100),
      totalValue,
      recentAcquisitions: ownedCards
        .sort((a, b) => {
          const dateA = a.acquiredDate ? new Date(a.acquiredDate).getTime() : 0;
          const dateB = b.acquiredDate ? new Date(b.acquiredDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
