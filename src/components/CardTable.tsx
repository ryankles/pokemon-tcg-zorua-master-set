'use client';

import { Card } from '@prisma/client';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface CardTableProps {
  cards: Card[];
  onCardUpdate?: (cardId: string, owned: boolean) => void;
}

export default function CardTable({ cards, onCardUpdate }: CardTableProps) {
  const handleToggle = async (card: Card) => {
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
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              Pokémon
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              Card Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              Set
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
              Number
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
              Price
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{card.pokemon}</td>
              <td className="px-6 py-4 text-sm">
                <Link
                  href={`/card/${card.id}`}
                  className="text-primary hover:underline"
                >
                  {card.cardName}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {card.setName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {card.cardNumber}
              </td>
              <td className="px-6 py-4 text-sm text-right font-semibold">
                {formatCurrency(card.currentPrice)}
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    card.owned
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {card.owned ? '✓ Owned' : 'Missing'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <button
                  onClick={() => handleToggle(card)}
                  className="text-primary hover:font-semibold transition"
                >
                  {card.owned ? 'Mark Missing' : 'Mark Owned'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
