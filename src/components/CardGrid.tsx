'use client';

import { Card } from '@prisma/client';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface CardGridProps {
  cards: Card[];
  onCardUpdate?: (cardId: string, owned: boolean) => void;
}

export default function CardGrid({ cards, onCardUpdate }: CardGridProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleOwned = async (card: Card) => {
    setLoadingId(card.id);
    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owned: !card.owned }),
      });

      if (response.ok) {
        onCardUpdate?.(card.id, !card.owned);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link key={card.id} href={`/card/${card.id}`}>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{card.cardName}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  card.owned
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {card.owned ? '✓ Owned' : 'Missing'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">{card.pokemon}</p>
            <p className="text-sm text-gray-500 mb-3">
              {card.setName} #{card.cardNumber}
            </p>

            {card.currentPrice && (
              <p className="text-lg font-bold text-primary mb-3">
                {formatCurrency(card.currentPrice)}
              </p>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleOwned(card);
              }}
              disabled={loadingId === card.id}
              className="w-full py-2 px-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {loadingId === card.id
                ? 'Updating...'
                : card.owned
                  ? 'Mark as Missing'
                  : 'Mark as Owned'}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
